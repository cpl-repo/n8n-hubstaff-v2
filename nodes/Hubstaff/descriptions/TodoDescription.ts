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
				description: 'Create a to-do item',
				action: 'Create a to-do',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a to-do item',
				action: 'Delete a to-do',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a to-do item',
				action: 'Get a to-do',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all to-do items',
				action: 'Get all to-dos',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a to-do item',
				action: 'Update a to-do',
			},
		],
		default: 'getAll',
	},
];

export const todoFields: INodeProperties[] = [
	// To-do ID for get, update, delete
	{
		displayName: 'To-Do ID',
		name: 'todoId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the to-do item',
	},

	// Title for create
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the to-do item',
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the to-do item',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to assign the to-do to',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'The ID of the project for this to-do',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				description: 'The due date of the to-do item',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'normal',
				description: 'The priority of the to-do item',
			},
		],
	},

	// Filters for getAll
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['todo'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter to-dos by user',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Filter to-dos by project',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'All',
						value: 'all',
					},
				],
				default: 'active',
				description: 'Filter to-dos by status',
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
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the to-do item',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the to-do item',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to assign the to-do to',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
				],
				default: 'active',
				description: 'The status of the to-do item',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				description: 'The due date of the to-do item',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'normal',
				description: 'The priority of the to-do item',
			},
		],
	},
];
