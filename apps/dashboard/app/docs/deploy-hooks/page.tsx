import React from 'react';
import DocPage from '../components/DocPage';

export default function DeployHooksPage() {
  return (
    <DocPage
      title="Deploy Hooks"
      description="Deploy hooks let you trigger deployments automatically from external sources, such as GitHub Actions, third-party services, or custom scripts. Learn how to create, manage, and use deploy hooks in webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Deploy Hooks', href: '/docs/deploy-hooks' },
      ]}
      sections={[
        {
          heading: 'What Are Deploy Hooks?',
          content: (
            <>
              <p>
                Deploy hooks are unique URLs that, when requested, trigger a
                deployment of your project. They are useful for integrating with
                CI/CD pipelines, webhooks, or any system that needs to
                programmatically deploy your site.
              </p>
            </>
          ),
        },
        {
          heading: 'Creating a Deploy Hook',
          content: (
            <>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Go to your project settings:</strong> In the webduh
                  dashboard, navigate to your project and open the{' '}
                  <b>Deploy Hooks</b> section.
                </li>
                <li>
                  <strong>Create a new hook:</strong> Click{' '}
                  <b>New Deploy Hook</b>, give it a name (e.g., "GitHub
                  Actions"), and save.
                </li>
                <li>
                  <strong>Copy the URL:</strong> After creating the hook, copy
                  the generated URL. This is your deploy hook endpoint.
                </li>
              </ol>
            </>
          ),
        },
        {
          heading: 'Using Deploy Hooks',
          content: (
            <>
              <p>
                You can trigger a deployment by sending a <code>POST</code>{' '}
                request to your deploy hook URL. For example, using{' '}
                <code>curl</code>:
              </p>
              <pre>
                <code>{`curl -X POST https://webduh.app/api/deploy-hooks/your-hook-id`}</code>
              </pre>
              <p>
                You can also use deploy hooks in CI/CD workflows, such as GitHub
                Actions, to automatically deploy after tests pass or code is
                merged.
              </p>
            </>
          ),
        },
        {
          heading: 'Security Considerations',
          content: (
            <>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Treat deploy hook URLs as secrets—anyone with the URL can
                  trigger a deployment.
                </li>
                <li>
                  Revoke or rotate hooks if you suspect they have been exposed.
                </li>
                <li>
                  Use environment variables to store hook URLs in CI/CD
                  pipelines.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Managing Deploy Hooks',
          content: (
            <>
              <p>
                You can view, rename, or delete deploy hooks from your project
                settings in the dashboard. Deleting a hook immediately disables
                it.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
