'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function RemixPage() {
  return (
    <DocPage
      title="Remix"
      description="Deploy Remix applications with full SSR and edge support"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'Remix', href: '/docs/frameworks/remix' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Remix</strong> is a modern React framework for building
            fast, dynamic, and resilient web applications. Deploy your Remix app
            on <strong>webduh</strong> for instant global hosting, full SSR, and
            edge rendering.
          </p>
        </section>
        <section>
          <h3>Getting Started</h3>
          <ol>
            <li>
              <strong>Create a Remix App:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npx create-remix@latest
cd my-remix-app
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
              webduh auto-detects Remix projects and sets optimal build
              settings.
            </li>
            <li>Zero-config deployment for most Remix apps.</li>
            <li>Supports SSR, API routes, and static assets out of the box.</li>
          </ul>
        </section>
        <section>
          <h3>Customizing Your Build</h3>
          <p>
            You can customize your build and deployment settings in{' '}
            <code>webduh.json</code>:
          </p>
          <CodeBlock language="json" filename="webduh.json">
            {`{
  "framework": "remix",
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}`}
          </CodeBlock>
        </section>
        <section>
          <h3>Next Steps</h3>
          <ul>
            <li>
              <a href="/docs/functions/quickstart">Add serverless functions</a>
            </li>
            <li>
              <a href="/docs/functions/configuring-functions">
                Configure API endpoints
              </a>
            </li>
            <li>
              <a
                href="https://remix.run/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Remix Documentation
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
