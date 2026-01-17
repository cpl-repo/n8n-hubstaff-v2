import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HubstaffApi implements ICredentialType {
	name = 'hubstaffApi';
	displayName = 'Hubstaff Personal Access Token';
	documentationUrl = 'https://developer.hubstaff.com/docs/hubstaff_v2';
	properties: INodeProperties[] = [
		{
			displayName: 'Personal Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Hubstaff Personal Access Token. Generate one at https://developer.hubstaff.com/',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.hubstaff.com/v2',
			url: '/users/me',
		},
	};
}
