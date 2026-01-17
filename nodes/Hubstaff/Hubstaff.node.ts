import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { organizationFields, organizationOperations } from './descriptions/OrganizationDescription';
import { projectFields, projectOperations } from './descriptions/ProjectDescription';
import { activityFields, activityOperations } from './descriptions/ActivityDescription';
import { timeEntryFields, timeEntryOperations } from './descriptions/TimeEntryDescription';
import { memberFields, memberOperations } from './descriptions/MemberDescription';
import { userFields, userOperations } from './descriptions/UserDescription';
import { taskFields, taskOperations } from './descriptions/TaskDescription';
import { screenshotFields, screenshotOperations } from './descriptions/ScreenshotDescription';
import { noteFields, noteOperations } from './descriptions/NoteDescription';
import { clientFields, clientOperations } from './descriptions/ClientDescription';
import { invoiceFields, invoiceOperations } from './descriptions/InvoiceDescription';
import { scheduleFields, scheduleOperations } from './descriptions/ScheduleDescription';
import { todoFields, todoOperations } from './descriptions/TodoDescription';
import { applicationFields, applicationOperations } from './descriptions/ApplicationDescription';
import { urlFields, urlOperations } from './descriptions/UrlDescription';

import { hubstaffApiRequest, formatDate } from './GenericFunctions';
import type {
	IHubstaffQueryParameters,
	IHubstaffProjectBody,
	IHubstaffTaskBody,
	IHubstaffClientBody,
	IHubstaffInvoiceBody,
	IHubstaffScheduleBody,
	IHubstaffNoteBody,
	IHubstaffTodoBody,
	IAdditionalFields,
	IUpdateFields,
	IFilterFields,
} from './types';

