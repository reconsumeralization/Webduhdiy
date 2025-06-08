import React from 'react';
import DocPage from '../../components/DocPage';

export default function QuickstartPage() {
  return (
    <DocPage
      title="Cron Jobs Quickstart"
      description="Learn how to schedule, manage, and monitor cron jobs with webduh. This guide walks you through deploying your first scheduled task."
      breadcrumbs={[
        { label: 'Cron Jobs', href: '/docs/cron-jobs' },
        { label: 'Quickstart', href: '/docs/cron-jobs/quickstart' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content: (
            <>
              <p>
                Cron jobs let you automate tasks on a schedule—such as sending
                emails, cleaning up data, or syncing with external APIs. With
                webduh, you can deploy and manage serverless cron jobs in
                minutes.
              </p>
            </>
          ),
        },
        {
          heading: 'Step 1: Create a New Cron Job',
          content: (
            <>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Write your handler:</strong> Create a file (e.g.,{' '}
                  <code>cron/hello.ts</code>) that exports a function:
                  <pre>
                    <code>{`export default async function handler() {
  console.log("Hello from your cron job!");
}`}</code>
                  </pre>
                </li>
                <li>
                  <strong>Define your schedule:</strong> In your{' '}
                  <code>webduh.json</code> (or project settings), add:
                  <pre>
                    <code>{`"cron": [
  {
    "path": "cron/hello.ts",
    "schedule": "0 * * * *" // every hour
  }
]`}</code>
                  </pre>
                </li>
              </ol>
            </>
          ),
        },
        {
          heading: 'Step 2: Deploy Your Project',
          content: (
            <>
              <p>Deploy your project using the CLI:</p>
              <pre>
                <code>npx webduh deploy</code>
              </pre>
              <p>
                Your cron job will be scheduled and run automatically in the
                cloud.
              </p>
            </>
          ),
        },
        {
          heading: 'Step 3: Monitor and Manage',
          content: (
            <>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>View logs:</strong> See execution logs in the webduh
                  dashboard or with <code>webduh logs</code>.
                </li>
                <li>
                  <strong>Edit schedule:</strong> Update your{' '}
                  <code>webduh.json</code> and redeploy to change timing.
                </li>
                <li>
                  <strong>Disable/enable jobs:</strong> Toggle jobs in the
                  dashboard as needed.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Next Steps',
          content: (
            <>
              <p>
                Explore advanced features like environment variables, secrets,
                and error notifications in the{' '}
                <a href="/docs/cron-jobs">full cron jobs documentation</a>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
