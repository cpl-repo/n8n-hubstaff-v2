import type { INodeProperties } from 'n8n-workflow';

export const timeEntryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all time entries',
				action: 'Get all time entries',
			},
		],
		default: 'getAll',
	},
];

export const timeEntryFields: INodeProperties[] = [
	// Common fields
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
			},
		},
		default: '',
		description: 'The ID of the organization',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for time entries (YYYY-MM-DD)',
	},
	{
		displayName: 'Stop Date',
		name: 'stopDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Stop date for time entries (YYYY-MM-DD)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeEntry'],
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