export class Hubstaff implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hubstaff',
		name: 'hubstaff',
		icon: 'file:hubstaff.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Hubstaff API v2',
		defaults: {
			name: 'Hubstaff',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hubstaffApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Activity',
						value: 'activity',
					},
					{
						name: 'Application',
						value: 'application',
					},
					{
						name: 'Client',
						value: 'client',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Schedule',
						value: 'schedule',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Time Entry',
						value: 'timeEntry',
					},
					{
						name: 'To-Do',
						value: 'todo',
					},
					{
						name: 'URL',
						value: 'url',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'organization',
			},
			...organizationOperations,
			...organizationFields,
			...projectOperations,
			...projectFields,
			...activityOperations,
			...activityFields,
			...timeEntryOperations,
			...timeEntryFields,
			...memberOperations,
			...memberFields,
			...userOperations,
			...userFields,
			...taskOperations,
			...taskFields,
			...screenshotOperations,
			...screenshotFields,
			...noteOperations,
			...noteFields,
			...clientOperations,
			...clientFields,
			...invoiceOperations,
			...invoiceFields,
			...scheduleOperations,
			...scheduleFields,
			...todoOperations,
			...todoFields,
			...applicationOperations,
			...applicationFields,
			...urlOperations,
			...urlFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				// ==================== ORGANIZATION ====================
				if (resource === 'organization') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const endpoint = '/organizations';
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					}
				}

				// ==================== PROJECT ====================
				else if (resource === 'project') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/organizations/${organizationId}/projects/${projectId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/projects`;
						const qs: IHubstaffQueryParameters = {};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.status) {
							qs.status = additionalFields.status;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const endpoint = `/organizations/${organizationId}/projects`;

						const body: IHubstaffProjectBody = { name };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.billable !== undefined) {
							body.billable = additionalFields.billable;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/organizations/${organizationId}/projects/${projectId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffProjectBody = {};

						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.description !== undefined) {
							body.description = updateFields.description;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/organizations/${organizationId}/projects/${projectId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, projectId, organizationId } });
					}
				}

				// ==================== ACTIVITY ====================
				else if (resource === 'activity') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						const endpoint = additionalFields.useDaily
							? `/organizations/${organizationId}/activities/daily`
							: `/organizations/${organizationId}/activities`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						if (additionalFields.userIds) {
							qs.user_ids = additionalFields.userIds;
						}
						if (additionalFields.projectIds) {
							qs.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== TIME ENTRY ====================
				else if (resource === 'timeEntry') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/time_entries`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.userIds) {
							qs.user_ids = additionalFields.userIds;
						}
						if (additionalFields.projectIds) {
							qs.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== MEMBER ====================
				else if (resource === 'member') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/members`;

						const qs: IHubstaffQueryParameters = {};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.includeRemoved !== undefined) {
							qs.include_removed = additionalFields.includeRemoved;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const memberId = this.getNodeParameter('memberId', i) as string;
						const endpoint = `/organizations/${organizationId}/members/${memberId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					}
				}

				// ==================== USER ====================
				else if (resource === 'user') {
					if (operation === 'getCurrent') {
						const endpoint = '/users/me';
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						const endpoint = `/users/${userId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/members`;

						const qs: IHubstaffQueryParameters = {};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.includeRemoved !== undefined) {
							qs.include_removed = additionalFields.includeRemoved;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== TASK ====================
				else if (resource === 'task') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const taskId = this.getNodeParameter('taskId', i) as string;
						const endpoint = `/organizations/${organizationId}/tasks/${taskId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/organizations/${organizationId}/projects/${projectId}/tasks`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.status && filters.status !== 'all') {
							qs.status = filters.status;
						}
						if (filters.assigneeId) {
							qs.assignee_id = filters.assigneeId;
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const projectId = this.getNodeParameter('projectId', i) as string;
						const summary = this.getNodeParameter('summary', i) as string;
						const endpoint = `/organizations/${organizationId}/projects/${projectId}/tasks`;

						const body: IHubstaffTaskBody = { summary };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.assigneeId) {
							body.assignee_id = additionalFields.assigneeId;
						}
						if (additionalFields.dueAt) {
							body.due_at = formatDate(additionalFields.dueAt);
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const taskId = this.getNodeParameter('taskId', i) as string;
						const endpoint = `/organizations/${organizationId}/tasks/${taskId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffTaskBody = {};

						if (updateFields.summary) {
							body.summary = updateFields.summary;
						}
						if (updateFields.description !== undefined) {
							body.description = updateFields.description;
						}
						if (updateFields.assigneeId) {
							body.assignee_id = updateFields.assigneeId;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}
						if (updateFields.dueAt) {
							body.due_at = formatDate(updateFields.dueAt);
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const taskId = this.getNodeParameter('taskId', i) as string;
						const endpoint = `/organizations/${organizationId}/tasks/${taskId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, taskId, organizationId } });
					}
				}

				// ==================== SCREENSHOT ====================
				else if (resource === 'screenshot') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/screenshots`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.userIds) {
							qs.user_ids = additionalFields.userIds;
						}
						if (additionalFields.projectIds) {
							qs.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== NOTE ====================
				else if (resource === 'note') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const noteId = this.getNodeParameter('noteId', i) as string;
						const endpoint = `/organizations/${organizationId}/notes/${noteId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/notes`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.startDate) {
							qs['date[start]'] = formatDate(filters.startDate);
						}
						if (filters.endDate) {
							qs['date[stop]'] = formatDate(filters.endDate);
						}
						if (filters.userIds) {
							qs.user_ids = filters.userIds;
						}
						if (filters.projectIds) {
							qs.project_ids = filters.projectIds;
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const endpoint = `/organizations/${organizationId}/notes`;

						const body: IHubstaffNoteBody = { description };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.userId) {
							body.user_id = additionalFields.userId;
						}
						if (additionalFields.projectId) {
							body.project_id = additionalFields.projectId;
						}
						if (additionalFields.taskId) {
							body.task_id = additionalFields.taskId;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					}
				}

				// ==================== CLIENT ====================
				else if (resource === 'client') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const clientId = this.getNodeParameter('clientId', i) as string;
						const endpoint = `/organizations/${organizationId}/clients/${clientId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/clients`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.status && filters.status !== 'all') {
							qs.status = filters.status;
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const endpoint = `/organizations/${organizationId}/clients`;

						const body: IHubstaffClientBody = { name };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.email) {
							body.email = additionalFields.email;
						}
						if (additionalFields.phone) {
							body.phone = additionalFields.phone;
						}
						if (additionalFields.address) {
							body.address = additionalFields.address;
						}
						if (additionalFields.description) {
							body.description = additionalFields.description;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const clientId = this.getNodeParameter('clientId', i) as string;
						const endpoint = `/organizations/${organizationId}/clients/${clientId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffClientBody = {};

						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.email) {
							body.email = updateFields.email;
						}
						if (updateFields.phone) {
							body.phone = updateFields.phone;
						}
						if (updateFields.address) {
							body.address = updateFields.address;
						}
						if (updateFields.description !== undefined) {
							body.description = updateFields.description;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const clientId = this.getNodeParameter('clientId', i) as string;
						const endpoint = `/organizations/${organizationId}/clients/${clientId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, clientId, organizationId } });
					}
				}

				// ==================== INVOICE ====================
				else if (resource === 'invoice') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const endpoint = `/organizations/${organizationId}/invoices/${invoiceId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/invoices`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.clientId) {
							qs.client_id = filters.clientId;
						}
						if (filters.status && filters.status !== 'all') {
							qs.status = filters.status;
						}
						if (filters.startDate) {
							qs['date[start]'] = formatDate(filters.startDate);
						}
						if (filters.endDate) {
							qs['date[stop]'] = formatDate(filters.endDate);
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const clientId = this.getNodeParameter('clientId', i) as string;
						const endpoint = `/organizations/${organizationId}/invoices`;

						const body: IHubstaffInvoiceBody = { client_id: clientId };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.invoiceNumber) {
							body.invoice_number = additionalFields.invoiceNumber;
						}
						if (additionalFields.issueDate) {
							body.issue_date = formatDate(additionalFields.issueDate);
						}
						if (additionalFields.dueDate) {
							body.due_date = formatDate(additionalFields.dueDate);
						}
						if (additionalFields.notes) {
							body.notes = additionalFields.notes;
						}
						if (additionalFields.projectIds) {
							body.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.startDate) {
							body.start_date = formatDate(additionalFields.startDate);
						}
						if (additionalFields.endDate) {
							body.end_date = formatDate(additionalFields.endDate);
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const endpoint = `/organizations/${organizationId}/invoices/${invoiceId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffInvoiceBody = {};

						if (updateFields.invoiceNumber) {
							body.invoice_number = updateFields.invoiceNumber;
						}
						if (updateFields.issueDate) {
							body.issue_date = formatDate(updateFields.issueDate);
						}
						if (updateFields.dueDate) {
							body.due_date = formatDate(updateFields.dueDate);
						}
						if (updateFields.notes !== undefined) {
							body.notes = updateFields.notes;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const endpoint = `/organizations/${organizationId}/invoices/${invoiceId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, invoiceId, organizationId } });
					}
				}

				// ==================== SCHEDULE ====================
				else if (resource === 'schedule') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;
						const endpoint = `/organizations/${organizationId}/schedules/${scheduleId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/schedules`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.userId) {
							qs.user_ids = filters.userId;
						}
						if (filters.startDate) {
							qs['date[start]'] = formatDate(filters.startDate);
						}
						if (filters.endDate) {
							qs['date[stop]'] = formatDate(filters.endDate);
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const startTime = this.getNodeParameter('startTime', i) as string;
						const endTime = this.getNodeParameter('endTime', i) as string;
						const endpoint = `/organizations/${organizationId}/schedules`;

						const body: IHubstaffScheduleBody = {
							user_id: userId,
							start_time: startTime,
							end_time: endTime,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.projectId) {
							body.project_id = additionalFields.projectId;
						}
						if (additionalFields.taskId) {
							body.task_id = additionalFields.taskId;
						}
						if (additionalFields.notes) {
							body.notes = additionalFields.notes;
						}
						if (additionalFields.repeat) {
							body.repeat = additionalFields.repeat;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;
						const endpoint = `/organizations/${organizationId}/schedules/${scheduleId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffScheduleBody = {};

						if (updateFields.startTime) {
							body.start_time = updateFields.startTime;
						}
						if (updateFields.endTime) {
							body.end_time = updateFields.endTime;
						}
						if (updateFields.projectId) {
							body.project_id = updateFields.projectId;
						}
						if (updateFields.taskId) {
							body.task_id = updateFields.taskId;
						}
						if (updateFields.notes !== undefined) {
							body.notes = updateFields.notes;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;
						const endpoint = `/organizations/${organizationId}/schedules/${scheduleId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, scheduleId, organizationId } });
					}
				}

				// ==================== TO-DO ====================
				else if (resource === 'todo') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const todoId = this.getNodeParameter('todoId', i) as string;
						const endpoint = `/organizations/${organizationId}/todos/${todoId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = `/organizations/${organizationId}/todos`;

						const qs: IHubstaffQueryParameters = {};
						const filters = this.getNodeParameter('filters', i, {}) as IFilterFields;

						if (filters.userId) {
							qs.user_ids = filters.userId;
						}
						if (filters.projectId) {
							qs.project_ids = filters.projectId;
						}
						if (filters.status && filters.status !== 'all') {
							qs.status = filters.status;
						}
						if (filters.page) {
							qs.page = filters.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const endpoint = `/organizations/${organizationId}/todos`;

						const body: IHubstaffTodoBody = { title };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.userId) {
							body.user_id = additionalFields.userId;
						}
						if (additionalFields.projectId) {
							body.project_id = additionalFields.projectId;
						}
						if (additionalFields.dueAt) {
							body.due_at = formatDate(additionalFields.dueAt);
						}
						if (additionalFields.priority) {
							body.priority = additionalFields.priority;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const todoId = this.getNodeParameter('todoId', i) as string;
						const endpoint = `/organizations/${organizationId}/todos/${todoId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffTodoBody = {};

						if (updateFields.title) {
							body.title = updateFields.title;
						}
						if (updateFields.description !== undefined) {
							body.description = updateFields.description;
						}
						if (updateFields.userId) {
							body.user_id = updateFields.userId;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}
						if (updateFields.dueAt) {
							body.due_at = formatDate(updateFields.dueAt);
						}
						if (updateFields.priority) {
							body.priority = updateFields.priority;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const todoId = this.getNodeParameter('todoId', i) as string;
						const endpoint = `/organizations/${organizationId}/todos/${todoId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, todoId, organizationId } });
					}
				}

				// ==================== APPLICATION ====================
				else if (resource === 'application') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/activities/applications`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.userIds) {
							qs.user_ids = additionalFields.userIds;
						}
						if (additionalFields.projectIds) {
							qs.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== URL ====================
				else if (resource === 'url') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/activities/urls`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.userIds) {
							qs.user_ids = additionalFields.userIds;
						}
						if (additionalFields.projectIds) {
							qs.project_ids = additionalFields.projectIds;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					returnData.push({ json: { error: errorMessage }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
