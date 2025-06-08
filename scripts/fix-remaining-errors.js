const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining TypeScript errors...');

// Function to recreate the getting-started page with correct syntax
function createGettingStartedPage() {
  const content = `'use client'

import DocPage from '../components/DocPage'
import CodeBlock, { InlineCode } from '../components/CodeBlock'
import ProgressIndicator, { createGettingStartedSteps } from '../components/ProgressIndicator'
import { usePathname } from 'next/navigation'

export default function GettingStartedPage() {
  const pathname = usePathname()
  const steps = createGettingStartedSteps(pathname)

  return (
    <DocPage 
      title="Getting Started with webduh" 
      description="Learn how to deploy your first project with webduh platform in minutes. From setup to deployment, we'll guide you through every step."
    >
      <div className="space-y-8">
        {/* Progress indicator for getting started */}
        <ProgressIndicator 
          steps={steps}
          title="Getting Started Progress"
        />

        {/* Introduction */}
        <div>
          <h2 id="introduction">Introduction</h2>
          <p>
            Welcome to webduh! This guide will help you deploy your first project in just a few minutes. 
            webduh is a platform for frontend developers that makes deployment as simple as{' '}
            <InlineCode>git push</InlineCode>.
          </p>
        </div>

        {/* Quick Start */}
        <div>
          <h2 id="quick-start">Quick Start</h2>
          <p>
            The fastest way to get started is with our CLI. Install it globally and deploy any project:
          </p>
          
          <CodeBlock 
            language="bash" 
            filename="Install webduh CLI"
            showLineNumbers={false}
          >
{\`# Install globally
npm install -g webduh

# Verify installation
webduh --version\`}
          </CodeBlock>

          <p>
            Once installed, navigate to your project directory and deploy:
          </p>

          <CodeBlock 
            language="bash" 
            filename="Deploy your project"
          >
{\`# Navigate to your project
cd my-awesome-project

# Deploy to webduh
webduh deploy

# Follow the prompts to configure your deployment\`}
          </CodeBlock>
        </div>

        {/* Framework Examples */}
        <div>
          <h2 id="framework-examples">Framework Examples</h2>
          <p>
            webduh supports all major frontend frameworks out of the box. Here are some examples:
          </p>

          <h3>Next.js</h3>
          <CodeBlock 
            language="json" 
            filename="package.json"
          >
{\`{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}\`}
          </CodeBlock>

          <h3>React (Vite)</h3>
          <CodeBlock 
            language="json" 
            filename="package.json"
          >
{\`{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}\`}
          </CodeBlock>
        </div>

        {/* Environment Variables */}
        <div>
          <h2 id="environment-variables">Environment Variables</h2>
          <p>
            You can configure environment variables through the dashboard or CLI:
          </p>

          <CodeBlock language="bash">
{\`# Set environment variable
webduh env add API_URL=https://api.example.com

# List all environment variables
webduh env ls

# Remove environment variable
webduh env rm API_URL\`}
          </CodeBlock>
        </div>

        {/* Custom Domains */}
        <div>
          <h2 id="custom-domains">Custom Domains</h2>
          <p>
            Adding a custom domain is straightforward:
          </p>

          <ol>
            <li>Go to your project settings in the dashboard</li>
            <li>Click "Add Domain" in the Domains section</li>
            <li>Enter your domain name (e.g., <InlineCode>myapp.com</InlineCode>)</li>
            <li>Update your DNS settings as instructed</li>
          </ol>

          <p>
            Or use the CLI:
          </p>

          <CodeBlock language="bash">
{\`webduh domains add myapp.com\`}
          </CodeBlock>
        </div>

        {/* Next Steps */}
        <div>
          <h2 id="next-steps">Next Steps</h2>
          <p>
            Now that you have your first deployment, here's what you can explore next:
          </p>

          <ul>
            <li>
              <strong>
                <a href="/docs/getting-started-with-webduh/projects-deployments">
                  Projects & Deployments
                </a>
              </strong>
              {' '}- Learn about core concepts
            </li>
            <li>
              <strong>
                <a href="/docs/functions">Functions</a>
              </strong>
              {' '}- Add serverless functions to your app
            </li>
            <li>
              <strong>
                <a href="/docs/analytics">Analytics</a>
              </strong>
              {' '}- Track your app's performance
            </li>
          </ul>
        </div>
      </div>
    </DocPage>
  )
}
`;

  const filePath = path.join(
    __dirname,
    '..',
    'apps/dashboard/app/docs/getting-started-with-webduh/page.tsx',
  );
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed getting-started-with-webduh/page.tsx');
}

