'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function ReactRouterPage() {
  return (
    <DocPage
      title="React Router"
      description="Deploy React Router applications with zero-config static hosting"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'React Router', href: '/docs/frameworks/react-router' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>React Router</strong> is a popular routing library for React
            applications, enabling dynamic client-side navigation. Deploy your
            React Router app on <strong>webduh</strong> for instant, zero-config
            static hosting.
          </p>
        </section>
        <section>
          <h3>Getting Started</h3>
          <ol>
            <li>
              <strong>Create a React App with React Router:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npx create-react-app my-react-router-app
cd my-react-router-app
npm install react-router-dom`}
              </CodeBlock>
            </li>
            <li>
              <strong>Deploy with webduh:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npm install -g @webduh/cli
webduh --prod`}
              </CodeBlock>
            </li>
          </ol>
        </section>
        <section>
          <h3>Automatic Configuration</h3>
          <ul>
            <li>
              webduh auto-detects React Router projects and configures static
              hosting automatically.
            </li>
            <li>
              No need to manually set build or output directories—just deploy!
            </li>
            <li>
              Supports client-side routing out of the box (SPA fallback to{' '}
              <code>index.html</code>).
            </li>
          </ul>
        </section>
        <section>
          <h3>Custom Domains & Edge Caching</h3>
          <ul>
            <li>Connect your own domain for a branded experience.</li>
            <li>
              Enjoy instant global edge caching for fast performance worldwide.
            </li>
          </ul>
        </section>
        <section>
          <h3>Next Steps</h3>
          <ul>
            <li>
              <a
                href="https://reactrouter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                React Router Documentation
              </a>
            </li>
            <li>
              <a
                href="/docs/frameworks"
                className="text-primary-600 hover:underline"
              >
                All Supported Frameworks
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
