import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function CompressionPage() {
  return (
    <DocPage
      title="Compression"
      description="Optimize your webduh project with automatic Brotli and Gzip compression at the edge. Learn how compression works and how to verify it's enabled."
      breadcrumbs={[
        { label: 'Edge Network', href: '/docs/edge-network' },
        { label: 'Compression', href: '/docs/edge-network/compression' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>What is Compression?</h2>
        <p>
          Compression reduces the size of your website’s assets (HTML, CSS,
          JavaScript, etc.) before they’re sent to visitors. This results in
          faster load times and reduced bandwidth usage.
        </p>

        <h2>How webduh Handles Compression</h2>
        <ul>
          <li>
            <strong>Automatic at the Edge:</strong> All static and dynamic
            content is compressed using{' '}
            <a
              href="https://en.wikipedia.org/wiki/Brotli"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brotli
            </a>{' '}
            (for modern browsers) or{' '}
            <a
              href="https://en.wikipedia.org/wiki/Gzip"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gzip
            </a>{' '}
            (for legacy support).
          </li>
          <li>
            <strong>No configuration required:</strong> Compression is enabled
            by default for all projects.
          </li>
          <li>
            <strong>Content negotiation:</strong> The edge network automatically
            selects the best compression algorithm supported by the client.
          </li>
        </ul>

        <h2>Verifying Compression</h2>
        <p>
          You can verify that compression is working by inspecting the{' '}
          <code>Content-Encoding</code> response header:
        </p>
        <CodeBlock language="bash">{`curl -I https://yourdomain.com
# Look for: Content-Encoding: br (Brotli) or gzip
`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Keep your assets as small as possible before compression (minify
            JS/CSS, optimize images).
          </li>
          <li>
            Let webduh handle compression—avoid double-compressing assets in
            your build pipeline.
          </li>
          <li>
            Use Brotli for best results; Gzip is provided for compatibility.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
