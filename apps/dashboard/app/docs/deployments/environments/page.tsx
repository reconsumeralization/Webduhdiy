import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';

export default function EnvironmentsPage() {
  return (
    <DocPage
      title="Environments"
      description="Understand how to use environments to manage development, staging, and production workflows in your deployments."
      breadcrumbs={[
        { label: 'Deployments', href: '/docs/deployments' },
        { label: 'Environments', href: '/docs/deployments/environments' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What are Environments?</h2>
        <p>
          Environments let you separate your deployment workflows for{' '}
          <b>development</b>, <b>staging</b>, and <b>production</b>. Each
          environment can have its own configuration, secrets, and deployment
          rules, enabling safer releases and better collaboration.
        </p>

        <h2>Common Environments</h2>
        <ul>
          <li>
            <b>Development</b>: Used for feature branches and local testing.
            Changes here are isolated and do not affect users.
          </li>
          <li>
            <b>Staging</b>: Mirrors production as closely as possible. Use this
            for final testing before going live.
          </li>
          <li>
            <b>Production</b>: The live environment your users interact with.
            Only thoroughly tested code should be deployed here.
          </li>
        </ul>

        <h2>Configuring Environment Variables</h2>
        <p>
          Each environment can have its own set of environment variables. Set
          these in your dashboard or using the CLI:
        </p>
        <CodeBlock language="bash">{`# Set an environment variable for staging
webduh env set NEXT_PUBLIC_API_URL https://staging-api.example.com --env=staging

# Set a secret for production
webduh env set DATABASE_URL postgres://user:pass@host/db --env=production`}</CodeBlock>

        <h2>Deploying to Specific Environments</h2>
        <p>
          By default, pushes to certain branches deploy to specific
          environments:
        </p>
        <ul>
          <li>
            <InlineCode>main</InlineCode> &rarr; <b>Production</b>
          </li>
          <li>
            <InlineCode>staging</InlineCode> &rarr; <b>Staging</b>
          </li>
          <li>
            Any other branch &rarr; <b>Preview</b> (development)
          </li>
        </ul>
        <CodeBlock language="bash">{`# Deploy to production
git push origin main

# Deploy to staging
git push origin staging

# Deploy a feature branch (creates a preview environment)
git push origin my-feature-branch`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Keep sensitive secrets out of development and preview environments.
          </li>
          <li>Test thoroughly in staging before promoting to production.</li>
          <li>
            Automate environment setup using the CLI or dashboard for
            consistency.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
