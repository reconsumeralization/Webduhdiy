import React from 'react';
import DocPage from '../../components/DocPage';

export default function MigrationGuidePage() {
  return (
    <DocPage
      title="Migration Guide"
      description="Step-by-step instructions for incrementally migrating your existing project to webduh. Learn best practices, common pitfalls, and how to ensure a smooth transition with minimal downtime."
      breadcrumbs={[
        { label: 'Incremental Migration', href: '/docs/incremental-migration' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Migrating to a new platform can be daunting, but webduh supports
            incremental migration to help you move at your own pace. This guide
            walks you through the process, from initial planning to final
            cutover, so you can modernize your stack with confidence.
          </p>
        </section>
        <section>
          <h3>1. Assess Your Current Setup</h3>
          <ul>
            <li>
              Inventory your existing infrastructure, services, and
              dependencies.
            </li>
            <li>Identify critical paths and high-traffic components.</li>
            <li>Document any custom configurations or legacy integrations.</li>
          </ul>
        </section>
        <section>
          <h3>2. Plan Your Migration</h3>
          <ul>
            <li>
              Decide on a migration strategy: <strong>big bang</strong> vs.{' '}
              <strong>incremental</strong>.
            </li>
            <li>
              Break down your application into logical modules or services.
            </li>
            <li>Set clear milestones and success criteria for each phase.</li>
          </ul>
        </section>
        <section>
          <h3>3. Set Up Your webduh Project</h3>
          <ol>
            <li>
              <a
                href="https://webduh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Create a webduh account
              </a>{' '}
              if you haven't already.
            </li>
            <li>
              Create a new project and configure your environment variables.
            </li>
            <li>
              Set up your preferred deployment method (Git integration, CLI,
              etc.).
            </li>
          </ol>
        </section>
        <section>
          <h3>4. Migrate Components Incrementally</h3>
          <ul>
            <li>
              Start with non-critical or stateless services to minimize risk.
            </li>
            <li>
              Use feature flags or routing rules to direct traffic to migrated
              components.
            </li>
            <li>
              Monitor performance and error rates after each migration step.
            </li>
          </ul>
        </section>
        <section>
          <h3>5. Validate and Optimize</h3>
          <ul>
            <li>
              Test thoroughly after each phase to ensure parity with your legacy
              system.
            </li>
            <li>
              Leverage webduh's analytics and monitoring tools for insights.
            </li>
            <li>
              Optimize configurations for performance, security, and cost.
            </li>
          </ul>
        </section>
        <section>
          <h3>6. Final Cutover</h3>
          <ul>
            <li>
              Once all components are migrated and validated, switch all traffic
              to webduh.
            </li>
            <li>Decommission legacy infrastructure as appropriate.</li>
            <li>Celebrate your successful migration!</li>
          </ul>
        </section>
        <section>
          <h3>Resources</h3>
          <ul>
            <li>
              <a href="/docs/incremental-migration/faq" className="underline">
                Incremental Migration FAQ
              </a>
            </li>
            <li>
              <a href="/docs/support" className="underline">
                Contact Support
              </a>
            </li>
            <li>
              <a
                href="https://webduh.com/blog/migration-stories"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Migration Case Studies
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
