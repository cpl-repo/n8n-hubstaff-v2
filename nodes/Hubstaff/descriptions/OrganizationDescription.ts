import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an organization',
				action: 'Get an organization',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all organizations',
				action: 'Get all organizations',
			},
		],
		default: 'getAll',
	},
];

export const organizationFields: INodeProperties[] = [];
