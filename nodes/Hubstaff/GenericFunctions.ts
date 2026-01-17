import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

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

	const options: IRequestOptions = {
		method,
		body,
		qs,
		url: `https://api.hubstaff.com/v2${endpoint}`,
		json: true,
	};

	// Clean up empty body and query string
	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(this, 'hubstaffApi', options);
		return response;
	} catch (error) {
		// Enhanced error handling
		const errorResponse = error as any;

		// Handle rate limiting
		if (errorResponse.statusCode === 429) {
			throw new NodeApiError(this.getNode(), errorResponse as JsonObject, {
				message: 'Hubstaff API rate limit exceeded. You are allowed 1,000 requests per hour.',
				description: 'Please wait before making more requests or reduce the frequency of your workflow.',
			});
		}

		// Handle authentication errors
		if (errorResponse.statusCode === 401) {
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
