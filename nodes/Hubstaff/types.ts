import type { IDataObject } from 'n8n-workflow';

export interface IHubstaffQueryParameters extends IDataObject {
	status?: string;
	page?: number;
	'date[start]'?: string;
	'date[stop]'?: string;
	'time_slot[start]'?: string;
	'time_slot[stop]'?: string;
	'issue_date[start]'?: string;
	'issue_date[stop]'?: string;
	user_ids?: string;
	project_ids?: string;
	client_ids?: string;
	include_removed?: boolean;
	client_id?: string;
	assignee_id?: string;
	task_id?: string;
	include_line_items?: boolean;
}

export interface IHubstaffProjectBody extends IDataObject {
	name?: string;
	description?: string;
	billable?: boolean;
	status?: string;
}

export interface IHubstaffTaskBody extends IDataObject {
	summary?: string;
	description?: string;
	assignee_id?: string;
	due_at?: string;
	status?: string;
}

export interface IHubstaffClientBody extends IDataObject {
	name?: string;
	email?: string;
	phone?: string;
	address?: string;
	description?: string;
	status?: string;
}

export interface IHubstaffInvoiceBody extends IDataObject {
	client_id?: string;
	invoice_number?: string;
	issue_date?: string;
	due_date?: string;
	notes?: string;
	project_ids?: string;
	start_date?: string;
	end_date?: string;
	status?: string;
}

export interface IHubstaffScheduleBody extends IDataObject {
	user_id?: string;
	date?: string;
	start_time?: string;
	end_time?: string;
	repeat_schedule?: string;
	weekdays?: string[];
	project_id?: string;
	task_id?: string;
	notes?: string;
	repeat?: string;
}

export interface IHubstaffNoteBody extends IDataObject {
	description?: string;
	user_id?: string;
	project_id?: string;
	task_id?: string;
}

export interface IHubstaffTodoBody extends IDataObject {
	name?: string;
	title?: string;
	description?: string;
	user_id?: string;
	project_id?: string;
	project_ids?: string;
	add_project_ids?: string;
	remove_project_ids?: string;
	due_at?: string;
	priority?: string;
	status?: string;
}

export interface IAdditionalFields extends IDataObject {
	description?: string;
	billable?: boolean;
	status?: string;
	page?: number;
	useDaily?: boolean;
	userIds?: string;
	projectIds?: string;
	clientIds?: string;
	includeRemoved?: boolean;
	assigneeId?: string;
	dueAt?: string;
	email?: string;
	phone?: string;
	address?: string;
	invoiceNumber?: string;
	issueDate?: string;
	dueDate?: string;
	issueDateStart?: string;
	issueDateStop?: string;
	includeLineItems?: boolean;
	notes?: string;
	startDate?: string;
	endDate?: string;
	userId?: string;
	projectId?: string;
	taskId?: string;
	startTime?: string;
	endTime?: string;
	repeat?: string;
	repeatSchedule?: string;
	weekdays?: string[];
	title?: string;
	priority?: string;
	name?: string;
}

export interface IUpdateFields extends IDataObject {
	name?: string;
	description?: string;
	status?: string;
	summary?: string;
	assigneeId?: string;
	dueAt?: string;
	email?: string;
	phone?: string;
	address?: string;
	invoiceNumber?: string;
	issueDate?: string;
	dueDate?: string;
	notes?: string;
	startTime?: string;
	endTime?: string;
	projectId?: string;
	taskId?: string;
	title?: string;
	userId?: string;
	priority?: string;
	addProjectIds?: string;
	removeProjectIds?: string;
}

export interface IFilterFields extends IDataObject {
	status?: string;
	assigneeId?: string;
	page?: number;
	clientId?: string;
	startDate?: string;
	endDate?: string;
	userId?: string;
	projectId?: string;
	userIds?: string;
	projectIds?: string;
}
