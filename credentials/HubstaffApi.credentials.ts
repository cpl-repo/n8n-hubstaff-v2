import type {
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
			description: 'Your Hubstaff Personal Access Token (refresh token). Generate one at https://developer.hubstaff.com/personal_access_tokens. Note: This token will be exchanged for an access token automatically.',
		},
		{
			displayName: 'Organization ID',
			name: 'organizationId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Hubstaff Organization ID. Find it in your Hubstaff dashboard URL or via the API.',
		},
	];
}
