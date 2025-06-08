import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function CreateReactAppPage() {
  return (
    <DocPage
      title="Create React App"
      description="Deploy Create React App (CRA) projects with webduh for fast, reliable hosting and seamless CI/CD. Learn how to configure, build, and optimize your CRA app for production."
      breadcrumbs={[
        { label: 'Frameworks', href: '/docs/frameworks' },
        {
          label: 'Create React App',
          href: '/docs/frameworks/create-react-app',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>Why Create React App?</h2>
        <p>
          Create React App (CRA) is a popular toolchain for bootstrapping React
          applications with zero configuration. It provides a fast development
          environment, sensible defaults, and a robust build pipeline.
        </p>

        <h2>Getting Started</h2>
        <ol>
          <li>
            <strong>Create a new CRA project:</strong>
            <CodeBlock language="bash">{`npx create-react-app my-app`}</CodeBlock>
          </li>
          <li>
            <strong>Push your code to GitHub, GitLab, or Bitbucket.</strong>
          </li>
          <li>
            <strong>
              Connect your repository to webduh and select "Create React App" as
              the framework.
            </strong>
          </li>
        </ol>

        <h2>Build & Output Settings</h2>
        <ul>
          <li>
            <strong>Build Command:</strong>{' '}
            <CodeBlock language="bash">{`npm run build`}</CodeBlock>
          </li>
          <li>
            <strong>Output Directory:</strong>{' '}
            <CodeBlock language="bash">{`build`}</CodeBlock>
          </li>
        </ul>

        <h2>Environment Variables</h2>
        <p>
          CRA exposes environment variables prefixed with{' '}
          <code>REACT_APP_</code> to your application. Set them in the webduh
          dashboard or in your <code>.env</code> files.
        </p>
        <CodeBlock
          language="env"
          filename=".env"
        >{`REACT_APP_API_URL=https://api.example.com
REACT_APP_FEATURE_FLAG=true
`}</CodeBlock>

        <h2>Optimizing for Production</h2>
        <ul>
          <li>
            Use <code>npm run build</code> to generate an optimized production
            build.
          </li>
          <li>
            Leverage webduh's global edge network for fast asset delivery.
          </li>
          <li>
            Configure custom domains, redirects, and environment variables in
            the dashboard.
          </li>
        </ul>

        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>Build fails?</strong> Check your <code>package.json</code>{' '}
            scripts and ensure all dependencies are installed.
          </li>
          <li>
            <strong>Environment variables not available?</strong> Make sure they
            are prefixed with <code>REACT_APP_</code> and set in the correct
            environment.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
