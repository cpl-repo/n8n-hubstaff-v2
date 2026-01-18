# n8n-nodes-hubstaff-v2-by-cplrepo

[![npm version](https://img.shields.io/npm/v/n8n-nodes-hubstaff-v2-by-cplrepo.svg)](https://www.npmjs.com/package/n8n-nodes-hubstaff-v2-by-cplrepo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a production-ready n8n community node that provides comprehensive integration with Hubstaff API v2. It allows you to interact with Hubstaff's time tracking, project management, and team collaboration features directly from your n8n workflows.

**Production Status**: Ready for production use

## Features

### Comprehensive API Coverage

This node provides access to **15 Hubstaff resources** with full CRUD operations:

| Resource | Operations |
|----------|-----------|
| **Organization** | Get, Get Many |
| **Project** | Create, Get, Get Many, Update |
| **Activity** | Get Many (with daily aggregation option) |
| **Time Entry** | Get Many |
| **Member** | Get, Get Many |
| **User** | Get, Get Current, Get Many |
| **Task** | Create, Delete, Get, Get Many, Update |
| **Screenshot** | Get Many |
| **Note** | Get, Get Many |
| **Client** | Create, Get, Get Many, Update |
| **Invoice** | Get Many (client invoices) |
| **Schedule** | Create, Get Many, Update (attendance schedules) |
| **To-Do** | Create, Delete, Get Many, Update (global todos) |
| **Application** | Get Many (app usage tracking) |
| **URL** | Get Many (URL tracking) |

### Key Capabilities

- **Personal Access Token Authentication** - Simple, secure authentication
- **Organization-level Configuration** - Set organization ID once in credentials
- **Advanced Filtering** - Filter by users, projects, dates, and status
- **Pagination Support** - Handle large datasets efficiently
- **Error Handling** - Comprehensive error messages for all scenarios
- **Type Safety** - Full TypeScript implementation with strict typing
- **Date Formatting** - Automatic date conversion to API-required format
- **Daily Aggregation** - Fast pre-aggregated activity data endpoint
- **Continue on Fail** - Workflow continues even if individual operations fail

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-hubstaff-v2-by-cplrepo` in the **Enter npm package name** field
4. Agree to the risks and click **Install**

After installation, the Hubstaff node will appear in your nodes panel.

### Manual Installation

To install manually, navigate to your n8n installation directory and run:

```bash
npm install n8n-nodes-hubstaff-v2-by-cplrepo
```

## Prerequisites

Before using this node, you need to:

1. Have a Hubstaff account ([Sign up here](https://hubstaff.com))
2. Generate a Personal Access Token from the [Hubstaff Developer Portal](https://developer.hubstaff.com/)
3. Know your Organization ID (found in your Hubstaff dashboard URL or via API)

## Credentials Setup

This node uses Personal Access Token authentication. To set up credentials:

1. In n8n, go to **Credentials > New**
2. Search for **Hubstaff Personal Access Token**
3. Enter your **Personal Access Token** from the Hubstaff Developer Portal
4. Enter your **Organization ID**
5. Click **Save**

### Getting Your Personal Access Token

1. Go to [developer.hubstaff.com](https://developer.hubstaff.com/)
2. Log in with your Hubstaff account
3. Navigate to Personal Access Tokens
4. Generate a new token
5. Copy the token (it will only be shown once)

### Finding Your Organization ID

1. Log in to [app.hubstaff.com](https://app.hubstaff.com)
2. Look at the URL - it contains your organization ID: `app.hubstaff.com/organizations/YOUR_ORG_ID/...`
3. Or use the "Organization > Get Many" operation to list all your organizations

## Operations

### Organization
- **Get**: Retrieve your configured organization
- **Get Many**: Retrieve all organizations you have access to

### Project
- **Create**: Create a new project
- **Delete**: Delete an existing project
- **Get**: Retrieve a specific project
- **Get Many**: Retrieve all projects
- **Update**: Update project details

### Activity
- **Get Many**: Retrieve activity data for a date range
  - Supports both regular and daily (aggregated) endpoints
  - Filter by users and projects

### Time Entry
- **Get Many**: Retrieve time entries for a date range
  - Filter by users and projects

### Member
- **Get**: Retrieve a specific member
- **Get Many**: Retrieve all members
  - Option to include removed members

### User
- **Get**: Retrieve a specific user by ID
- **Get Current**: Retrieve the authenticated user
- **Get Many**: Retrieve all users in the organization

### Task
- **Create**: Create a new task
- **Delete**: Delete a task
- **Get**: Retrieve a specific task
- **Get Many**: Retrieve all tasks for a project
- **Update**: Update task details

### Screenshot
- **Get Many**: Retrieve screenshots for a date range

### Note
- **Create**: Create a new note
- **Get**: Retrieve a specific note
- **Get Many**: Retrieve all notes

### Client
- **Create**: Create a new client
- **Delete**: Delete a client
- **Get**: Retrieve a specific client
- **Get Many**: Retrieve all clients
- **Update**: Update client details

### Invoice
- **Create**: Create a new invoice
- **Delete**: Delete an invoice
- **Get**: Retrieve a specific invoice
- **Get Many**: Retrieve all invoices
- **Update**: Update invoice details

### Schedule
- **Create**: Create a new schedule
- **Delete**: Delete a schedule
- **Get**: Retrieve a specific schedule
- **Get Many**: Retrieve all schedules
- **Update**: Update schedule details

### To-Do
- **Create**: Create a new to-do item
- **Delete**: Delete a to-do
- **Get**: Retrieve a specific to-do
- **Get Many**: Retrieve all to-dos
- **Update**: Update to-do details

### Application
- **Get Many**: Retrieve application usage data for a date range

### URL
- **Get Many**: Retrieve URL tracking data for a date range

## Usage Examples

### Example 1: Get All Projects

1. Add the Hubstaff node to your workflow
2. Select **Project** as the resource
3. Select **Get Many** as the operation
4. Execute the node

### Example 2: Get Daily Activities

1. Add the Hubstaff node to your workflow
2. Select **Activity** as the resource
3. Select **Get Many** as the operation
4. Set **Start Date** and **Stop Date**
5. In **Additional Fields**, enable **Use Daily Endpoint** for faster, pre-aggregated data
6. Execute the node

### Example 3: Create a Task

1. Add the Hubstaff node to your workflow
2. Select **Task** as the resource
3. Select **Create** as the operation
4. Enter the **Project ID**
5. Enter the **Summary** (task title)
6. Optionally add description, assignee, and due date
7. Execute the node

### Example 4: Create an Invoice

1. Add the Hubstaff node to your workflow
2. Select **Invoice** as the resource
3. Select **Create** as the operation
4. Enter the **Client ID**
5. Set issue date, due date, and other details
6. Execute the node

## API Rate Limits

Hubstaff API allows **1,000 requests per hour** per authenticated user. This node handles rate limiting gracefully:

- Returns clear error messages when rate limit is exceeded
- Provides guidance on reducing request frequency
- Suggests using daily aggregation endpoint for better performance

**Tip**: Use the "Use Daily Endpoint" option for Activities to reduce API calls and improve performance.

## Resources

- [Hubstaff API Documentation](https://developer.hubstaff.com/docs/hubstaff_v2)
- [Hubstaff Developer Portal](https://developer.hubstaff.com/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Compatibility

- **n8n version**: 0.190.0 or higher
- **Node.js**: 18.10 or higher
- **npm**: 8.19 or higher
- **Hubstaff API**: v2
- **TypeScript**: Full type safety with TypeScript 5.3+

## Error Handling

This node provides detailed error messages for common scenarios:

- **401 (Authentication)**: "Authentication failed. Please check your Personal Access Token."
- **404 (Not Found)**: "Resource not found. The requested resource does not exist or you do not have access to it."
- **422 (Validation)**: "Validation error. The data provided is invalid."
- **429 (Rate Limit)**: "Hubstaff API rate limit exceeded. You are allowed 1,000 requests per hour."

All errors include helpful descriptions to guide you in resolving issues.

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/cpl-repo/n8n-hubstaff-v2.git
cd n8n-hubstaff-v2

# Install dependencies
npm install

# Build the node
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Testing Locally

To test the node locally with n8n:

```bash
# Link the node
npm link

# In your n8n directory
npm link n8n-nodes-hubstaff-v2-by-cplrepo

# Start n8n
n8n start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/cpl-repo/n8n-hubstaff-v2/issues).

For Hubstaff API support, contact api@hubstaff.com

## Troubleshooting

### Node not appearing in n8n

1. Verify installation: Check n8n logs for any errors
2. Restart n8n completely
3. Clear browser cache and reload

### Authentication fails

1. Verify your **Personal Access Token** is correct and not expired
2. Generate a new token if needed from [developer.hubstaff.com](https://developer.hubstaff.com/)
3. Ensure the token has the required permissions

### API requests return 404

1. Verify the **Organization ID** in your credentials is correct
2. Ensure you have access to the resource in Hubstaff
3. Check that resource IDs (project, member, task) exist

### Rate limiting errors

1. Reduce workflow execution frequency
2. Use the **Daily Endpoint** for activities (faster, fewer requests)
3. Implement delays between operations
4. Consider caching data when possible

## Changelog

### 1.3.0 (2026-01-18)

**Major API Compliance Fixes**
- Fixed all API endpoints to match Hubstaff OpenAPI specification
- Fixed authentication: Personal Access Token is now correctly exchanged for access token
- Fixed Project endpoints: GET/PUT now use `/projects/{id}` (removed invalid delete operation)
- Fixed Task endpoints: GET/PUT/DELETE now use `/tasks/{id}`
- Fixed Client endpoints: GET/PUT now use `/clients/{id}` (removed invalid delete operation)
- Fixed Note endpoints: GET now uses `/notes/{id}`, removed invalid create operation
- Fixed Invoice resource: Now uses `/client_invoices` endpoint (read-only)
- Fixed Schedule resource: Now uses `/attendance_schedules` endpoint with correct operations
- Fixed To-Do resource: Now uses `/global_todos` endpoint with correct operations
- Added token caching with automatic refresh
- Updated all query parameter names to match API specification

### 1.2.0 (2026-01-17)

**Organization ID in Credentials**
- Moved Organization ID to credentials configuration
- Set once during setup, no need to specify per operation
- Simplified all resource operations

### 1.1.0 (2026-01-17)

**Full API Coverage**
- Added 10 new resources: User, Task, Screenshot, Note, Client, Invoice, Schedule, To-Do, Application, URL
- Full CRUD operations for Task, Client, Invoice, Schedule, To-Do
- Switched from OAuth2 to Personal Access Token authentication

### 1.0.0 (2026-01-17)

**Initial Release**
- Support for 5 resources: Organizations, Projects, Activities, Time Entries, Members
- OAuth2 authentication
- Full TypeScript implementation
