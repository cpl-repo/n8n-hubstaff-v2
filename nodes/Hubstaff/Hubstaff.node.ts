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
	IHubstaffScheduleBody,
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

		// Get organization ID from credentials
		const credentials = await this.getCredentials('hubstaffApi');
		const organizationId = credentials.organizationId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// ==================== ORGANIZATION ====================
				if (resource === 'organization') {
					if (operation === 'get') {
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
							const projectId = this.getNodeParameter('projectId', i) as string;
						// OpenAPI: GET /v2/projects/{project_id}
						const endpoint = `/projects/${projectId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
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
							const projectId = this.getNodeParameter('projectId', i) as string;
						// OpenAPI: PUT /v2/projects/{project_id}
						const endpoint = `/projects/${projectId}`;

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
					}
				}

				// ==================== ACTIVITY ====================
				else if (resource === 'activity') {
					if (operation === 'getAll') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						const useDaily = additionalFields.useDaily;
						const endpoint = useDaily
							? `/organizations/${organizationId}/activities/daily`
							: `/organizations/${organizationId}/activities`;

						// Daily endpoint uses date[start/stop], regular uses time_slot[start/stop]
						const qs: IHubstaffQueryParameters = useDaily
							? {
								'date[start]': formatDate(startDate),
								'date[stop]': formatDate(stopDate),
							}
							: {
								'time_slot[start]': new Date(startDate).toISOString(),
								'time_slot[stop]': new Date(stopDate).toISOString(),
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

				// ==================== TIME ENTRY (Timesheets) ====================
				else if (resource === 'timeEntry') {
					if (operation === 'getAll') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						// OpenAPI: GET /v2/organizations/{org_id}/timesheets
						const endpoint = `/organizations/${organizationId}/timesheets`;

						// Timesheets use date[start/stop] in YYYY-MM-DD format
						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;
						if (additionalFields.status) {
							qs.status = additionalFields.status;
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
							const taskId = this.getNodeParameter('taskId', i) as string;
						// OpenAPI: GET /v2/tasks/{task_id}
						const endpoint = `/tasks/${taskId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
							const projectId = this.getNodeParameter('projectId', i) as string;
						// OpenAPI: GET /v2/projects/{project_id}/tasks
						const endpoint = `/projects/${projectId}/tasks`;

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
							const projectId = this.getNodeParameter('projectId', i) as string;
						const summary = this.getNodeParameter('summary', i) as string;
						// OpenAPI: POST /v2/projects/{project_id}/tasks
						const endpoint = `/projects/${projectId}/tasks`;

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
							const taskId = this.getNodeParameter('taskId', i) as string;
						// OpenAPI: PUT /v2/tasks/{task_id}
						const endpoint = `/tasks/${taskId}`;

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
							const taskId = this.getNodeParameter('taskId', i) as string;
						// OpenAPI: DELETE /v2/tasks/{task_id}
						const endpoint = `/tasks/${taskId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, taskId } });
					}
				}

				// ==================== SCREENSHOT ====================
				else if (resource === 'screenshot') {
					if (operation === 'getAll') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/screenshots`;

						// Screenshots use time_slot[start/stop] with ISO datetime
						const qs: IHubstaffQueryParameters = {
							'time_slot[start]': new Date(startDate).toISOString(),
							'time_slot[stop]': new Date(stopDate).toISOString(),
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
							const noteId = this.getNodeParameter('noteId', i) as string;
						// OpenAPI: GET /v2/notes/{note_id}
						const endpoint = `/notes/${noteId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
						// OpenAPI: GET /v2/organizations/{org_id}/notes - requires time_slot params
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/notes`;

						const qs: IHubstaffQueryParameters = {
							'time_slot[start]': new Date(startDate).toISOString(),
							'time_slot[stop]': new Date(stopDate).toISOString(),
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

				// ==================== CLIENT ====================
				else if (resource === 'client') {
					if (operation === 'get') {
							const clientId = this.getNodeParameter('clientId', i) as string;
						// OpenAPI: GET /v2/clients/{client_id}
						const endpoint = `/clients/${clientId}`;
						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint);
						returnData.push({ json: responseData });
					} else if (operation === 'getAll') {
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
							const clientId = this.getNodeParameter('clientId', i) as string;
						// OpenAPI: PUT /v2/clients/{client_id}
						const endpoint = `/clients/${clientId}`;

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
					}
				}

				// ==================== INVOICE (Client Invoices) ====================
				else if (resource === 'invoice') {
					if (operation === 'getAll') {
						// OpenAPI: GET /v2/organizations/{org_id}/client_invoices
						const endpoint = `/organizations/${organizationId}/client_invoices`;

						const qs: IHubstaffQueryParameters = {};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.clientIds) {
							qs.client_ids = additionalFields.clientIds;
						}
						if (additionalFields.status) {
							qs.status = additionalFields.status;
						}
						if (additionalFields.issueDateStart) {
							qs['issue_date[start]'] = formatDate(additionalFields.issueDateStart);
						}
						if (additionalFields.issueDateStop) {
							qs['issue_date[stop]'] = formatDate(additionalFields.issueDateStop);
						}
						if (additionalFields.includeLineItems) {
							qs.include_line_items = additionalFields.includeLineItems;
						}
						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					}
				}

				// ==================== SCHEDULE (Attendance Schedules) ====================
				else if (resource === 'schedule') {
					if (operation === 'getAll') {
						// OpenAPI: GET /v2/organizations/{org_id}/attendance_schedules
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						const endpoint = `/organizations/${organizationId}/attendance_schedules`;

						const qs: IHubstaffQueryParameters = {
							'date[start]': formatDate(startDate),
							'date[stop]': formatDate(stopDate),
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						// OpenAPI: POST /v2/organizations/{org_id}/attendance_schedules
						const userId = this.getNodeParameter('userId', i) as string;
						const scheduleDate = this.getNodeParameter('scheduleDate', i) as string;
						const startTime = this.getNodeParameter('startTime', i) as string;
						const endTime = this.getNodeParameter('endTime', i) as string;
						const endpoint = `/organizations/${organizationId}/attendance_schedules`;

						const body: IHubstaffScheduleBody = {
							user_id: userId,
							date: formatDate(scheduleDate),
							start_time: startTime,
							end_time: endTime,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.repeatSchedule && additionalFields.repeatSchedule !== 'none') {
							body.repeat_schedule = additionalFields.repeatSchedule;
						}
						if (additionalFields.weekdays) {
							body.weekdays = additionalFields.weekdays;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						// OpenAPI: PUT /v2/attendance_schedules/{attendance_schedule_id}
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;
						const endpoint = `/attendance_schedules/${scheduleId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffScheduleBody = {};

						if (updateFields.startTime) {
							body.start_time = updateFields.startTime;
						}
						if (updateFields.endTime) {
							body.end_time = updateFields.endTime;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					}
				}

				// ==================== TO-DO (Global Todos) ====================
				else if (resource === 'todo') {
					if (operation === 'getAll') {
						// OpenAPI: GET /v2/organizations/{org_id}/global_todos
						const endpoint = `/organizations/${organizationId}/global_todos`;

						const qs: IHubstaffQueryParameters = {};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.page) {
							qs.page = additionalFields.page;
						}

						const responseData = await hubstaffApiRequest.call(this, 'GET', endpoint, {}, qs);
						returnData.push({ json: responseData });
					} else if (operation === 'create') {
						// OpenAPI: POST /v2/organizations/{org_id}/global_todos
						const name = this.getNodeParameter('name', i) as string;
						const endpoint = `/organizations/${organizationId}/global_todos`;

						const body: IHubstaffTodoBody = { name };
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IAdditionalFields;

						if (additionalFields.projectIds) {
							body.project_ids = additionalFields.projectIds;
						}

						const responseData = await hubstaffApiRequest.call(this, 'POST', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'update') {
						// OpenAPI: PUT /v2/organizations/{org_id}/global_todos/{id}
						const todoId = this.getNodeParameter('todoId', i) as string;
						const endpoint = `/organizations/${organizationId}/global_todos/${todoId}`;

						const updateFields = this.getNodeParameter('updateFields', i, {}) as IUpdateFields;
						const body: IHubstaffTodoBody = {};

						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.addProjectIds) {
							body.add_project_ids = updateFields.addProjectIds;
						}
						if (updateFields.removeProjectIds) {
							body.remove_project_ids = updateFields.removeProjectIds;
						}

						const responseData = await hubstaffApiRequest.call(this, 'PUT', endpoint, body);
						returnData.push({ json: responseData });
					} else if (operation === 'delete') {
						// OpenAPI: DELETE /v2/organizations/{org_id}/global_todos/{id}
						const todoId = this.getNodeParameter('todoId', i) as string;
						const endpoint = `/organizations/${organizationId}/global_todos/${todoId}`;
						await hubstaffApiRequest.call(this, 'DELETE', endpoint);
						returnData.push({ json: { success: true, todoId } });
					}
				}

				// ==================== APPLICATION (Tool Usages) ====================
				else if (resource === 'application') {
					if (operation === 'getAll') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						// OpenAPI: GET /v2/organizations/{org_id}/tool_usages
						const endpoint = `/organizations/${organizationId}/tool_usages`;

						// Tool usages use time_slot[start/stop] with ISO datetime
						const qs: IHubstaffQueryParameters = {
							'time_slot[start]': new Date(startDate).toISOString(),
							'time_slot[stop]': new Date(stopDate).toISOString(),
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

				// ==================== URL (Tool Usages filtered by URL type) ====================
				else if (resource === 'url') {
					if (operation === 'getAll') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const stopDate = this.getNodeParameter('stopDate', i) as string;
						// OpenAPI: GET /v2/organizations/{org_id}/tool_usages with tool_type=url
						const endpoint = `/organizations/${organizationId}/tool_usages`;

						// Tool usages use time_slot[start/stop] with ISO datetime
						const qs: IHubstaffQueryParameters = {
							'time_slot[start]': new Date(startDate).toISOString(),
							'time_slot[stop]': new Date(stopDate).toISOString(),
							'tool_type': 'url',
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
