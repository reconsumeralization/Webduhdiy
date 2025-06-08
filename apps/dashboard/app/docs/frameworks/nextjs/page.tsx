'use client';

import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import ProgressIndicator from '../../components/ProgressIndicator';

export default function NextJSPage() {
  const nextjsSteps = [
    {
      id: 'create',
      title: 'Create Next.js App',
      href: '#create-app',
      description: 'Initialize your Next.js project',
      status: 'completed' as const,
    },
    {
      id: 'configure',
      title: 'Configure for webduh',
      href: '#configure',
      description: 'Optimize settings for deployment',
      status: 'current' as const,
    },
    {
      id: 'deploy',
      title: 'Deploy to webduh',
      href: '#deploy',
      description: 'Push your app live',
      status: 'upcoming' as const,
    },
  ];

  return (
    <DocPage
      title="Deploy Next.js Apps"
      description="Deploy your Next.js applications to webduh with zero configuration. Support for App Router, API routes, middleware, and all Next.js features."
    >
      <div className="space-y-8">
        <ProgressIndicator
          steps={nextjsSteps}
          title="Next.js Deployment Guide"
        />

        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Next.js is the React framework for production applications. webduh
            provides native support for all Next.js features including:
          </p>
          <ul>
            <li>
              <strong>App Router</strong> - Modern routing with layouts and
              server components
            </li>
            <li>
              <strong>API Routes</strong> - Full-stack development with
              serverless functions
            </li>
            <li>
              <strong>Middleware</strong> - Edge runtime for request/response
              manipulation
            </li>
            <li>
              <strong>Image Optimization</strong> - Automatic image optimization
              and WebP conversion
            </li>
            <li>
              <strong>Static Generation</strong> - ISR, SSG, and hybrid
              rendering
            </li>
          </ul>
        </div>

        <div>
          <h2 id="quick-deploy">Quick Deploy</h2>
          <p>The fastest way to deploy a Next.js app to webduh:</p>

          <CodeBlock language="bash" filename="Terminal">
            {`# Create a new Next.js app
npx create-next-app@latest my-app
cd my-app

# Deploy to webduh
npx webduh deploy

# Your app is live at https://my-app.webduh.app`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="configuration">Configuration</h2>
          <p>webduh works with standard Next.js configuration:</p>

          <CodeBlock language="javascript" filename="next.config.js">
            {`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['some-package'],
  },
  
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="environment-variables">Environment Variables</h2>
          <p>Manage environment variables for your Next.js app:</p>

          <CodeBlock language="bash" filename=".env.local">
            {`# Database
DATABASE_URL=postgresql://...

# API Keys (prefix with NEXT_PUBLIC_ for client-side)
NEXT_PUBLIC_ANALYTICS_ID=ga-123456789
API_SECRET_KEY=your-api-key

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="api-routes">API Routes</h2>
          <p>
            Next.js API routes are automatically deployed as serverless
            functions:
          </p>

          <CodeBlock language="typescript" filename="app/api/users/route.ts">
            {`import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const users = await fetchUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await createUser(body)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
