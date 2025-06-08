import React from 'react';
import DocPage from '../../components/DocPage';

export default function DevPage() {
  return (
    <DocPage
      title="webduh dev"
      description="The <code>webduh dev</code> command starts a local development server with hot reloading, environment variable support, and framework auto-detection. Use it to preview and iterate on your project before deploying."
      breadcrumbs={[
        { label: 'CLI', href: '/docs/cli' },
        { label: 'Dev', href: '/docs/cli/dev' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content:
            'The <code>webduh dev</code> command launches your project in development mode. It automatically detects your framework (Next.js, React, Vue, etc.), sets up environment variables, and provides fast refresh for rapid feedback.',
        },
        {
          heading: 'Basic Usage',
          content: (
            <>
              <pre>
                <code>webduh dev</code>
              </pre>
              <p>
                Run this command in your project root. The development server
                will start and provide a local URL for previewing your app.
              </p>
            </>
          ),
        },
        {
          heading: 'Options',
          content: (
            <ul>
              <li>
                <code>--port &lt;number&gt;</code> – Specify a custom port
                (default: 3000).
              </li>
              <li>
                <code>--open</code> – Automatically open your browser when the
                server starts.
              </li>
              <li>
                <code>--env &lt;key=value&gt;</code> – Set environment variables
                for this session.
              </li>
              <li>
                <code>--config &lt;file&gt;</code> – Use a custom configuration
                file.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Environment Variables',
          content:
            'webduh dev loads environment variables from <code>.env</code> files and your system environment. You can override variables using the <code>--env</code> flag or by editing your <code>.env</code> file.',
        },
        {
          heading: 'Troubleshooting',
          content: (
            <>
              <ul>
                <li>
                  <strong>Port already in use?</strong> Use <code>--port</code>{' '}
                  to specify a different port.
                </li>
                <li>
                  <strong>Framework not detected?</strong> Ensure your project
                  contains a supported framework or specify a custom config.
                </li>
                <li>
                  <strong>Hot reload not working?</strong> Check your
                  framework's documentation and ensure dependencies are up to
                  date.
                </li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
