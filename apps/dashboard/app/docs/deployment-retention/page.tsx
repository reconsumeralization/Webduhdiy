import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function DeploymentRetentionPage() {
  return (
    <DocPage
      title="Deployment Retention"
      description="Understand how webduh manages deployment retention, automatic cleanup, and how to customize retention policies for your projects."
      breadcrumbs={[
        { label: 'Deployments', href: '/docs/deployments' },
        { label: 'Deployment Retention', href: '/docs/deployment-retention' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What is Deployment Retention?</h2>
        <p>
          Deployment retention determines how long your deployments and their
          associated resources (such as preview URLs, logs, and artifacts) are
          kept before being automatically deleted. This helps manage storage,
          costs, and keeps your dashboard organized.
        </p>

        <h2>Default Retention Policy</h2>
        <p>By default, webduh retains:</p>
        <ul>
          <li>
            <b>Production deployments:</b> Kept indefinitely for audit and
            rollback purposes.
          </li>
          <li>
            <b>Preview deployments (branches, PRs):</b> Retained for{' '}
            <b>14 days</b> after their last activity.
          </li>
          <li>
            <b>Failed deployments:</b> Cleaned up automatically after{' '}
            <b>7 days</b>.
          </li>
        </ul>

        <h2>Customizing Retention Policies</h2>
        <p>
          You can override the default retention settings for your project or
          specific environments. Use the dashboard or CLI to set custom
          retention periods:
        </p>
        <CodeBlock language="bash">{`# Set preview deployment retention to 30 days
webduh deployments retention set --env=preview --days=30

# Set failed deployment retention to 3 days
webduh deployments retention set --env=failed --days=3`}</CodeBlock>

        <h2>Manual Cleanup</h2>
        <p>
          You can manually delete deployments at any time from the dashboard or
          using the CLI:
        </p>
        <CodeBlock language="bash">{`# Delete a specific deployment
webduh deployments delete <deployment-id>`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Regularly review old preview and failed deployments to keep your
            project tidy.
          </li>
          <li>
            Set shorter retention for high-churn projects to save on storage.
          </li>
          <li>
            Always keep production deployments for traceability and rollback.
          </li>
        </ul>

        <h2>FAQ</h2>
        <ul>
          <li>
            <b>What happens when a deployment is deleted?</b>
            <br />
            All associated resources (URLs, logs, artifacts) are permanently
            removed and cannot be recovered.
          </li>
          <li>
            <b>Can I restore a deleted deployment?</b>
            <br />
            No, deletion is permanent. Always double-check before deleting
            important deployments.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
