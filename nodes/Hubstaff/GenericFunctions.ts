import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

// Cache for access tokens (in-memory, per execution)
const tokenCache: Map<string, { accessToken: string; refreshToken: string; expiresAt: number }> = new Map();

/**
 * Exchange Personal Access Token (refresh token) for access token
 * Per Hubstaff docs: POST to token_endpoint with grant_type=refresh_token
 * No client_id or client_secret needed for Personal Access Tokens
 */
async function getAccessToken(
	context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	refreshToken: string,
): Promise<string> {
	const cacheKey = refreshToken.substring(0, 20);
	const cached = tokenCache.get(cacheKey);

	// Return cached token if still valid (with 5 minute buffer)
	if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
		return cached.accessToken;
	}

	// Use the latest refresh token (may have been updated from previous exchange)
	const currentRefreshToken = cached?.refreshToken || refreshToken;

	try {
		const response = await context.helpers.httpRequest({
			method: 'POST',
			url: 'https://account.hubstaff.com/access_tokens',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(currentRefreshToken)}`,
			returnFullResponse: false,
		});

		if (!response || !response.access_token) {
			throw new NodeOperationError(
				context.getNode(),
				'Failed to obtain access token from Hubstaff. The response did not contain an access token.',
			);
		}

		// Cache the access token and new refresh token
		const expiresIn = response.expires_in || 86400;
		tokenCache.set(cacheKey, {
			accessToken: response.access_token,
			refreshToken: response.refresh_token || currentRefreshToken,
			expiresAt: Date.now() + expiresIn * 1000,
		});

		return response.access_token;
	} catch (error: any) {
		// Clear any cached token on error
		tokenCache.delete(cacheKey);

		const errorMessage = error.message || 'Unknown error during token exchange';
		throw new NodeOperationError(
			context.getNode(),
			`Failed to exchange Personal Access Token for access token: ${errorMessage}. Please verify your token is valid and not expired.`,
		);
	}
}

/**
 * Make an authenticated API request to Hubstaff
 */
export async function hubstaffApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	// Validate endpoint
	if (!endpoint || !endpoint.startsWith('/')) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid endpoint format: ${endpoint}. Endpoint must start with '/'`,
		);
	}

	// Get credentials
	const credentials = await this.getCredentials('hubstaffApi');
	const refreshToken = credentials.accessToken as string;

	if (!refreshToken) {
		throw new NodeOperationError(
			this.getNode(),
			'No Personal Access Token configured. Please add your Hubstaff Personal Access Token in the credentials.',
		);
	}

	// Get access token (exchanges refresh token if needed)
	const accessToken = await getAccessToken(this, refreshToken);

	// Build request options
	const options: any = {
		method,
		url: `https://api.hubstaff.com/v2${endpoint}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		returnFullResponse: false,
	};

	// Add query string parameters
	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	// Add body for non-GET requests
	if (method !== 'GET' && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response;
	} catch (error: any) {
		const statusCode = error.statusCode || error.httpCode || error.code;

		// Handle rate limiting
		if (statusCode === 429) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Hubstaff API rate limit exceeded. You are allowed 1,000 requests per hour.',
				description: 'Please wait before making more requests or reduce the frequency of your workflow.',
			});
		}

		// Handle authentication errors
		if (statusCode === 401) {
			// Clear cached token
			const cacheKey = refreshToken.substring(0, 20);
			tokenCache.delete(cacheKey);

			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Authentication failed.',
				description: 'Your Personal Access Token may be invalid or expired. Generate a new one at https://developer.hubstaff.com/personal_access_tokens',
			});
		}

		// Handle forbidden errors
		if (statusCode === 403) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Access forbidden.',
				description: 'API access requires an active Hubstaff plan. Please check your subscription.',
			});
		}

		// Handle not found errors
		if (statusCode === 404) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Resource not found.',
				description: 'The requested resource does not exist or you do not have access to it.',
			});
		}

		// Handle validation errors
		if (statusCode === 422) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Validation error.',
				description: error.message || 'The data provided is invalid. Please check your input.',
			});
		}

		// Re-throw with better error message
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: `Hubstaff API request failed: ${error.message || 'Unknown error'}`,
		});
	}
}

/**
 * Format date to YYYY-MM-DD format for Hubstaff API
 */
export function formatDate(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj.toISOString().split('T')[0];
}
