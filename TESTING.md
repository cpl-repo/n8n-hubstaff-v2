# Testing Guide for n8n-nodes-hubstaff

This guide provides comprehensive testing instructions to ensure the Hubstaff n8n node is production-ready.

## Prerequisites

1. Hubstaff account with active organization
2. Hubstaff OAuth2 application created at https://developer.hubstaff.com/apps
3. n8n instance (local or hosted)
4. Node.js 18.10+ and npm 8.19+

## Installation for Testing

### Option 1: Local Development

```bash
# Clone and build
git clone <your-repo-url>
cd n8n-hubstaff-v2
npm install
npm run build

# Link for local testing
npm link

# In your n8n directory
cd /path/to/n8n
npm link n8n-nodes-hubstaff

# Start n8n
n8n start
```

### Option 2: Direct npm Install

```bash
# In your n8n directory
npm install /path/to/n8n-hubstaff-v2
n8n start
```

## Setting Up Test Credentials

1. Go to https://developer.hubstaff.com/apps
2. Click "Create Application"
3. Fill in details:
   - **Name**: n8n Testing
   - **Description**: Testing Hubstaff integration with n8n
   - **Redirect URI**: `http://localhost:5678/rest/oauth2-credential/callback`
4. Save and copy **Client ID** and **Client Secret**
5. In n8n:
   - Navigate to **Credentials** → **New**
   - Search "Hubstaff OAuth2 API"
   - Enter Client ID and Client Secret
   - Click "Connect my account"
   - Authorize in popup
   - Save credential

## Test Scenarios

### Test 1: Organization Operations

#### Get All Organizations
- **Expected**: Returns list of organizations you have access to
- **Steps**:
  1. Add Hubstaff node
  2. Select credential
  3. Resource: Organization
  4. Operation: Get Many
  5. Execute

**Success Criteria**: Returns JSON with organizations array

#### Get Specific Organization
- **Expected**: Returns single organization details
- **Steps**:
  1. Resource: Organization
  2. Operation: Get
  3. Organization ID: (from previous test)
  4. Execute

**Success Criteria**: Returns organization object with id, name, and metadata

---

### Test 2: Project Operations

#### Create Project
- **Expected**: Creates new project in organization
- **Steps**:
  1. Resource: Project
  2. Operation: Create
  3. Organization ID: <your-org-id>
  4. Name: "Test Project n8n"
  5. Additional Fields:
     - Description: "Created via n8n for testing"
     - Billable: true
  6. Execute

**Success Criteria**: Returns created project with generated ID

#### Get All Projects
- **Expected**: Returns list of projects
- **Steps**:
  1. Resource: Project
  2. Operation: Get Many
  3. Organization ID: <your-org-id>
  4. Execute

**Success Criteria**: Returns projects array including newly created project

#### Get Single Project
- **Expected**: Returns specific project details
- **Steps**:
  1. Resource: Project
  2. Operation: Get
  3. Organization ID: <your-org-id>
  4. Project ID: <from-create-test>
  5. Execute

**Success Criteria**: Returns project object with all details

#### Update Project
- **Expected**: Updates project successfully
- **Steps**:
  1. Resource: Project
  2. Operation: Update
  3. Organization ID: <your-org-id>
  4. Project ID: <from-create-test>
  5. Update Fields:
     - Name: "Updated Test Project"
     - Description: "Updated description"
     - Status: active
  6. Execute

**Success Criteria**: Returns updated project with new values

#### Delete Project
- **Expected**: Deletes project successfully
- **Steps**:
  1. Resource: Project
  2. Operation: Delete
  3. Organization ID: <your-org-id>
  4. Project ID: <from-create-test>
  5. Execute

**Success Criteria**: Returns `{success: true, projectId: "...", organizationId: "..."}`

---

### Test 3: Activity Operations

#### Get Activities (Standard Endpoint)
- **Expected**: Returns activity data for date range
- **Steps**:
  1. Resource: Activity
  2. Operation: Get Many
  3. Organization ID: <your-org-id>
  4. Start Date: 2025-01-01 (or date with activity)
  5. Stop Date: 2025-01-17
  6. Execute

**Success Criteria**: Returns activities array with time tracking data

#### Get Activities (Daily Endpoint)
- **Expected**: Returns pre-aggregated daily activity data (faster)
- **Steps**:
  1. Resource: Activity
  2. Operation: Get Many
  3. Organization ID: <your-org-id>
  4. Start Date: 2025-01-01
  5. Stop Date: 2025-01-17
  6. Additional Fields:
     - Use Daily Endpoint: true
  7. Execute

**Success Criteria**: Returns daily aggregated activities

#### Filter Activities by User
- **Expected**: Returns activities for specific users
- **Steps**:
  1. Same as above
  2. Additional Fields:
     - User IDs: <comma-separated-user-ids>
  3. Execute

**Success Criteria**: Returns filtered activities

---

### Test 4: Time Entry Operations

