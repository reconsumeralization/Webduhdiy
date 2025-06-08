import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

export default function IncrementalMigrationPage() {
  return (
    <DocPage
      title="Incremental Migration"
      description="Learn how to migrate your application to Webduh incrementally, minimizing risk and downtime."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Incremental Migration', href: '/docs/incremental-migration' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            Incremental migration allows you to move your application to Webduh
            step by step, rather than all at once. This approach reduces risk,
            enables easier testing, and allows you to validate each stage before
            proceeding.
          </p>
        </section>

        <section>
          <h2 id="strategy">Migration Strategy</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Identify Components:</strong> List the parts of your
              application that can be migrated independently (e.g., static
              assets, APIs, frontend routes).
            </li>
            <li>
              <strong>Set Up Rewrites/Redirects:</strong> Use{' '}
              <a href="/docs/rewrites">rewrites</a> and{' '}
              <a href="/docs/redirects">redirects</a> to route traffic between
              your legacy and new infrastructure.
            </li>
            <li>
              <strong>Deploy Incrementally:</strong> Move one component at a
              time to Webduh, verifying functionality after each step.
            </li>
            <li>
              <strong>Monitor and Test:</strong> Use monitoring and analytics to
              ensure each migrated part works as expected.
            </li>
            <li>
              <strong>Complete the Migration:</strong> Once all parts are
              migrated and stable, decommission your legacy infrastructure.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="example">Example: Migrating an API Route</h2>
          <p>
            Suppose you want to migrate your <code>/api/users</code> endpoint to
            Webduh while keeping the rest of your app on your legacy server. You
            can use a rewrite rule in <code>next.config.js</code>:
          </p>
          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/users',
        destination: 'https://your-webduh-app.com/api/users',
      },
      // Other rewrites...
    ]
  },
}`}
          </CodeBlock>
          <p>
            This forwards requests for <code>/api/users</code> to your new
            Webduh deployment, while all other routes continue to use your
            legacy backend.
          </p>
        </section>

        <section>
          <h2 id="tips">Tips for a Smooth Migration</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Start with non-critical or low-traffic routes to minimize impact.
            </li>
            <li>Use feature flags to control traffic to new infrastructure.</li>
            <li>
              Keep your environments in sync (e.g., environment variables,
              secrets).
            </li>
            <li>Document each migration step for your team.</li>
            <li>Roll back quickly if issues are detected.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
