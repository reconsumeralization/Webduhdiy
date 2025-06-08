import React from 'react';
import DocPage from '../components/DocPage';

export default function CronJobsPage() {
  return (
    <DocPage
      title="Cron Jobs"
      description="Automate, schedule, and monitor recurring tasks with webduh's serverless cron jobs. Learn how to set up, deploy, and manage scheduled jobs for your projects."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Cron Jobs', href: '/docs/cron-jobs' },
      ]}
      sections={[
        {
          heading: 'What Are Cron Jobs?',
          content: (
            <>
              <p>
                Cron jobs let you run code on a schedule—hourly, daily, weekly,
                or any custom interval. Use them for tasks like sending emails,
                cleaning up data, syncing with APIs, or generating reports.
              </p>
              <p>
                With <strong>webduh</strong>, you can deploy serverless cron
                jobs that scale automatically and are easy to manage from the
                dashboard or CLI.
              </p>
            </>
          ),
        },
        {
          heading: 'Key Features',
          content: (
            <ul className="list-disc list-inside space-y-1">
              <li>Flexible scheduling with cron syntax</li>
              <li>Serverless execution—no infrastructure to manage</li>
              <li>Automatic retries and error logging</li>
              <li>Monitor job runs and view logs in the dashboard</li>
              <li>Secure environment variable support</li>
            </ul>
          ),
        },
        {
          heading: 'Quickstart',
          content: (
            <>
              <p>
                Ready to get started? Follow the{' '}
                <a
                  href="/docs/cron-jobs/quickstart"
                  className="text-blue-600 underline"
                >
                  Cron Jobs Quickstart
                </a>{' '}
                to deploy your first scheduled task in minutes.
              </p>
            </>
          ),
        },
        {
          heading: 'Learn More',
          content: (
            <ul className="list-disc list-inside space-y-1">
              <li>
                <a
                  href="/docs/cron-jobs/quickstart"
                  className="text-blue-600 underline"
                >
                  Quickstart Guide
                </a>
              </li>
              <li>
                <a
                  href="/docs/cron-jobs/syntax"
                  className="text-blue-600 underline"
                >
                  Cron Syntax Reference
                </a>
              </li>
              <li>
                <a
                  href="/docs/cron-jobs/monitoring"
                  className="text-blue-600 underline"
                >
                  Monitoring & Logs
                </a>
              </li>
              <li>
                <a
                  href="/docs/cron-jobs/security"
                  className="text-blue-600 underline"
                >
                  Security & Best Practices
                </a>
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
