import React from 'react';
import DocPage from '../../components/DocPage';

export default function BuildPage() {
  return (
    <DocPage
      title="webduh build"
      description="The <code>webduh build</code> command compiles your project for deployment using the webduh CLI. Learn how to use build options, customize your build process, and troubleshoot common issues."
      breadcrumbs={[
        { label: 'CLI', href: '/docs/cli' },
        { label: 'Build', href: '/docs/cli/build' },
      ]}
      sections={[
        {
          heading: 'Overview',
          content:
            'The <code>webduh build</code> command prepares your application for deployment by running the necessary build steps defined in your project. It detects your framework, installs dependencies, and outputs optimized assets.',
        },
        {
          heading: 'Basic Usage',
          content: (
            <>
              <pre>
                <code>webduh build</code>
              </pre>
              <p>
                Run this command in your project root. By default, webduh will
                auto-detect your framework and use the appropriate build
                process.
              </p>
            </>
          ),
        },
        {
          heading: 'Options',
          content: (
            <ul>
              <li>
                <code>--prod</code> – Build for production (default).
              </li>
              <li>
                <code>--config &lt;file&gt;</code> – Specify a custom
                configuration file.
              </li>
              <li>
                <code>--debug</code> – Enable verbose logging for
                troubleshooting.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Customizing the Build',
          content:
            'You can customize the build process by editing your <code>webduh.json</code> or by providing custom build scripts in your project settings. Refer to the documentation for advanced configuration options.',
        },
        {
          heading: 'Troubleshooting',
          content:
            'If your build fails, check the output logs for error messages. Common issues include missing dependencies, misconfigured scripts, or incompatible framework versions. For more help, visit the troubleshooting guide.',
        },
      ]}
    />
  );
}