#### Get Time Entries
- **Expected**: Returns time entries for date range
- **Steps**:
  1. Resource: Time Entry
  2. Operation: Get Many
  3. Organization ID: <your-org-id>
  4. Start Date: 2025-01-01
  5. Stop Date: 2025-01-17
  6. Execute

**Success Criteria**: Returns time_entries array

#### Filter Time Entries
- **Expected**: Returns filtered time entries
- **Steps**:
  1. Same as above
  2. Additional Fields:
     - User IDs: <user-id>
     - Project IDs: <project-id>
  3. Execute

**Success Criteria**: Returns filtered time entries

---

### Test 5: Member Operations

#### Get All Members
- **Expected**: Returns list of organization members
- **Steps**:
  1. Resource: Member
  2. Operation: Get Many
  3. Organization ID: <your-org-id>
  4. Execute

**Success Criteria**: Returns members array

#### Get All Members (Including Removed)
- **Expected**: Returns all members including removed ones
- **Steps**:
  1. Same as above
  2. Additional Fields:
     - Include Removed: true
  3. Execute

**Success Criteria**: Returns members array with removed members

#### Get Specific Member
- **Expected**: Returns single member details
- **Steps**:
  1. Resource: Member
  2. Operation: Get
  3. Organization ID: <your-org-id>
  4. Member ID: <from-get-all-test>
  5. Execute

**Success Criteria**: Returns member object with details

---

### Test 6: Error Handling

#### Invalid Organization ID
- **Expected**: Returns 404 error with helpful message
- **Steps**:
  1. Any operation requiring Organization ID
  2. Organization ID: "invalid-id-12345"
  3. Execute

**Success Criteria**: Error message: "Resource not found."

#### Invalid Credentials
- **Expected**: Returns 401 error
- **Steps**:
  1. Use expired/invalid credentials
  2. Execute any operation

**Success Criteria**: Error message: "Authentication failed. Please check your Hubstaff credentials."

#### Rate Limiting
- **Expected**: Returns 429 error after 1000 requests/hour
- **Steps**:
  1. Make 1000+ requests in rapid succession
  2. Execute

**Success Criteria**: Error message: "Hubstaff API rate limit exceeded..."

#### Empty Required Fields
- **Expected**: n8n validation error before API call
- **Steps**:
  1. Leave Organization ID empty
  2. Execute

**Success Criteria**: n8n shows validation error

---

### Test 7: Edge Cases

#### Date Formatting
- **Expected**: Dates are formatted correctly to YYYY-MM-DD
- **Steps**:
  1. Use various date formats (ISO strings, timestamps)
  2. Execute activity or time entry operations

**Success Criteria**: API accepts dates and returns data

#### Pagination
- **Expected**: Returns paginated results
- **Steps**:
  1. Get Many operation with pagination
  2. Additional Fields:
     - Page: 2
  3. Execute

**Success Criteria**: Returns page 2 of results

#### Continue on Fail
- **Expected**: Node continues on error
- **Steps**:
  1. Enable "Continue on Fail" in node settings
  2. Provide invalid data
  3. Execute

**Success Criteria**: Returns error in JSON without stopping workflow

---

## Performance Testing

### Test Response Times

```javascript
// In n8n Code node, measure API response time
const startTime = Date.now();
const result = $input.all();
const endTime = Date.now();
return {
  executionTime: endTime - startTime,
  itemCount: result.length
};
```

**Expected Performance**:
- Organization operations: < 500ms
- Project operations: < 1s
- Activities (daily): < 2s
- Activities (standard): < 5s (depending on data volume)
- Time entries: < 3s

---

## Automated Testing Workflow

Create an n8n workflow that tests all operations:

```
1. Get Organizations
2. Get All Projects
3. Create Test Project
4. Update Test Project
5. Get Activities (Daily)
6. Get Time Entries
7. Get Members
8. Delete Test Project
9. Verify All Succeeded
```

---

## Troubleshooting

### Issue: Node not appearing
**Solution**:
- Verify `npm run build` completed successfully
- Check `dist/` folder exists with compiled files
- Restart n8n completely

### Issue: OAuth fails
**Solution**:
- Verify redirect URI matches exactly
- Check Client ID and Secret are correct
- Ensure Hubstaff app is not in sandbox mode

### Issue: Empty responses
**Solution**:
- Verify organization has data for date range
- Check user permissions in Hubstaff
- Verify organization ID is correct

---

## Production Readiness Checklist

- [ ] All CRUD operations tested
- [ ] Error handling verified
- [ ] Date formatting works correctly
- [ ] Pagination tested
- [ ] Rate limiting handled gracefully
- [ ] OAuth authentication works
- [ ] No TypeScript errors
- [ ] All linting passes
- [ ] Documentation complete
- [ ] Performance acceptable
- [ ] Edge cases covered

---

## Reporting Issues

When reporting issues, include:
1. n8n version
2. Node version
3. Operation being performed
4. Error message (if any)
5. Steps to reproduce
6. Expected vs actual behavior
