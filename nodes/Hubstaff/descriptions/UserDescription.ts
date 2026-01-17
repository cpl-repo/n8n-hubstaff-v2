import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Current',
				value: 'getCurrent',
				description: 'Get the currently authenticated user',
				action: 'Get current user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all users in an organization',
				action: 'Get all users',
			},
		],
		default: 'getCurrent',
	},
];

export const userFields: INodeProperties[] = [
	// User ID for get
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},

	// Additional Fields for getAll
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Include Removed',
				name: 'includeRemoved',
				type: 'boolean',
				default: false,
				description: 'Whether to include removed users',
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
