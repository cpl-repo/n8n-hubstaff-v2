import type { INodeProperties } from 'n8n-workflow';

export const scheduleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a schedule',
				action: 'Create a schedule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a schedule',
				action: 'Delete a schedule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a schedule',
				action: 'Get a schedule',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all schedules',
				action: 'Get all schedules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a schedule',
				action: 'Update a schedule',
			},
		],
		default: 'getAll',
	},
];

export const scheduleFields: INodeProperties[] = [
	// Organization ID
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
			},
		},
		default: '',
		description: 'The ID of the organization',
	},

	// Schedule ID for get, update, delete
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the schedule',
	},

	// User ID for create
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The ID of the user to schedule',
	},

	// Start Time for create
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The start time of the schedule',
	},

	// End Time for create
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The end time of the schedule',
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
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'The ID of the project for this schedule',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				description: 'The ID of the task for this schedule',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Additional notes for the schedule',
			},
			{
				displayName: 'Repeat',
				name: 'repeat',
				type: 'options',
				options: [
					{
						name: 'None',
						value: 'none',
					},
					{
						name: 'Daily',
						value: 'daily',
					},
					{
						name: 'Weekly',
						value: 'weekly',
					},
					{
						name: 'Bi-Weekly',
						value: 'biweekly',
					},
					{
						name: 'Monthly',
						value: 'monthly',
					},
				],
				default: 'none',
				description: 'Repeat frequency for the schedule',
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
				resource: ['schedule'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter schedules by user',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter schedules from this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter schedules up to this date',
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
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'The start time of the schedule',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'The end time of the schedule',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'The ID of the project for this schedule',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				description: 'The ID of the task for this schedule',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Additional notes for the schedule',
			},
		],
	},
];
