const fs = require('fs');
const path = require('path');

// Core documentation pages to create
const corePages = [
  {
    path: 'apps/dashboard/app/docs/rest-api/page.tsx',
    title: 'REST API Reference',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressIndicator } from '../components/ProgressIndicator';

export default function RestAPIPage() {
  const steps = [
    { title: 'Authentication', status: 'active' as const },
    { title: 'Projects API', status: 'pending' as const },
    { title: 'Deployments API', status: 'pending' as const },
    { title: 'Domains API', status: 'pending' as const },
    { title: 'Teams API', status: 'pending' as const }
  ];

  return (
    <DocPage
      title="REST API Reference"
      description="Complete reference for the Webduh REST API with authentication, endpoints, and examples."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'REST API', href: '/docs/rest-api' }
      ]}
    >
      <ProgressIndicator steps={steps} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Getting Started</h2>
        <p>
          The Webduh REST API allows you to manage your projects, deployments, domains, and more programmatically.
          All API requests must be authenticated using your API token.
        </p>

        <h3>Base URL</h3>
        <CodeBlock
          language="text"
          code="https://api.webduh.com"
          filename="Base URL"
        />

        <h3>Authentication</h3>
        <p>
          All API requests require an API token in the Authorization header:
        </p>
        <CodeBlock
          language="bash"
          code={\`curl -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  https://api.webduh.com/v1/projects\`}
          filename="Authentication Example"
        />

        <h2>Projects API</h2>
        
        <h3>List Projects</h3>
        <p>Get a list of all your projects:</p>
        <CodeBlock
          language="bash"
          code={\`GET /v1/projects

curl -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  https://api.webduh.com/v1/projects\`}
          filename="List Projects"
        />

        <h4>Response</h4>
        <CodeBlock
          language="json"
          code={\`{
  "projects": [
    {
      "id": "prj_abc123",
      "name": "my-awesome-app",
      "framework": "nextjs",
      "gitProvider": "github",
      "repository": "username/my-awesome-app",
      "createdAt": "2024-02-06T10:00:00Z",
      "updatedAt": "2024-02-06T12:00:00Z"
    }
  ],
  "pagination": {
    "count": 1,
    "next": null,
    "prev": null
  }
}\`}
          filename="Projects Response"
        />

        <h3>Create Project</h3>
        <p>Create a new project:</p>
        <CodeBlock
          language="bash"
          code={\`POST /v1/projects

curl -X POST \\\\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{
    "name": "my-new-project",
    "gitProvider": "github",
    "repository": "username/my-new-project",
    "framework": "nextjs"
  }' \\\\
  https://api.webduh.com/v1/projects\`}
          filename="Create Project"
        />

        <h2>Deployments API</h2>
        
        <h3>List Deployments</h3>
        <p>Get deployments for a project:</p>
        <CodeBlock
          language="bash"
          code={\`GET /v1/projects/:projectId/deployments

curl -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  https://api.webduh.com/v1/projects/prj_abc123/deployments\`}
          filename="List Deployments"
        />

        <h3>Create Deployment</h3>
        <p>Deploy your project:</p>
        <CodeBlock
          language="bash"
          code={\`POST /v1/projects/:projectId/deployments

curl -X POST \\\\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{
    "target": "production",
    "gitSource": {
      "type": "github",
      "repoId": "123456789",
      "ref": "main"
    }
  }' \\\\
  https://api.webduh.com/v1/projects/prj_abc123/deployments\`}
          filename="Create Deployment"
        />

        <h2>Domains API</h2>
        
        <h3>List Domains</h3>
        <p>Get all domains for your account:</p>
        <CodeBlock
          language="bash"
          code={\`GET /v1/domains

curl -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  https://api.webduh.com/v1/domains\`}
          filename="List Domains"
        />

        <h3>Add Domain</h3>
        <p>Add a custom domain to a project:</p>
        <CodeBlock
          language="bash"
          code={\`POST /v1/projects/:projectId/domains

curl -X POST \\\\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{
    "name": "example.com",
    "redirect": false,
    "gitBranch": "main"
  }' \\\\
  https://api.webduh.com/v1/projects/prj_abc123/domains\`}
          filename="Add Domain"
        />

        <h2>Rate Limits</h2>
        <p>
          The API has rate limits to ensure fair usage:
        </p>
        <ul>
          <li><strong>Free tier:</strong> 100 requests per hour</li>
          <li><strong>Pro tier:</strong> 1,000 requests per hour</li>
          <li><strong>Team tier:</strong> 5,000 requests per hour</li>
        </ul>

        <h2>Error Handling</h2>
        <p>
          The API returns appropriate HTTP status codes and error messages:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "error": {
    "code": "invalid_request",
    "message": "The project name is required",
    "field": "name"
  }
}\`}
          filename="Error Response"
        />

        <h2>SDKs and Libraries</h2>
        <p>
          Official SDKs are available for popular programming languages:
        </p>
        <ul>
          <li><strong>JavaScript/TypeScript:</strong> @webduh/client</li>
          <li><strong>Python:</strong> webduh-python</li>
          <li><strong>Go:</strong> webduh-go</li>
          <li><strong>PHP:</strong> webduh/webduh-php</li>
        </ul>
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/deployments/page.tsx',
    title: 'Deployments',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressIndicator } from '../components/ProgressIndicator';

export default function DeploymentsPage() {
  const steps = [
    { title: 'Overview', status: 'active' as const },
    { title: 'Deploy Process', status: 'pending' as const },
    { title: 'Preview Deployments', status: 'pending' as const },
    { title: 'Production Deployments', status: 'pending' as const },
    { title: 'Troubleshooting', status: 'pending' as const }
  ];

  return (
    <DocPage
      title="Deployments"
      description="Learn how to deploy your applications on Webduh with automatic builds, preview deployments, and production releases."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Deployments', href: '/docs/deployments' }
      ]}
    >
      <ProgressIndicator steps={steps} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Webduh automatically deploys your applications whenever you push code to your connected Git repository.
          Every deployment is immutable, fast, and comes with automatic HTTPS, global CDN, and instant rollbacks.
        </p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Automatic Deployments:</strong> Deploy on every git push</li>
          <li><strong>Preview Deployments:</strong> Every branch gets its own URL</li>
          <li><strong>Instant Rollbacks:</strong> Revert to any previous deployment instantly</li>
          <li><strong>Zero Downtime:</strong> Atomic deployments with no service interruption</li>
          <li><strong>Global CDN:</strong> Content delivered from 100+ edge locations</li>
        </ul>

        <h2>Deployment Process</h2>
        <p>
          Here's what happens when you push code to your repository:
        </p>

        <ol>
          <li><strong>Git Push:</strong> You push code to your connected repository</li>
          <li><strong>Build Trigger:</strong> Webduh detects the change and starts a build</li>
          <li><strong>Build Process:</strong> Your application is built in a secure container</li>
          <li><strong>Deploy:</strong> The built application is deployed to our global network</li>
          <li><strong>DNS Update:</strong> Traffic is routed to the new deployment</li>
        </ol>

        <h3>Build Configuration</h3>
        <p>
          Configure your build settings in the project dashboard or using webduh.json:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}\`}
          filename="webduh.json"
        />

        <h2>Preview Deployments</h2>
        <p>
          Every branch in your repository automatically gets a preview deployment with its own unique URL.
          This allows you to test changes before merging to production.
        </p>

        <h3>Preview URL Format</h3>
        <CodeBlock
          language="text"
          code="https://your-project-git-branch-name-your-team.webduh.app"
          filename="Preview URL"
        />

        <h3>Branch Protection</h3>
        <p>
          You can protect specific branches from automatic deployments:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "github": {
    "silent": true
  },
  "buildCommand": "npm run build",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
}\`}
          filename="Ignore certain changes"
        />

        <h2>Production Deployments</h2>
        <p>
          Production deployments are created when you push to your production branch (usually 'main' or 'master').
          These deployments are served on your custom domain and production URL.
        </p>

        <h3>Deployment Aliases</h3>
        <p>
          Each deployment gets multiple URLs:
        </p>
        <ul>
          <li><strong>Production URL:</strong> your-project.webduh.app</li>
          <li><strong>Custom Domain:</strong> yourdomain.com</li>
          <li><strong>Deployment URL:</strong> your-project-abc123.webduh.app</li>
        </ul>

        <h3>Environment Variables</h3>
        <p>
          Set different environment variables for preview and production deployments:
        </p>
        <CodeBlock
          language="bash"
          code={\`# Production environment variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://...

# Preview environment variables  
NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com
DATABASE_URL=postgresql://staging...\`}
          filename="Environment Variables"
        />

        <h2>Rollback Deployments</h2>
        <p>
          Instantly rollback to any previous deployment:
        </p>
        <CodeBlock
          language="bash"
          code={\`# Rollback to previous deployment
webduh rollback

# Rollback to specific deployment
webduh alias set yourdomain.com your-previous-deployment-url.webduh.app\`}
          filename="Rollback Commands"
        />

        <h2>Troubleshooting</h2>
        <h3>Common Build Issues</h3>
        
        <h4>Build Command Failed</h4>
        <p>
          Check your build command is correct and all dependencies are installed:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "buildCommand": "npm run build",
  "installCommand": "npm install --production=false"
}\`}
          filename="Fix build command"
        />

        <h4>Out of Memory</h4>
        <p>
          Increase the Node.js memory limit:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "buildCommand": "NODE_OPTIONS='--max_old_space_size=4096' npm run build"
}\`}
          filename="Increase memory"
        />
      </div>
    </DocPage>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/builds/page.tsx',
    title: 'Build Configuration',
    content: `'use client';

import { DocPage } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressIndicator } from '../components/ProgressIndicator';

