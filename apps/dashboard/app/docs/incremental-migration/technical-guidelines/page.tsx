import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function TechnicalGuidelinesPage() {
  return (
    <DocPage
      title="Technical Guidelines"
      description="Best practices and technical requirements for a smooth incremental migration to Webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Incremental Migration', href: '/docs/incremental-migration' },
        {
          label: 'Technical Guidelines',
          href: '/docs/incremental-migration/technical-guidelines',
        },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            This guide outlines the technical best practices and requirements
            for incrementally migrating your application to Webduh. Following
            these guidelines will help ensure a seamless transition, minimize
            downtime, and reduce risk.
          </p>
        </section>

        <section>
          <h2 id="prerequisites">Prerequisites</h2>
          <ul>
            <li>Access to both legacy and Webduh environments</li>
            <li>Ability to configure DNS and networking</li>
            <li>
              Familiarity with <code>next.config.js</code> for
              rewrites/redirects
            </li>
            <li>Automated test coverage for critical paths</li>
          </ul>
        </section>

        <section>
          <h2 id="guidelines">Technical Guidelines</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Isolate Migratable Components:</strong> Refactor your
              application so that APIs, static assets, and frontend routes can
              be migrated independently.
            </li>
            <li>
              <strong>Use Rewrites and Redirects:</strong> Leverage{' '}
              <a href="/docs/rewrites">rewrites</a> and{' '}
              <a href="/docs/redirects">redirects</a> to route traffic between
              legacy and Webduh infrastructure.
            </li>
            <li>
              <strong>Maintain Consistent Environments:</strong> Ensure
              environment variables and secrets are synchronized between both
              platforms.
            </li>
            <li>
              <strong>Monitor and Log:</strong> Set up monitoring and logging on
              both sides to quickly identify issues during migration.
            </li>
            <li>
              <strong>Test Each Step:</strong> After migrating each component,
              run automated and manual tests to verify functionality.
            </li>
            <li>
              <strong>Rollback Plan:</strong> Prepare a rollback strategy for
              each migration phase in case issues arise.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="example">
            Example: API Rewrite in <code>next.config.js</code>
          </h2>
          <p>
            To migrate an API route incrementally, you can use a rewrite rule to
            forward requests to Webduh:
          </p>
          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'https://your-webduh-app.webduh.app/api/users/:path*',
      },
    ]
  },
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="resources">Further Resources</h2>
          <ul>
            <li>
              <a href="/docs/incremental-migration">
                Incremental Migration Overview
              </a>
            </li>
            <li>
              <a href="/docs/rewrites">Rewrites Documentation</a>
            </li>
            <li>
              <a href="/docs/redirects">Redirects Documentation</a>
            </li>
            <li>
              <a href="/docs/production-checklist">Production Checklist</a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
