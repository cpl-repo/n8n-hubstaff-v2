import type { INodeProperties } from 'n8n-workflow';

export const urlOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['url'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all URL tracking data',
				action: 'Get all URL tracking data',
			},
		],
		default: 'getAll',
	},
];

export const urlFields: INodeProperties[] = [
	// Organization ID
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['url'],
			},
		},
		default: '',
		description: 'The ID of the organization',
	},

	// Start Date
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['url'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for URL data (YYYY-MM-DD)',
	},

	// Stop Date
	{
		displayName: 'Stop Date',
		name: 'stopDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['url'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Stop date for URL data (YYYY-MM-DD)',
	},

	// Additional Fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['url'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user IDs to filter by',
			},
			{
				displayName: 'Project IDs',
				name: 'projectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to filter by',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number for pagination',
			},
		],
	},
];
