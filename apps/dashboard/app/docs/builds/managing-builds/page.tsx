import React from 'react';
import DocPage from '../../components/DocPage';

export default function ManagingBuildsPage() {
  return (
    <DocPage
      title="Managing Builds"
      description="Discover best practices and tools for managing your builds efficiently in webduh. Learn how to monitor, troubleshoot, and optimize your build processes for reliability and speed."
      breadcrumbs={[
        { label: 'Builds', href: '/docs/builds' },
        { label: 'Managing Builds', href: '/docs/builds/managing-builds' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content:
            'Managing builds is crucial for maintaining a healthy CI/CD pipeline. This guide covers how to view build history, monitor build status, and take action on failed or pending builds.',
        },
        {
          heading: 'Viewing Build History',
          content:
            "Access your project's build history from the dashboard. Each build entry provides details such as commit information, status, duration, and logs. Use filters to quickly find specific builds.",
        },
        {
          heading: 'Monitoring Build Status',
          content:
            'Stay informed about your builds in real time. The dashboard displays the current status of each build (queued, running, succeeded, failed). You can also set up notifications for build events.',
        },
        {
          heading: 'Troubleshooting Failed Builds',
          content:
            "When a build fails, review the logs to identify the cause. Common issues include dependency errors, misconfigured environment variables, or failing tests. Use the 'Retry' button to rerun builds after fixing issues.",
        },
        {
          heading: 'Optimizing Build Performance',
          content:
            'Reduce build times by caching dependencies, running tests in parallel, and only triggering builds for relevant changes. Regularly review your build configuration for opportunities to streamline the process.',
        },
      ]}
    />
  );
}
