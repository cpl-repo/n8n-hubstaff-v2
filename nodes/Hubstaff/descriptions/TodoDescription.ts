import type { INodeProperties } from 'n8n-workflow';

export const todoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['todo'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a global to-do',
				action: 'Create a global to-do',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a global to-do',
				action: 'Delete a global to-do',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all global to-dos',
				action: 'Get all global to-dos',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a global to-do',
				action: 'Update a global to-do',
			},
		],
		default: 'getAll',
	},
];

export const todoFields: INodeProperties[] = [
	// To-do ID for update, delete
	{
		displayName: 'To-Do ID',
		name: 'todoId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the global to-do',
	},

	// Name for create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the global to-do',
	},

	// Additional Fields for create
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Project IDs',
				name: 'projectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to add this to-do to',
			},
		],
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
				resource: ['todo'],
				operation: ['getAll'],
			},
		},
		options: [
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

	// Update Fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the global to-do',
			},
			{
				displayName: 'Add Project IDs',
				name: 'addProjectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to add this to-do to',
			},
			{
				displayName: 'Remove Project IDs',
				name: 'removeProjectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to remove this to-do from',
			},
		],
	},
];
