import React from 'react';
import DocPage from '../../components/DocPage';

export default function DeployPage() {
  return (
    <DocPage
      title="webduh deploy"
      description="Learn how to deploy your project using the webduh CLI. This guide covers deployment commands, options, and best practices for reliable, repeatable deployments."
      breadcrumbs={[
        { label: 'CLI', href: '/docs/cli' },
        { label: 'Deploy', href: '/docs/cli/deploy' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content:
            "The 'webduh deploy' command lets you deploy your project to the webduh platform directly from your terminal. It automatically detects your project settings, builds your application, and uploads it for hosting.",
        },
        {
          heading: 'Basic Usage',
          content: (
            <>
              <p>To deploy your project, run:</p>
              <pre>
                <code>npx webduh deploy</code>
              </pre>
              <p>
                This will build and deploy your project using the configuration
                in <code>webduh.json</code> or your project settings.
              </p>
            </>
          ),
        },
        {
          heading: 'Options',
          content: (
            <ul>
              <li>
                <code>--prod</code> &mdash; Deploys to your production
                environment.
              </li>
              <li>
                <code>--token [token]</code> &mdash; Use a specific
                authentication token.
              </li>
              <li>
                <code>--no-build</code> &mdash; Skips the build step and deploys
                the current output.
              </li>
              <li>
                <code>--env [key=value]</code> &mdash; Set environment variables
                for this deployment.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Best Practices',
          content:
            'Always test your deployment in a preview environment before deploying to production. Use environment variables to manage secrets and configuration. Monitor your deployment logs for errors and performance insights.',
        },
      ]}
    />
  );
}