export default function BuildsPage() {
  const steps = [
    { title: 'Build Process', status: 'active' as const },
    { title: 'Configuration', status: 'pending' as const },
    { title: 'Build Cache', status: 'pending' as const },
    { title: 'Custom Builds', status: 'pending' as const },
    { title: 'Optimization', status: 'pending' as const }
  ];

  return (
    <DocPage
      title="Build Configuration"
      description="Configure build settings, optimize build performance, and customize the build process for your applications."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Builds', href: '/docs/builds' }
      ]}
    >
      <ProgressIndicator steps={steps} />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Build Process Overview</h2>
        <p>
          Webduh automatically detects your framework and configures the optimal build settings.
          The build process runs in a secure, isolated environment with the latest tools and dependencies.
        </p>

        <h3>Supported Frameworks</h3>
        <ul>
          <li><strong>Next.js</strong> - Full-stack React framework with SSR/SSG</li>
          <li><strong>React</strong> - Create React App and Vite projects</li>
          <li><strong>Vue.js</strong> - Vue 3 with Vite and Nuxt.js</li>
          <li><strong>Svelte</strong> - SvelteKit and vanilla Svelte</li>
          <li><strong>Angular</strong> - Angular CLI projects</li>
          <li><strong>Static Sites</strong> - HTML, CSS, and JavaScript</li>
        </ul>

        <h2>Build Configuration</h2>
        <p>
          Configure your build using webduh.json in your project root:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@webduh/node@latest",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api-url"
    }
  }
}\`}
          filename="webduh.json"
        />

        <h3>Framework Detection</h3>
        <p>
          Webduh automatically detects your framework based on your project structure:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}\`}
          filename="Auto-detected settings"
        />

        <h2>Build Cache</h2>
        <p>
          Webduh automatically caches dependencies and build outputs to speed up subsequent builds:
        </p>

        <h3>Cached Directories</h3>
        <ul>
          <li><code>node_modules</code> - NPM dependencies</li>
          <li><code>.next/cache</code> - Next.js build cache</li>
          <li><code>dist</code> - Build output directory</li>
          <li><code>.cache</code> - Framework-specific cache</li>
        </ul>

        <h2>Environment Variables</h2>
        <p>
          Set environment variables for your build process:
        </p>
        <CodeBlock
          language="bash"
          code={\`# Build-time environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
ANALYZE=true
NODE_ENV=production

# Runtime environment variables (serverless functions)
DATABASE_URL=postgresql://...
API_SECRET=your-secret-key\`}
          filename="Environment variables"
        />

        <h2>Build Optimization</h2>
        <h3>Bundle Analysis</h3>
        <p>
          Analyze your bundle size to optimize performance:
        </p>
        <CodeBlock
          language="json"
          code={\`{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}\`}
          filename="Bundle analysis"
        />

        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use .webduhignore:</strong> Exclude unnecessary files from builds</li>
          <li><strong>Optimize images:</strong> Use next/image or similar optimizations</li>
          <li><strong>Enable compression:</strong> Gzip and Brotli are enabled by default</li>
          <li><strong>Monitor bundle size:</strong> Set up bundle analysis in CI/CD</li>
          <li><strong>Use build cache:</strong> Don't disable cache unless necessary</li>
        </ul>
      </div>
    </DocPage>
  );
}`,
  },
];

