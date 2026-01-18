import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all client invoices',
				action: 'Get all client invoices',
			},
		],
		default: 'getAll',
	},
];

export const invoiceFields: INodeProperties[] = [
	// Filters for getAll
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Client IDs',
				name: 'clientIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of client IDs to filter by',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: 'open',
				description: 'Filter invoices by status',
			},
			{
				displayName: 'Issue Date Start',
				name: 'issueDateStart',
				type: 'dateTime',
				default: '',
				description: 'Filter invoices issued from this date',
			},
			{
				displayName: 'Issue Date Stop',
				name: 'issueDateStop',
				type: 'dateTime',
				default: '',
				description: 'Filter invoices issued up to this date',
			},
			{
				displayName: 'Include Line Items',
				name: 'includeLineItems',
				type: 'boolean',
				default: false,
				description: 'Whether to include invoice line items in the response',
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
