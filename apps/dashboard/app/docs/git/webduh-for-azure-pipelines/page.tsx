// TODO: confirm version & license.
import * as React from 'react';

/* ---- embedded utilities ---- */
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { label: string; href: string }[];
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {breadcrumbs && (
            <nav className="mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                {breadcrumbs.map((crumb, idx) => (
                  <li key={crumb.href} className="flex items-center">
                    {idx > 0 && <span className="mx-1">/</span>}
                    <a href={crumb.href} className="hover:underline">
                      {crumb.label}
                    </a>
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
/* ---- end embedded utilities ---- */

export default function WebduhForAzurePipelinesPage() {
  return (
    <DocPage
      title="Azure DevOps Integration"
      description="How to deploy with webduh using Azure Pipelines. Automate your deployments from Azure DevOps to webduh for seamless CI/CD."
      breadcrumbs={[
        { label: 'Git Integrations', href: '/docs/git' },
        { label: 'Azure DevOps', href: '/docs/git/webduh-for-azure-pipelines' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Integrate Azure DevOps Pipelines with webduh to automate deployments
            on every push or pull request. This guide walks you through setting
            up a pipeline that deploys your app to webduh using the CLI.
          </p>
        </section>
        <section>
          <h3>1. Prerequisites</h3>
          <ul>
            <li>
              An existing project on{' '}
              <a
                href="https://dev.azure.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Azure DevOps
              </a>
            </li>
            <li>
              A{' '}
              <a
                href="https://webduh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                webduh
              </a>{' '}
              account and project
            </li>
            <li>
              Your <strong>webduh API token</strong> (find it in your webduh
              dashboard under Account &gt; API Tokens)
            </li>
          </ul>
        </section>
        <section>
          <h3>2. Add webduh CLI to Your Pipeline</h3>
          <p>
            In your Azure DevOps repository, add a{' '}
            <code>azure-pipelines.yml</code> file (or edit your existing one) to
            install the webduh CLI and deploy on build.
          </p>
          <CodeBlock language="yaml" filename="azure-pipelines.yml">{`trigger:
    branches:
      include:
        - main

  pool:
    vmImage: 'ubuntu-latest'

  steps:
    - checkout: self

    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: npm install -g webduh
      displayName: 'Install webduh CLI'

    - script: webduh deploy --token $(WEBDUH_TOKEN)
      displayName: 'Deploy to webduh'
  `}</CodeBlock>
        </section>
        <section>
          <h3>3. Set Your webduh API Token as a Secret</h3>
          <ol>
            <li>
              Go to your Azure DevOps project &rarr; <strong>Pipelines</strong>{' '}
              &rarr; <strong>Library</strong>.
            </li>
            <li>Create a new variable group or edit an existing one.</li>
            <li>
              Add a variable named <code>WEBDUH_TOKEN</code> and paste your
              webduh API token. Mark it as <strong>secret</strong>.
            </li>
            <li>Link the variable group to your pipeline.</li>
          </ol>
        </section>
        <section>
          <h3>4. Commit and Push</h3>
          <p>
            Commit your <code>azure-pipelines.yml</code> file and push to your
            repository. Azure Pipelines will trigger and deploy your app to
            webduh automatically.
          </p>
        </section>
        <section>
          <h3>Troubleshooting</h3>
          <ul>
            <li>
              Check the pipeline logs for errors related to authentication or
              CLI installation.
            </li>
            <li>
              Ensure your API token has the correct permissions in webduh.
            </li>
            <li>
              Contact{' '}
              <a href="mailto:support@webduh.com" className="underline">
                support@webduh.com
              </a>{' '}
              for help.
            </li>
          </ul>
        </section>
        <section>
          <h3>Further Reading</h3>
          <ul>
            <li>
              <a href="/docs/getting-started-with-webduh" className="underline">
                Getting Started with webduh
              </a>
            </li>
            <li>
              <a
                href="https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Azure Pipelines Documentation
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
