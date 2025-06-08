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

// QuickActions component (stub for self-containment)
type QuickActionsProps = {
  className?: string;
};
function QuickActions({ className }: QuickActionsProps) {
  // This is a placeholder for the actual QuickActions UI.
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          New Project
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          Import from Git
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Browse Templates
        </button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <DocPage
      title="Projects"
      description="Learn how to create, configure, and manage your projects on Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Projects', href: '/docs/projects' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Projects are the foundation of your Webduh experience. Each project
          represents a web application that you want to deploy and host.
          Projects can be connected to Git repositories for automatic
          deployments.
        </p>

        <QuickActions className="my-8" />

        <h2>Creating a Project</h2>
        <h3>From Git Repository</h3>
        <p>
          The easiest way to create a project is to import from your Git
          repository:
        </p>

        <ol>
          <li>Connect your Git provider (GitHub, GitLab, or Bitbucket)</li>
          <li>Select the repository you want to deploy</li>
          <li>Configure build settings (usually auto-detected)</li>
          <li>Deploy your project</li>
        </ol>

        <CodeBlock language="bash" filename="CLI Deployment">
          {`# Deploy from CLI
webduh --prod

# Deploy specific directory
webduh --prod ./my-app

# Deploy with custom build command
webduh --prod --build-command="npm run build:prod"`}
        </CodeBlock>

        <h3>From Template</h3>
        <p>Start with a pre-configured template:</p>
        <ul>
          <li>
            <strong>Next.js:</strong> Full-stack React framework
          </li>
          <li>
            <strong>React:</strong> Client-side React application
          </li>
          <li>
            <strong>Vue.js:</strong> Progressive JavaScript framework
          </li>
          <li>
            <strong>Svelte:</strong> Compile-time optimized framework
          </li>
          <li>
            <strong>Static Site:</strong> HTML, CSS, and JavaScript
          </li>
        </ul>

        <h2>Project Settings</h2>
        <h3>General Settings</h3>
        <p>Configure basic project information:</p>
        <ul>
          <li>
            <strong>Project Name:</strong> Display name for your project
          </li>
          <li>
            <strong>Framework:</strong> Auto-detected or manually set
          </li>
          <li>
            <strong>Root Directory:</strong> For monorepo setups
          </li>
          <li>
            <strong>Node.js Version:</strong> Runtime version
          </li>
        </ul>

        <h3>Build Settings</h3>
        <CodeBlock language="json" filename="Build Configuration">
          {`{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}`}
        </CodeBlock>

        <h3>Environment Variables</h3>
        <p>Set environment variables for different deployment environments:</p>
        <CodeBlock language="bash" filename="Environment Variables">
          {`# Production variables
NEXT_PUBLIC_API_URL=https://api.production.com
DATABASE_URL=postgresql://prod...

# Preview variables  
NEXT_PUBLIC_API_URL=https://api.staging.com
DATABASE_URL=postgresql://staging...`}
        </CodeBlock>

        <h2>Domains</h2>
        <p>Add custom domains to your project:</p>
        <CodeBlock language="text" filename="Domain Configuration">
          {`# Production domains
yourdomain.com
www.yourdomain.com

# Branch-specific domains  
staging.yourdomain.com → staging branch
dev.yourdomain.com → develop branch`}
        </CodeBlock>

        <h2>Team Collaboration</h2>
        <h3>Adding Team Members</h3>
        <p>Collaborate with your team:</p>
        <ul>
          <li>
            <strong>Owner:</strong> Full access to project settings
          </li>
          <li>
            <strong>Collaborator:</strong> Can deploy and view logs
          </li>
          <li>
            <strong>Viewer:</strong> Read-only access
          </li>
        </ul>

        <h3>Git Integration</h3>
        <p>Configure Git workflow:</p>
        <ul>
          <li>
            <strong>Production Branch:</strong> Usually main/master
          </li>
          <li>
            <strong>Preview Branches:</strong> All other branches
          </li>
          <li>
            <strong>Ignored Branches:</strong> Skip deployments
          </li>
        </ul>

        <h2>Project Monitoring</h2>
        <h3>Analytics</h3>
        <p>Monitor your project performance:</p>
        <ul>
          <li>
            <strong>Page Views:</strong> Traffic analytics
          </li>
          <li>
            <strong>Performance:</strong> Core Web Vitals
          </li>
          <li>
            <strong>Geography:</strong> Visitor locations
          </li>
          <li>
            <strong>Devices:</strong> Mobile vs desktop
          </li>
        </ul>

        <h3>Build Logs</h3>
        <p>Debug deployment issues:</p>
        <CodeBlock language="bash" filename="Monitoring Commands">
          {`# View latest build logs
webduh logs

# View specific deployment
webduh logs --url=your-deployment.webduh.app

# Follow real-time logs
webduh logs --follow`}
        </CodeBlock>
      </div>
    </DocPage>
  );
}
