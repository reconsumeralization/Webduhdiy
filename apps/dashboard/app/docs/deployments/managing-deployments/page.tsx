import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';

export default function ManagingDeploymentsPage() {
  return (
    <DocPage
      title="Managing Deployments"
      description="Learn how to view, promote, rollback, and delete deployments in your project. Master deployment management for reliable releases."
      breadcrumbs={[
        { label: 'Deployments', href: '/docs/deployments' },
        {
          label: 'Managing Deployments',
          href: '/docs/deployments/managing-deployments',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>Viewing Deployments</h2>
        <p>
          To see all deployments for your project, go to the <b>Deployments</b>{' '}
          section in your dashboard. Each deployment entry shows its status,
          commit, branch, and timestamp.
        </p>

        <h2>Promoting a Deployment</h2>
        <p>
          You can promote a preview or previous deployment to production. This
          is useful for rolling forward or deploying a hotfix.
        </p>
        <CodeBlock language="bash">{`# Promote a deployment to production
webduh deployments promote <deployment-id>`}</CodeBlock>

        <h2>Rolling Back to a Previous Deployment</h2>
        <p>
          Instantly rollback to any previous deployment if you encounter issues
          with the current release.
        </p>
        <CodeBlock language="bash">{`# Rollback to a previous deployment
webduh deployments rollback <deployment-id>`}</CodeBlock>

        <h2>Deleting a Deployment</h2>
        <p>
          To clean up old or failed deployments, you can delete them from the
          dashboard or via CLI:
        </p>
        <CodeBlock language="bash">{`# Delete a deployment
webduh deployments delete <deployment-id>`}</CodeBlock>

        <h2>Deployment Statuses</h2>
        <ul>
          <li>
            <b>Building</b>: Deployment is being built.
          </li>
          <li>
            <b>Ready</b>: Deployment is live and accessible.
          </li>
          <li>
            <b>Failed</b>: Deployment failed due to an error.
          </li>
          <li>
            <b>Promoted</b>: Deployment is now serving production traffic.
          </li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Promote only tested and verified deployments to production.</li>
          <li>Rollback quickly if you detect issues after a release.</li>
          <li>Clean up unused deployments to keep your dashboard organized.</li>
        </ul>
      </section>
    </DocPage>
  );
}
