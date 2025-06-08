// TODO: confirm version & license.
import React from 'react';

/* --- embedded utilities --- */
// Minimal DocPage component for documentation layout.
type Breadcrumb = { label: string; href: string };
type DocPageProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
};
function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        {breadcrumbs && (
          <ol className="flex space-x-2">
            {breadcrumbs.map((bc, i) => (
              <li key={bc.href}>
                {i > 0 && <span className="mx-1">/</span>}
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
              </li>
            ))}
          </ol>
        )}
      </nav>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="mb-6 text-lg text-muted-foreground">{description}</p>
      )}
      <main>{children}</main>
    </div>
  );
}

// Minimal CodeBlock component for code display.
type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: string;
};
function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="bg-muted px-3 py-1 rounded-t text-xs font-mono text-muted-foreground">
          {filename}
        </div>
      )}
      <pre
        className={`rounded-b ${filename ? '' : 'rounded'} bg-black text-white p-4 overflow-x-auto`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
/* --- end embedded utilities --- */

export default function RewritesPage() {
  return (
    <DocPage
      title="Rewrites"
      description="Learn how to use rewrites to map incoming requests to different destinations in your webduh project."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Rewrites', href: '/docs/rewrites' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>What are Rewrites?</h2>
          <p>
            <strong>Rewrites</strong> allow you to map an incoming request path
            to a different destination path, either within your application or
            to an external URL. This is useful for clean URLs, proxying API
            requests, or restructuring your routes without breaking links.
          </p>
        </section>

        <section>
          <h2>How Rewrites Work</h2>
          <p>
            When a rewrite rule matches an incoming request, the URL is
            rewritten before it reaches your application code. The user’s
            browser address bar does not change, preserving the original URL.
          </p>
        </section>

        <section>
          <h2>Example: next.config.js</h2>
          <p>
            To configure rewrites in a Next.js project, add a{' '}
            <code>rewrites</code> function to your <code>next.config.js</code>:
          </p>
          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // Matched parameters can be used in the destination
      },
      {
        source: '/api/:path*',
        destination: 'https://external-api.example.com/:path*', // Proxy to external API
      },
    ]
  },
}`}
          </CodeBlock>
        </section>

        <section>
          <h2>Common Use Cases</h2>
          <ul>
            <li>Proxying API requests to a backend or third-party service</li>
            <li>Maintaining legacy URLs after restructuring your site</li>
            <li>Creating clean, user-friendly URLs for marketing or SEO</li>
          </ul>
        </section>

        <section>
          <h2>Tips &amp; Best Practices</h2>
          <ul>
            <li>Rewrites are processed before your application code runs.</li>
            <li>
              Use wildcards (<code>:param*</code>) to match dynamic segments.
            </li>
            <li>
              Combine with <a href="/docs/redirects">redirects</a> for full
              control over routing and navigation.
            </li>
            <li>Test your rewrites locally before deploying to production.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