// Create additional essential components
const additionalComponents = [
  {
    path: 'apps/dashboard/app/docs/components/BreadcrumbNavigation.tsx',
    title: 'Breadcrumb Navigation Component',
    content: `'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNavigation({ items, className = '' }: BreadcrumbNavigationProps) {
  return (
    <nav className={\`flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 \${className}\`} aria-label="Breadcrumb">
      <Link
        href="/docs"
        className="flex items-center hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        aria-label="Documentation home"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-500" />
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/components/QuickActions.tsx',
    title: 'Quick Actions Component',
    content: `'use client';

import { useState } from 'react';
import { 
  CommandLineIcon, 
  DocumentDuplicateIcon, 
  PlayIcon, 
  CodeBracketIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = '' }: QuickActionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const actions: QuickAction[] = [
    {
      icon: CommandLineIcon,
      title: 'Install Webduh CLI',
      description: 'Get started with the command line interface',
      action: () => copyToClipboard('npm install -g @webduh/cli', 'cli'),
      shortcut: '⌘ + I'
    },
    {
      icon: PlayIcon,
      title: 'Deploy Now',
      description: 'Deploy your project in seconds',
      action: () => copyToClipboard('webduh --prod', 'deploy'),
      shortcut: '⌘ + D'
    },
    {
      icon: CodeBracketIcon,
      title: 'View Examples',
      description: 'Browse sample projects and templates',
      action: () => window.open('/docs/examples', '_blank'),
      shortcut: '⌘ + E'
    },
    {
      icon: BookOpenIcon,
      title: 'API Reference',
      description: 'Complete REST API documentation',
      action: () => window.open('/docs/rest-api', '_blank'),
      shortcut: '⌘ + A'
    },
    {
      icon: DocumentDuplicateIcon,
      title: 'Quick Start',
      description: 'Deploy your first project',
      action: () => window.open('/docs/getting-started-with-webduh', '_blank'),
      shortcut: '⌘ + Q'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Get Help',
      description: 'Join our community Discord',
      action: () => window.open('https://discord.gg/webduh', '_blank'),
      shortcut: '⌘ + H'
    }
  ];

  return (
    <div className={\`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 \${className}\`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isCopied = copied === (['cli', 'deploy'][index]);
        
        return (
          <button
            key={action.title}
            onClick={action.action}
            className="group relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>
              {action.shortcut && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {action.shortcut}
                  </span>
                </div>
              )}
            </div>
            
            {isCopied && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Copied to clipboard!
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}`,
  },
  {
    path: 'apps/dashboard/app/docs/components/FeatureComparison.tsx',
    title: 'Feature Comparison Component',
    content: `'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ComparisonFeature {
  name: string;
  webduh: boolean | string;
  vercel: boolean | string;
  netlify: boolean | string;
  description?: string;
}

interface FeatureComparisonProps {
  features: ComparisonFeature[];
  title?: string;
  className?: string;
}

export function FeatureComparison({ 
  features, 
  title = "Feature Comparison",
  className = '' 
}: FeatureComparisonProps) {
  const renderFeatureValue = (value: boolean | string, highlight: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className={\`h-5 w-5 \${highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}\`} />
      ) : (
        <XMarkIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
      );
    }
    return (
      <span className={\`text-sm \${highlight ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}\`}>
        {value}
      </span>
    );
  };

  return (
    <div className={\`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden \${className}\`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Feature
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Webduh
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vercel
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Netlify
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {features.map((feature, index) => (
              <tr 
                key={feature.name}
                className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {feature.name}
                    </div>
                    {feature.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {feature.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.webduh, true)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.vercel)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.netlify)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,
  },
];

// Create each core page
console.log('🚀 Creating core documentation pages...\n');

corePages.forEach((page) => {
  const dir = path.dirname(page.path);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(page.path, page.content);
  console.log(`✅ Created ${page.title} at ${page.path}`);
});

// Create additional components
console.log('\n🎨 Creating additional components...\n');

additionalComponents.forEach((component) => {
  const dir = path.dirname(component.path);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(component.path, component.content);
  console.log(`✅ Created ${component.title} at ${component.path}`);
});

// Update the components index to include new components
const componentIndexPath = 'apps/dashboard/app/docs/components/index.ts';
const newExports = `
export { BreadcrumbNavigation } from './BreadcrumbNavigation';
export { QuickActions } from './QuickActions';
export { FeatureComparison } from './FeatureComparison';`;

if (fs.existsSync(componentIndexPath)) {
  const currentContent = fs.readFileSync(componentIndexPath, 'utf8');
  const updatedContent = currentContent + newExports;
  fs.writeFileSync(componentIndexPath, updatedContent);
  console.log(`✅ Updated component exports in ${componentIndexPath}`);
}

console.log(
  '\n🎉 All core documentation pages and components created successfully!',
);
console.log('\n📋 Summary:');
console.log(`   • ${corePages.length} core documentation pages`);
console.log(`   • ${additionalComponents.length} additional components`);
console.log('   • Updated component exports');
console.log('\n🚀 Ready to run: npm run dev');
