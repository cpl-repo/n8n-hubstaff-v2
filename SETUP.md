# Setup Guide for n8n-nodes-hubstaff

This guide will walk you through setting up and testing the Hubstaff n8n community node.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Node

```bash
npm run build
```

This will:
- Compile TypeScript files to JavaScript in the `dist/` directory
- Copy icon files to the distribution folder

### 3. Link for Local Testing

To test the node locally in your n8n instance:

```bash
# In this project directory
npm link

# In your n8n installation directory (or global n8n)
npm link n8n-nodes-hubstaff

# Start n8n
n8n start
```

### 4. Set Up Hubstaff OAuth2 Credentials

#### A. Create a Hubstaff Application

1. Go to the [Hubstaff Developer Portal](https://developer.hubstaff.com/apps)
2. Click **Create Application**
3. Fill in the details:
   - **Name**: Your app name (e.g., "n8n Integration")
   - **Description**: Brief description
   - **Redirect URI**: Use the OAuth redirect URL from n8n (typically `http://localhost:5678/rest/oauth2-credential/callback`)
4. Save and note your **Client ID** and **Client Secret**

#### B. Configure in n8n

1. Open n8n
2. Go to **Credentials** > **New**
3. Search for "Hubstaff OAuth2 API"
4. Enter:
   - **Client ID**: From step A
   - **Client Secret**: From step A
5. Click **Connect my account**
6. Authorize the application in the Hubstaff popup
7. Save the credential

### 5. Test the Node

1. Create a new workflow in n8n
2. Add the **Hubstaff** node
3. Select your credential
4. Choose a resource (e.g., **Organization**)
5. Choose an operation (e.g., **Get Many**)
6. Execute the node

## Getting Your Organization ID

To find your organization ID:

1. Use the Hubstaff node with:
   - **Resource**: Organization
   - **Operation**: Get Many
2. Execute the node
3. The response will contain your organization details including the `id` field
4. Use this ID for other operations that require an organization ID

## Development Workflow

### File Structure

```
n8n-nodes-hubstaff/
├── credentials/
│   └── HubstaffOAuth2Api.credentials.ts    # OAuth2 credential definition
├── nodes/
│   └── Hubstaff/
│       ├── descriptions/                    # Resource operation descriptions
│       │   ├── ActivityDescription.ts
│       │   ├── MemberDescription.ts
│       │   ├── OrganizationDescription.ts
│       │   ├── ProjectDescription.ts
│       │   └── TimeEntryDescription.ts
│       ├── GenericFunctions.ts              # API request helpers
│       ├── Hubstaff.node.ts                 # Main node implementation
│       └── hubstaff.svg                     # Node icon
├── .eslintrc.js                             # ESLint configuration
├── .prettierrc.js                           # Prettier configuration
├── gulpfile.js                              # Build script for assets
├── package.json                             # Package metadata
└── tsconfig.json                            # TypeScript configuration
```

### Making Changes

1. Edit the source files in `credentials/` or `nodes/`
2. Rebuild: `npm run build`
3. Restart n8n to see changes
4. Test your changes in a workflow

### Linting and Formatting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lintfix

# Format code
npm run format
```

## Common Issues

### Issue: Node not appearing in n8n

**Solution**:
- Make sure you ran `npm run build`
- Verify the node is linked correctly with `npm link`
- Restart n8n completely

### Issue: OAuth authentication fails

**Solution**:
- Verify your Client ID and Client Secret are correct
- Check that the Redirect URI in the Hubstaff app matches n8n's OAuth callback URL
- Make sure your n8n instance is accessible at the redirect URI

### Issue: API requests fail with 404

**Solution**:
- Verify you're using the correct Organization ID
- Check that you have access to the resource in Hubstaff
- Ensure the resource ID (project, member, etc.) exists

### Issue: Rate limit errors

**Solution**:
- Hubstaff allows 1,000 requests per hour
- Add delays between requests in your workflow
- Use the daily activities endpoint for better performance
- Consider caching data when possible

## Testing Checklist

Before publishing, test these operations:

- [ ] OAuth2 authentication
- [ ] Get all organizations
- [ ] Get a specific organization
- [ ] Get all projects
- [ ] Create a project
- [ ] Update a project
- [ ] Delete a project
- [ ] Get activities (regular endpoint)
- [ ] Get activities (daily endpoint)
- [ ] Get time entries
- [ ] Get all members
- [ ] Get a specific member

## Publishing

When ready to publish to npm:

```bash
# Make sure everything is built and tested
npm run build
npm run lint

# Publish to npm
npm publish
```

## Additional Resources

- [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
- [Hubstaff API Documentation](https://developer.hubstaff.com/docs/hubstaff_v2)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
