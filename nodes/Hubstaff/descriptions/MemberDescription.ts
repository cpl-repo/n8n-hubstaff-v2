import type { INodeProperties } from 'n8n-workflow';

export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a member',
				action: 'Get a member',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all members',
				action: 'Get all members',
			},
		],
		default: 'getAll',
	},
];

export const memberFields: INodeProperties[] = [
	// Get
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the member',
	},

	// Get All
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Include Removed',
				name: 'includeRemoved',
				type: 'boolean',
				default: false,
				description: 'Whether to include removed members',
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
