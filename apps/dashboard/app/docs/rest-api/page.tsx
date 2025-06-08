'use client';

// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */

// DocPage component
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {breadcrumbs && (
            <nav className="mb-4">
              <ol className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </header>
        <main className="prose prose-gray dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}

// CodeBlock component
type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: React.ReactNode;
};
function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="not-prose my-4">
      {filename && (
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 rounded-t">
          {filename}
        </div>
      )}
      <pre
        className={`language-${language ?? 'text'} bg-gray-900 text-gray-100 rounded-b ${filename ? '' : 'rounded'}`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ProgressIndicator component
type ProgressStep = {
  id: string;
  title: string;
  href?: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
};
type ProgressIndicatorProps = {
  steps: ProgressStep[];
  title?: string;
};
function ProgressIndicator({ steps, title }: ProgressIndicatorProps) {
  return (
    <div className="not-prose">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ol className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
        {steps.map((step, idx) => (
          <li key={step.id} className="flex items-center">
            <div
              className={`flex items-center ${step.status === 'completed' ? 'text-green-600' : step.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${step.status === 'completed' ? 'border-green-600 bg-green-100' : step.status === 'current' ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-gray-100'} mr-2`}
              >
                {step.status === 'completed' ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              {step.href ? (
                <a href={step.href} className="font-medium hover:underline">
                  {step.title}
                </a>
              ) : (
                <span className="font-medium">{step.title}</span>
              )}
            </div>
            {step.description && (
              <span className="ml-4 text-sm text-gray-500">
                {step.description}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RestApiPage() {
  const apiSteps = [
    {
      id: 'authentication',
      title: 'Authentication',
      href: '#authentication',
      description: 'Set up API authentication',
      status: 'completed' as const,
    },
    {
      id: 'endpoints',
      title: 'API Endpoints',
      href: '#endpoints',
      description: 'Explore available endpoints',
      status: 'current' as const,
    },
    {
      id: 'examples',
      title: 'Code Examples',
      href: '#examples',
      description: 'Implementation examples',
      status: 'upcoming' as const,
    },
  ];

  return (
    <DocPage
      title="REST API"
      description="Comprehensive REST API documentation for webduh platform. Manage deployments, domains, and projects programmatically."
    >
      <div className="space-y-8">
        <ProgressIndicator steps={apiSteps} title="API Integration Guide" />

        <div>
          <h2 id="overview">Overview</h2>
          <p>
            The webduh REST API allows you to manage your deployments, configure
            domains, and access project data programmatically. All API endpoints
            use HTTPS and return JSON responses.
          </p>
        </div>

        <div>
          <h2 id="authentication">Authentication</h2>
          <p>
            API requests require authentication using a bearer token. You can
            generate API tokens in your account settings.
          </p>

          <CodeBlock language="bash" filename="Authentication">
            {`curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.webduh.com/v1/projects`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="endpoints">API Endpoints</h2>

          <h3>Projects</h3>
          <CodeBlock language="bash" filename="List Projects">
            {`# List all projects
GET /v1/projects

# Get project details
GET /v1/projects/{project_id}

# Create new project
POST /v1/projects`}
          </CodeBlock>

          <h3>Deployments</h3>
          <CodeBlock language="bash" filename="Deployments">
            {`# List deployments
GET /v1/projects/{project_id}/deployments

# Get deployment details
GET /v1/deployments/{deployment_id}

# Create deployment
POST /v1/projects/{project_id}/deployments`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="examples">Code Examples</h2>

          <h3>JavaScript/Node.js</h3>
          <CodeBlock language="javascript" filename="api-client.js">
            {`const apiToken = process.env.WEBDUH_API_TOKEN
const baseURL = 'https://api.webduh.com/v1'

async function getProjects() {
  const response = await fetch(\`\${baseURL}/projects\`, {
    headers: {
      'Authorization': \`Bearer \${apiToken}\`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }
  
  return response.json()
}

// Usage
getProjects()
  .then(projects => console.log(projects))
  .catch(error => console.error('Error:', error))`}
          </CodeBlock>

          <h3>Python</h3>
          <CodeBlock language="python" filename="api_client.py">
            {`import requests
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
    print(f'Error: {e}')`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="rate-limits">Rate Limits</h2>
          <p>
            API requests are rate limited to 1000 requests per hour per API
            token. Rate limit information is included in response headers:
          </p>

          <CodeBlock language="bash">
            {`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
