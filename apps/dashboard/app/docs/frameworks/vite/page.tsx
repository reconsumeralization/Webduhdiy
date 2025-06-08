'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function VitePage() {
  return (
    <DocPage
      title="Vite"
      description="Deploy Vite-powered applications with lightning fast builds"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'Vite', href: '/docs/frameworks/vite' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Vite</strong> is a next-generation frontend build tool that
            delivers instant server start and lightning-fast hot module
            replacement. Deploy your Vite-powered apps on{' '}
            <strong>webduh</strong> for seamless, zero-config global hosting.
          </p>
        </section>
        <section>
          <h3>Getting Started</h3>
          <ol>
            <li>
              <strong>Create a Vite App:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npm create vite@latest my-vite-app
cd my-vite-app
npm install`}
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
              webduh auto-detects Vite projects and sets optimal build settings.
            </li>
            <li>
              No need to configure <code>output</code> or <code>public</code>{' '}
              directories manually.
            </li>
            <li>Supports all Vite templates (React, Vue, Svelte, etc.).</li>
          </ul>
        </section>
        <section>
          <h3>Custom Builds</h3>
          <p>
            To customize the build command or output directory, add a{' '}
            <code>webduh.json</code> file:
          </p>
          <CodeBlock language="json" filename="webduh.json">
            {`{
  "build": "vite build",
  "output": "dist"
}`}
          </CodeBlock>
        </section>
        <section>
          <h3>Resources</h3>
          <ul>
            <li>
              <a
                href="https://vitejs.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Vite Documentation
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
