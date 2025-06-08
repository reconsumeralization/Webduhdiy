'use client';

// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// DocPage component stub for self-containment
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

// CodeBlock component stub for self-containment
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
        className={`language-${language ?? 'text'} bg-gray-900 text-gray-100 rounded-b rounded ${filename ? '' : 'rounded'}`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function InstantRollbackPage() {
  return (
    <DocPage
      title="Instant Rollback"
      description="Instantly revert to a previous deployment with zero downtime. Learn how webduh enables safe, fast rollbacks for your projects."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Instant Rollback', href: '/docs/instant-rollback' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Instant Rollback</strong> lets you immediately revert your
            application to a previous deployment version with a single click or
            command. This feature ensures your users experience minimal
            disruption if a new deployment introduces a bug or regression.
          </p>
          <p>
            With webduh, rollbacks are fast, atomic, and require no manual
            intervention or downtime.
          </p>
        </section>

        <section>
          <h2 id="how-it-works">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Every deployment is versioned:</strong> webduh keeps a
              history of all your deployments.
            </li>
            <li>
              <strong>Rollback is instant:</strong> When you trigger a rollback,
              webduh switches traffic to the selected previous version
              immediately.
            </li>
            <li>
              <strong>No downtime:</strong> Users experience a seamless
              transition, with zero downtime or maintenance windows.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="how-to-rollback">How to Rollback</h2>
          <p>
            You can trigger an instant rollback from the dashboard or via the
            CLI:
          </p>
          <CodeBlock
            language="bash"
            filename="CLI Example"
          >{`webduh rollback --to <deployment-id>`}</CodeBlock>
          <p>
            In the dashboard, navigate to your project’s deployments, select a
            previous deployment, and click <strong>Rollback</strong>.
          </p>
        </section>

        <section>
          <h2 id="best-practices">Best Practices</h2>
          <ul>
            <li>
              Test your application after each deployment to catch issues early.
            </li>
            <li>
              Use deployment previews to validate changes before going live.
            </li>
            <li>
              Monitor your application after a rollback to ensure stability.
            </li>
          </ul>
        </section>

        <section>
          <h2 id="faq">FAQ</h2>
          <ul>
            <li>
              <strong>Does rollback affect my database?</strong>
              <br />
              No, instant rollback only affects your deployed code and static
              assets. Database migrations are not reverted automatically.
            </li>
            <li>
              <strong>How many previous deployments can I roll back to?</strong>
              <br />
              You can roll back to any previous deployment retained in your
              project’s deployment history.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
