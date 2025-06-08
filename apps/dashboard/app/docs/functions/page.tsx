'use client';

import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import ProgressIndicator from '../components/ProgressIndicator';

export default function FunctionsPage() {
  const functionsSteps = [
    {
      id: 'create',
      title: 'Create Function',
      href: '#create-function',
      description: 'Write your first serverless function',
      status: 'completed' as const,
    },
    {
      id: 'configure',
      title: 'Configure Runtime',
      href: '#configure-runtime',
      description: 'Choose Node.js, Python, or Edge runtime',
      status: 'current' as const,
    },
    {
      id: 'deploy',
      title: 'Deploy Function',
      href: '#deploy-function',
      description: 'Push your function live',
      status: 'upcoming' as const,
    },
  ];

  return (
    <DocPage
      title="Serverless Functions"
      description="Deploy serverless functions with webduh. Support for Node.js, Python, and Edge runtime with automatic scaling and zero configuration."
    >
      <div className="space-y-8">
        <ProgressIndicator
          steps={functionsSteps}
          title="Functions Deployment Guide"
        />

        <div>
          <h2 id="overview">Overview</h2>
          <p>
            webduh Functions enable you to run serverless code without managing
            infrastructure. Deploy API endpoints, background jobs, webhooks, and
            more with automatic scaling and built-in monitoring.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ⚡ Edge Runtime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ultra-fast functions that run at the edge for minimal latency
                worldwide.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🟢 Node.js Runtime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Full Node.js environment with access to npm packages and file
                system.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🐍 Python Runtime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Python functions with pip packages for data processing and ML
                workloads.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 id="quick-start">Quick Start</h2>
          <p>Create your first serverless function in seconds:</p>

          <CodeBlock language="javascript" filename="api/hello.js">
            {`export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from webduh Functions!',
    timestamp: new Date().toISOString()
  })
}`}
          </CodeBlock>

          <p>Deploy with:</p>
          <CodeBlock language="bash">
            {`webduh functions deploy api/hello.js`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="create-function">Create Functions</h2>
          <p>Functions are automatically detected based on file location:</p>

          <CodeBlock language="text">
            {`project/
├── api/                    # API functions
│   ├── users.js           # /api/users
│   ├── auth/
│   │   ├── login.js       # /api/auth/login
│   │   └── logout.js      # /api/auth/logout
│   └── webhooks/
│       └── stripe.js      # /api/webhooks/stripe
└── functions/             # Standalone functions
    ├── cron-job.js        # Cron job function
    └── email-sender.js    # Background task`}
          </CodeBlock>

          <h3>HTTP API Function</h3>
          <CodeBlock language="javascript" filename="api/users.js">
            {`export default async function handler(req, res) {
  const { method } = req
  
  switch (method) {
    case 'GET':
      try {
        const users = await getUsers()
        res.status(200).json(users)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' })
      }
      break
      
    case 'POST':
      try {
        const user = await createUser(req.body)
        res.status(201).json(user)
      } catch (error) {
        res.status(400).json({ error: 'Failed to create user' })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(\`Method \${method} Not Allowed\`)
  }
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="edge-runtime">Edge Runtime</h2>
          <p>Edge functions run at the edge for ultra-low latency:</p>

          <CodeBlock language="javascript" filename="api/edge/geolocation.js">
            {`export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { geo, ip } = req
  
  const response = {
    ip,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=3600',
    },
  })
}`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
