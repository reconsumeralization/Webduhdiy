import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function AstroPage() {
  return (
    <DocPage
      title="Astro"
      description="Deploy Astro sites with optimal performance and zero-JS by default. Learn how to integrate Astro with webduh for seamless deployments, edge performance, and environment management."
      breadcrumbs={[
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'Astro', href: '/docs/frameworks/astro' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>Why Astro?</h2>
        <p>
          Astro is a modern static site builder focused on performance, shipping
          zero JavaScript by default. It’s ideal for content-heavy sites, blogs,
          and documentation.
        </p>

        <h2>Quick Start</h2>
        <ol>
          <li>
            <strong>Initialize your Astro project:</strong>
            <CodeBlock language="bash">{`npm create astro@latest`}</CodeBlock>
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
        >{`PUBLIC_API_URL=https://api.example.com`}</CodeBlock>
        <CodeBlock language="javascript" filename="src/pages/index.astro">{`---
// Access public environment variables in Astro
const apiUrl = import.meta.env.PUBLIC_API_URL;
---
<p>API URL: {apiUrl}</p>
`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>PUBLIC_*</code> prefix for variables you want available in
            the browser.
          </li>
          <li>Keep secrets and private keys out of client-side code.</li>
        </ul>
      </section>
    </DocPage>
  );
}
