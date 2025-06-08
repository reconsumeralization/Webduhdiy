'use client';

// TODO: confirm version & license.
import * as React from 'react';

/* ---- embedded utilities ---- */
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

function DocPage({ title, description, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

type CodeBlockProps = {
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  children: React.ReactNode;
};

function CodeBlock({
  language,
  filename,
  showLineNumbers = true,
  children,
}: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-mono rounded-t-md border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          {filename}
        </div>
      )}
      <pre
        className={`overflow-x-auto rounded-b-md rounded-t-md ${
          filename ? 'rounded-t-none' : ''
        } bg-gray-900 text-gray-100 text-sm p-4`}
        style={{ margin: 0 }}
      >
        <code>
          {typeof children === 'string'
            ? children
            : React.Children.toArray(children).join('')}
        </code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
      {children}
    </code>
  );
}

type ProgressStep = {
  label: string;
  href?: string;
  completed?: boolean;
  current?: boolean;
};

type ProgressIndicatorProps = {
  steps: ProgressStep[];
  title?: string;
};

function ProgressIndicator({ steps, title }: ProgressIndicatorProps) {
  return (
    <nav aria-label={title || 'Progress'} className="mb-8">
      {title && (
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </div>
      )}
      <ol className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {steps.map((step, idx) => (
          <li key={step.label} className="flex items-center">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2
                ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.current
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                }
              `}
            >
              {step.completed ? '✓' : idx + 1}
            </span>
            {step.href ? (
              <a
                href={step.href}
                className={`text-sm ${
                  step.current
                    ? 'font-semibold text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {step.label}
              </a>
            ) : (
              <span
                className={`text-sm ${
                  step.current
                    ? 'font-semibold text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {step.label}
              </span>
            )}
            {idx < steps.length - 1 && (
              <span className="mx-2 text-gray-400 dark:text-gray-600">→</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function createGettingStartedSteps(pathname: string): ProgressStep[] {
  // For demonstration, statically define steps.
  // In a real app, you might use pathname to highlight the current step.
  const steps: ProgressStep[] = [
    { label: 'Install CLI', href: '#quick-start', completed: true },
    { label: 'Deploy Project', href: '#quick-start', completed: true },
    { label: 'Framework Setup', href: '#framework-examples', completed: true },
    {
      label: 'Environment Variables',
      href: '#environment-variables',
      completed: true,
    },
    {
      label: 'Custom Domains',
      href: '#custom-domains',
      completed: false,
      current: true,
    },
    { label: 'Next Steps', href: '#next-steps', completed: false },
  ];
  // Mark current step based on hash in pathname if present
  // (for demo, statically set 'Custom Domains' as current)
  return steps;
}

/* ---- end embedded utilities ---- */

// TODO: confirm version & license.
import { usePathname } from 'next/navigation';

export default function GettingStartedPage() {
  const pathname = usePathname();
  const steps = createGettingStartedSteps(pathname);

  return (
    <DocPage
      title="Getting Started with webduh"
      description="Learn how to deploy your first project with webduh platform in minutes. From setup to deployment, we'll guide you through every step."
    >
      <div className="space-y-8">
        {/* Progress indicator for getting started */}
        <ProgressIndicator steps={steps} title="Getting Started Progress" />

        {/* Introduction */}
        <div>
          <h2 id="introduction">Introduction</h2>
          <p>
            Welcome to webduh! This guide will help you deploy your first
            project in just a few minutes. webduh is a platform for frontend
            developers that makes deployment as simple as{' '}
            <InlineCode>git push</InlineCode>.
          </p>
        </div>

        {/* Quick Start */}
        <div>
          <h2 id="quick-start">Quick Start</h2>
          <p>
            The fastest way to get started is with our CLI. Install it globally
            and deploy any project:
          </p>

          <CodeBlock
            language="bash"
            filename="Install webduh CLI"
            showLineNumbers={false}
          >
            {`# Install globally
npm install -g webduh

# Verify installation
webduh --version`}
          </CodeBlock>

          <p>Once installed, navigate to your project directory and deploy:</p>

          <CodeBlock language="bash" filename="Deploy your project">
            {`# Navigate to your project
cd my-awesome-project

# Deploy to webduh
webduh deploy

# Follow the prompts to configure your deployment`}
          </CodeBlock>
        </div>

        {/* Framework Examples */}
        <div>
          <h2 id="framework-examples">Framework Examples</h2>
          <p>
            webduh supports all major frontend frameworks out of the box. Here
            are some examples:
          </p>

          <h3>Next.js</h3>
          <CodeBlock language="json" filename="package.json">
            {`{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}`}
          </CodeBlock>

          <h3>React (Vite)</h3>
          <CodeBlock language="json" filename="package.json">
            {`{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}`}
          </CodeBlock>
        </div>

        {/* Environment Variables */}
        <div>
          <h2 id="environment-variables">Environment Variables</h2>
          <p>
            You can configure environment variables through the dashboard or
            CLI:
          </p>

          <CodeBlock language="bash">
            {`# Set environment variable
webduh env add API_URL=https://api.example.com

# List all environment variables
webduh env ls

# Remove environment variable
webduh env rm API_URL`}
          </CodeBlock>
        </div>

        {/* Custom Domains */}
        <div>
          <h2 id="custom-domains">Custom Domains</h2>
          <p>Adding a custom domain is straightforward:</p>

          <ol>
            <li>Go to your project settings in the dashboard</li>
            <li>Click "Add Domain" in the Domains section</li>
            <li>
              Enter your domain name (e.g., <InlineCode>myapp.com</InlineCode>)
            </li>
            <li>Update your DNS settings as instructed</li>
          </ol>

          <p>Or use the CLI:</p>

          <CodeBlock language="bash">
            {`webduh domains add myapp.com`}
          </CodeBlock>
        </div>

        {/* Next Steps */}
        <div>
          <h2 id="next-steps">Next Steps</h2>
          <p>
            Now that you have your first deployment, here's what you can explore
            next:
          </p>

          <ul>
            <li>
              <strong>
                <a href="/docs/getting-started-with-webduh/projects-deployments">
                  Projects & Deployments
                </a>
              </strong>{' '}
              - Learn about core concepts
            </li>
            <li>
              <strong>
                <a href="/docs/functions">Functions</a>
              </strong>{' '}
              - Add serverless functions to your app
            </li>
            <li>
              <strong>
                <a href="/docs/analytics">Analytics</a>
              </strong>{' '}
              - Track your app's performance
            </li>
          </ul>
        </div>
      </div>
    </DocPage>
  );
}
