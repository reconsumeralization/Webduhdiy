import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function GatsbyPage() {
  return (
    <DocPage
      title="Gatsby"
      description="Deploy blazing-fast Gatsby sites with webduh. Learn how to integrate Gatsby for seamless deployments, edge performance, and environment management."
      breadcrumbs={[
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'Gatsby', href: '/docs/frameworks/gatsby' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>Why Gatsby?</h2>
        <p>
          Gatsby is a React-based static site generator optimized for speed,
          scalability, and a rich plugin ecosystem. It’s ideal for content-rich
          sites, blogs, and e-commerce.
        </p>

        <h2>Quick Start</h2>
        <ol>
          <li>
            <strong>Initialize your Gatsby project:</strong>
            <CodeBlock language="bash">{`npm init gatsby@latest`}</CodeBlock>
          </li>
          <li>
            <strong>Deploy with webduh:</strong>
            <CodeBlock language="bash">{`webduh deploy`}</CodeBlock>
          </li>
        </ol>

        <h2>webduh Integration</h2>
        <ul>
          <li>
            <strong>Automatic static optimization</strong> for fast global
            delivery.
          </li>
          <li>
            <strong>Edge caching</strong> and <strong>zero-config CDN</strong>.
          </li>
          <li>
            <strong>Environment variable support</strong> for build-time and
            runtime configuration.
          </li>
        </ul>

        <h2>Example: Using Environment Variables</h2>
        <CodeBlock
          language="env"
          filename=".env"
        >{`GATSBY_API_URL=https://api.example.com`}</CodeBlock>
        <CodeBlock
          language="javascript"
          filename="src/pages/index.js"
        >{`// Access public environment variables in Gatsby
export default function Home() {
  const apiUrl = process.env.GATSBY_API_URL
  return <div>API URL: {apiUrl}</div>
}
`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Use the <code>GATSBY_*</code> prefix for variables you want
            available in the browser.
          </li>
          <li>Keep secrets and private keys out of client-side code.</li>
        </ul>
      </section>
    </DocPage>
  );
}
