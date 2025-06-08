// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
type Breadcrumb = { label: string; href: string };

type DocPageProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        {breadcrumbs && (
          <ol className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((bc, i) => (
              <li key={bc.href}>
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
                {i < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
              </li>
            ))}
          </ol>
        )}
      </nav>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: React.ReactNode;
};

function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-t">
          {filename}
        </div>
      )}
      <pre
        className={`rounded-b ${language ? `language-${language}` : ''} bg-gray-900 text-gray-100 p-4 overflow-x-auto`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

const sdkContent = (
  <div className="prose dark:prose-invert max-w-none">
    <h2>webduh SDK Overview</h2>
    <p>
      The <strong>webduh SDK</strong> enables seamless integration with the
      webduh platform, allowing you to interact with APIs, manage projects, and
      automate workflows.
    </p>
    <h3>Installation</h3>
    <p>Install the SDK using npm or yarn:</p>
    <CodeBlock language="bash" filename="Terminal">
      {`npm install @webduh/sdk
# or
yarn add @webduh/sdk`}
    </CodeBlock>
    <h3>Basic Usage</h3>
    <p>Here’s a simple example of authenticating and fetching your projects:</p>
    <CodeBlock language="javascript" filename="example.js">
      {`import { WebduhClient } from '@webduh/sdk';

const client = new WebduhClient({
  apiKey: process.env.WEBDUH_API_KEY,
});

async function main() {
  const projects = await client.projects.list();
  console.log(projects);
}

main();`}
    </CodeBlock>
    <h3>Features</h3>
    <ul>
      <li>Project and deployment management</li>
      <li>Webhook integration</li>
      <li>Speed Insights and analytics</li>
      <li>Environment variable management</li>
    </ul>
    <h3>Documentation</h3>
    <ul>
      <li>
        <a
          href="https://docs.webduh.com/sdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Full SDK Reference
        </a>
      </li>
      <li>
        <a href="/docs/webhooks">Webhooks Guide</a>
      </li>
      <li>
        <a href="/docs/speed-insights">Speed Insights</a>
      </li>
    </ul>
    <h3>Support</h3>
    <p>
      For help or to report issues, visit our{' '}
      <a
        href="https://github.com/webduh/sdk"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub repository
      </a>{' '}
      or contact <a href="mailto:support@webduh.com">support@webduh.com</a>.
    </p>
  </div>
);

export default function SdkPage() {
  return (
    <DocPage
      title="webduh SDK"
      description="Learn about the webduh SDK, how to install, use, and integrate it into your projects."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'SDK', href: '/docs/sdk' },
      ]}
    >
      {sdkContent}
    </DocPage>
  );
}
