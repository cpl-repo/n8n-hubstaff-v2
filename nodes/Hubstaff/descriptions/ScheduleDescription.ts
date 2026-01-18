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
				description: 'Create an attendance schedule',
				action: 'Create an attendance schedule',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all attendance schedules',
				action: 'Get all attendance schedules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an attendance schedule',
				action: 'Update an attendance schedule',
			},
		],
		default: 'getAll',
	},
];

export const scheduleFields: INodeProperties[] = [
	// Schedule ID for update
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the attendance schedule',
	},

	// Required date parameters for getAll (API requires date[start] and date[stop])
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Start date for schedules (required by API)',
	},
	{
		displayName: 'Stop Date',
		name: 'stopDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Stop date for schedules (required by API)',
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

	// Start Date for create
	{
		displayName: 'Schedule Date',
		name: 'scheduleDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The date of the schedule',
	},

	// Start Time for create
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '09:00',
		description: 'The start time of the schedule (HH:MM format)',
	},

	// End Time for create
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		default: '17:00',
		description: 'The end time of the schedule (HH:MM format)',
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
				displayName: 'Repeat Schedule',
				name: 'repeatSchedule',
				type: 'options',
				options: [
					{
						name: 'None',
						value: 'none',
					},
					{
						name: 'Weekly',
						value: 'weekly',
					},
					{
						name: 'Bi-Weekly',
						value: 'bi_weekly',
					},
				],
				default: 'none',
				description: 'Repeat frequency for the schedule',
			},
			{
				displayName: 'Weekdays',
				name: 'weekdays',
				type: 'multiOptions',
				options: [
					{ name: 'Monday', value: 'monday' },
					{ name: 'Tuesday', value: 'tuesday' },
					{ name: 'Wednesday', value: 'wednesday' },
					{ name: 'Thursday', value: 'thursday' },
					{ name: 'Friday', value: 'friday' },
					{ name: 'Saturday', value: 'saturday' },
					{ name: 'Sunday', value: 'sunday' },
				],
				default: [],
				description: 'Weekdays for repeating schedules',
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
				resource: ['schedule'],
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
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'string',
				default: '',
				description: 'The start time of the schedule (HH:MM format)',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'string',
				default: '',
				description: 'The end time of the schedule (HH:MM format)',
			},
		],
	},
];
