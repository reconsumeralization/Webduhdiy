import React from 'react';
import DocPage from '../../components/DocPage';

export default function MethodsToBypassDeploymentProtectionPage() {
  return (
    <DocPage
      title="Bypass Deployment Protection"
      description="Learn about the different ways to bypass deployment protection in webduh, including when and how to use them safely."
      breadcrumbs={[
        { label: 'Deployment Protection', href: '/docs/deployment-protection' },
        {
          label: 'Bypass Methods',
          href: '/docs/deployment-protection/methods-to-bypass-deployment-protection',
        },
      ]}
      sections={[
        {
          heading: 'Overview',
          content: (
            <>
              <p>
                Deployment protection helps prevent accidental or unauthorized
                deployments to critical environments. However, there are
                scenarios where you may need to bypass these protections—such as
                for urgent hotfixes, disaster recovery, or approved exceptions.
              </p>
              <p>
                <strong>
                  Bypassing deployment protection should be done with caution
                </strong>{' '}
                and only by authorized team members. All bypass actions are
                logged for auditability.
              </p>
            </>
          ),
        },
        {
          heading: 'Bypass Methods',
          content: (
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Manual Bypass in Dashboard:</strong> Project admins can
                approve a deployment directly from the <b>Deployments</b> tab by
                clicking <b>Bypass Protection</b> on a blocked deployment.
              </li>
              <li>
                <strong>Bypass via CLI:</strong> Use the{' '}
                <code>--bypass-protection</code> flag with the{' '}
                <code>webduh deploy</code> command:
                <pre>
                  <code>npx webduh deploy --bypass-protection</code>
                </pre>
                <span className="text-xs text-gray-500">
                  Requires appropriate permissions.
                </span>
              </li>
              <li>
                <strong>API Bypass:</strong> If you use the webduh API, include{' '}
                <code>bypassProtection: true</code> in your deployment request
                payload.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Audit Logging',
          content: (
            <p>
              All bypass actions are recorded in your project’s audit log,
              including the user, timestamp, and method used. Review logs
              regularly to ensure compliance with your organization’s deployment
              policies.
            </p>
          ),
        },
        {
          heading: 'Best Practices',
          content: (
            <ul className="list-disc list-inside space-y-1">
              <li>Limit bypass permissions to trusted team members.</li>
              <li>
                Document the reason for each bypass in your team’s workflow.
              </li>
              <li>
                Review audit logs for unauthorized or unexpected bypasses.
              </li>
              <li>
                Consider using{' '}
                <a
                  href="/docs/deployment-protection/approval-workflows"
                  className="text-blue-600 underline"
                >
                  approval workflows
                </a>{' '}
                for safer deployments.
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
