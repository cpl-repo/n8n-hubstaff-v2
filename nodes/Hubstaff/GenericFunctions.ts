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
const tokenCache: Map<string, { accessToken: string; expiresAt: number }> = new Map();

/**
 * Exchange refresh token for access token
 */
async function getAccessToken(
	context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	refreshToken: string,
): Promise<string> {
	const cacheKey = refreshToken.substring(0, 20); // Use partial token as cache key
	const cached = tokenCache.get(cacheKey);

	// Return cached token if still valid (with 5 minute buffer)
	if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
		return cached.accessToken;
	}

	// Exchange refresh token for access token
	const response = await context.helpers.request({
		method: 'POST',
		url: 'https://account.hubstaff.com/access_tokens',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		},
		json: true,
	});

	if (!response.access_token) {
		throw new NodeOperationError(
			context.getNode(),
			'Failed to obtain access token. Please check your Personal Access Token (refresh token).',
		);
	}

	// Cache the access token
	const expiresIn = response.expires_in || 3600; // Default to 1 hour
	tokenCache.set(cacheKey, {
		accessToken: response.access_token,
		expiresAt: Date.now() + expiresIn * 1000,
	});

	return response.access_token;
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

	// Get access token (exchanges refresh token if needed)
	const accessToken = await getAccessToken(this, refreshToken);

	const options: IDataObject = {
		method,
		url: `https://api.hubstaff.com/v2${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		json: true,
	};

	if (Object.keys(body).length) {
		options.body = body;
	}

	if (Object.keys(qs).length) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error) {
		const errorResponse = error as any;

		// Handle rate limiting
		if (errorResponse.statusCode === 429) {
			throw new NodeApiError(this.getNode(), errorResponse as JsonObject, {
				message: 'Hubstaff API rate limit exceeded. You are allowed 1,000 requests per hour.',
				description: 'Please wait before making more requests or reduce the frequency of your workflow.',
			});
		}

		// Handle authentication errors - clear cache and retry once
		if (errorResponse.statusCode === 401) {
			// Clear cached token
			const cacheKey = refreshToken.substring(0, 20);
			tokenCache.delete(cacheKey);

			throw new NodeApiError(this.getNode(), errorResponse as JsonObject, {
				message: 'Authentication failed. Please check your Personal Access Token.',
				description: 'Your token may be invalid or expired. Generate a new one at https://developer.hubstaff.com/',
			});
		}

		// Handle not found errors
		if (errorResponse.statusCode === 404) {
			throw new NodeApiError(this.getNode(), errorResponse as JsonObject, {
				message: 'Resource not found.',
				description: 'The requested resource does not exist or you do not have access to it.',
			});
		}

		// Handle validation errors
		if (errorResponse.statusCode === 422) {
			throw new NodeApiError(this.getNode(), errorResponse as JsonObject, {
				message: 'Validation error.',
				description: errorResponse.message || 'The data provided is invalid. Please check your input.',
			});
		}

		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Format date to YYYY-MM-DD format for Hubstaff API
 */
export function formatDate(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj.toISOString().split('T')[0];
}