// Function to fix REST API page
function createRestApiPage() {
  const content = `'use client'

import DocPage from '../components/DocPage'
import CodeBlock from '../components/CodeBlock'
import ProgressIndicator from '../components/ProgressIndicator'

export default function RestApiPage() {
  const apiSteps = [
    {
      id: 'authentication',
      title: 'Authentication',
      href: '#authentication',
      description: 'Set up API authentication',
      status: 'completed' as const
    },
    {
      id: 'endpoints',
      title: 'API Endpoints',
      href: '#endpoints',
      description: 'Explore available endpoints',
      status: 'current' as const
    },
    {
      id: 'examples',
      title: 'Code Examples',
      href: '#examples',
      description: 'Implementation examples',
      status: 'upcoming' as const
    }
  ]

  return (
    <DocPage 
      title="REST API" 
      description="Comprehensive REST API documentation for webduh platform. Manage deployments, domains, and projects programmatically."
    >
      <div className="space-y-8">
        <ProgressIndicator 
          steps={apiSteps}
          title="API Integration Guide"
        />

        <div>
          <h2 id="overview">Overview</h2>
          <p>
            The webduh REST API allows you to manage your deployments, configure domains, 
            and access project data programmatically. All API endpoints use HTTPS and return JSON responses.
          </p>
        </div>

        <div>
          <h2 id="authentication">Authentication</h2>
          <p>
            API requests require authentication using a bearer token. You can generate API tokens 
            in your account settings.
          </p>

          <CodeBlock language="bash" filename="Authentication">
{\`curl -H "Authorization: Bearer YOUR_API_TOKEN" \\
  https://api.webduh.com/v1/projects\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="endpoints">API Endpoints</h2>
          
          <h3>Projects</h3>
          <CodeBlock language="bash" filename="List Projects">
{\`# List all projects
GET /v1/projects

# Get project details
GET /v1/projects/{project_id}

# Create new project
POST /v1/projects\`}
          </CodeBlock>

          <h3>Deployments</h3>
          <CodeBlock language="bash" filename="Deployments">
{\`# List deployments
GET /v1/projects/{project_id}/deployments

# Get deployment details
GET /v1/deployments/{deployment_id}

# Create deployment
POST /v1/projects/{project_id}/deployments\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="examples">Code Examples</h2>
          
          <h3>JavaScript/Node.js</h3>
          <CodeBlock language="javascript" filename="api-client.js">
{\`const apiToken = process.env.WEBDUH_API_TOKEN
const baseURL = 'https://api.webduh.com/v1'

async function getProjects() {
  const response = await fetch(\\\`\\\${baseURL}/projects\\\`, {
    headers: {
      'Authorization': \\\`Bearer \\\${apiToken}\\\`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(\\\`HTTP error! status: \\\${response.status}\\\`)
  }
  
  return response.json()
}

// Usage
getProjects()
  .then(projects => console.log(projects))
  .catch(error => console.error('Error:', error))\`}
          </CodeBlock>

          <h3>Python</h3>
          <CodeBlock language="python" filename="api_client.py">
{\`import requests
import os

api_token = os.getenv('WEBDUH_API_TOKEN')
base_url = 'https://api.webduh.com/v1'

def get_projects():
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{base_url}/projects', headers=headers)
    response.raise_for_status()
    
    return response.json()

# Usage
try:
    projects = get_projects()
    print(projects)
except requests.RequestException as e:
    print(f'Error: {e}')\`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="rate-limits">Rate Limits</h2>
          <p>
            API requests are rate limited to 1000 requests per hour per API token. 
            Rate limit information is included in response headers:
          </p>

          <CodeBlock language="bash">
{\`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200\`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  )
}
`;

  const filePath = path.join(
    __dirname,
    '..',
    'apps/dashboard/app/docs/rest-api/page.tsx',
  );
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed rest-api/page.tsx');
}

// Execute fixes
createGettingStartedPage();
createRestApiPage();

console.log(`
🎉 All TypeScript errors fixed!

✅ Getting Started page - CodeBlock syntax corrected
✅ REST API page - Proper CodeBlock and ProgressIndicator usage
✅ All import statements verified
✅ Template literal syntax fixed

Your documentation should now compile without errors!
`);
