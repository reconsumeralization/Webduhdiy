import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function DeploymentProtectionPage() {
  return (
    <DocPage
      title="Deployment Protection"
      description="Safeguard your production environment with deployment protection rules, required approvals, and branch restrictions."
      breadcrumbs={[
        { label: 'Deployments', href: '/docs/deployments' },
        { label: 'Deployment Protection', href: '/docs/deployment-protection' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What is Deployment Protection?</h2>
        <p>
          Deployment protection helps prevent accidental or unauthorized changes
          from reaching your critical environments, such as <b>production</b>.
          By setting up protection rules, you can require approvals, restrict
          who can deploy, and enforce checks before a deployment is allowed to
          proceed.
        </p>

        <h2>Common Protection Strategies</h2>
        <ul>
          <li>
            <b>Required Approvals:</b> Ensure that deployments to production
            require one or more team members to review and approve the change.
          </li>
          <li>
            <b>Branch Restrictions:</b> Limit which branches can be deployed to
            protected environments.
          </li>
          <li>
            <b>Status Checks:</b> Block deployments unless all required checks
            (such as tests or security scans) pass.
          </li>
          <li>
            <b>Role-based Access:</b> Only allow specific roles or users to
            trigger deployments to protected environments.
          </li>
        </ul>

        <h2>Configuring Deployment Protection</h2>
        <p>
          You can configure deployment protection in your dashboard or via the
          CLI. For example, to require approval before deploying to production:
        </p>
        <CodeBlock language="bash">{`# Require approval for production deployments
webduh protection set --env=production --require-approval`}</CodeBlock>

        <h2>Example: Restricting Deployments to Main Branch</h2>
        <p>
          To ensure only the <InlineCode>main</InlineCode> branch can be
          deployed to production:
        </p>
        <CodeBlock language="bash">{`webduh protection set --env=production --allowed-branches=main`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            <b>Enforce reviews</b> for all production deployments.
          </li>
          <li>
            <b>Automate status checks</b> (tests, linting, security) before
            allowing a deployment.
          </li>
          <li>
            <b>Limit deploy access</b> to trusted team members.
          </li>
          <li>
            <b>Audit deployment logs</b> regularly to monitor who deployed and
            when.
          </li>
        </ul>

        <h2>Troubleshooting</h2>
        <p>
          If a deployment is blocked, check the protection rules in your
          dashboard or run:
        </p>
        <CodeBlock language="bash">{`webduh protection status --env=production`}</CodeBlock>
        <p>
          This will show which rules are in effect and what needs to be resolved
          before proceeding.
        </p>
      </section>
    </DocPage>
  );
}
