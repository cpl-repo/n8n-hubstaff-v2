import type { INodeProperties } from 'n8n-workflow';

export const applicationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['application'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all application usage data',
				action: 'Get all application usage',
			},
		],
		default: 'getAll',
	},
];

export const applicationFields: INodeProperties[] = [
	// Start Date
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for application data (YYYY-MM-DD)',
	},

	// Stop Date
	{
		displayName: 'Stop Date',
		name: 'stopDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Stop date for application data (YYYY-MM-DD)',
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
				resource: ['application'],
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
