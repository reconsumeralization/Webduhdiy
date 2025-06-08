import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function ProjectsDeploymentsPage() {
  return (
    <DocPage
      title="Projects and Deployments"
      description="Understand the core concepts of projects and deployments in webduh"
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Projects & Deployments',
          href: '/docs/getting-started-with-webduh/projects-deployments',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>What is a Project?</h2>
          <p>
            In webduh, a <strong>Project</strong> is the main container for your
            application’s code, settings, domains, and deployments. Each project
            can represent a website, API, or any deployable app.
          </p>
          <ul>
            <li>Isolated from other projects</li>
            <li>Can have multiple environments (e.g., production, staging)</li>
            <li>
              Supports custom domains, environment variables, and integrations
            </li>
          </ul>
        </section>
        <section>
          <h2>What is a Deployment?</h2>
          <p>
            A <strong>Deployment</strong> is a snapshot of your project at a
            specific point in time. Every time you push code or trigger a
            redeploy, webduh creates a new deployment.
          </p>
          <ul>
            <li>Immutable and atomic—each deployment is independent</li>
            <li>Roll back to any previous deployment instantly</li>
            <li>Preview deployments for every pull request</li>
          </ul>
        </section>
        <section>
          <h3>How Deployments Work</h3>
          <ol>
            <li>Push code to your connected Git repository.</li>
            <li>webduh detects the change and starts a new deployment.</li>
            <li>Your app is built and deployed to the edge.</li>
            <li>
              Each deployment gets a unique URL (e.g.,{' '}
              <code>my-app-abc123.webduh.app</code>).
            </li>
            <li>
              Production deployments are automatically aliased to your main
              domain.
            </li>
          </ol>
        </section>
        <section>
          <h3>Example: Deploying via CLI</h3>
          <CodeBlock
            language="bash"
            children={`# Deploy via CLI
webduh deploy`}
            filename="Terminal"
          />
        </section>
        <section>
          <h3>Best Practices</h3>
          <ul>
            <li>Use separate projects for unrelated apps or sites.</li>
            <li>
              Leverage preview deployments for testing changes before going
              live.
            </li>
            <li>
              Configure environment variables per environment (production,
              preview, development).
            </li>
            <li>Monitor deployment status and logs in the webduh dashboard.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
