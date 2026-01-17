import type { INodeProperties } from 'n8n-workflow';

export const activityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['activity'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all activities',
				action: 'Get all activities',
			},
		],
		default: 'getAll',
	},
];

export const activityFields: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for activities (YYYY-MM-DD)',
	},
	{
		displayName: 'Stop Date',
		name: 'stopDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Stop date for activities (YYYY-MM-DD)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Use Daily Endpoint',
				name: 'useDaily',
				type: 'boolean',
				default: true,
				description: 'Whether to use the daily activities endpoint (faster, pre-aggregated)',
			},
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
