// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// DocPage component stub for self-containment
type DocPageProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {breadcrumbs && (
            <nav className="mb-4">
              <ol className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </header>
        <main className="prose prose-gray dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}

// CodeBlock component stub for self-containment
type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: React.ReactNode;
};
function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="not-prose my-4">
      {filename && (
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 rounded-t">
          {filename}
        </div>
      )}
      <pre
        className={`language-${language ?? 'text'} bg-gray-900 text-gray-100 rounded-b rounded ${filename ? '' : 'rounded'}`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function RedirectsPage() {
  return (
    <DocPage
      title="Redirects"
      description="Learn how to use redirects to guide users and search engines to the correct resources in your webduh project."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Redirects', href: '/docs/redirects' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>What are Redirects?</h2>
          <p>
            <strong>Redirects</strong> automatically send users and search
            engines from one URL to another. They are essential for maintaining
            SEO, handling moved content, and ensuring a smooth user experience.
          </p>
        </section>

        <section>
          <h2>How Redirects Work</h2>
          <p>
            When a redirect rule matches an incoming request, the server
            responds with a status code (such as <code>301</code> for permanent
            or <code>302</code> for temporary) and the new destination URL. The
            browser then navigates to the new location.
          </p>
        </section>

        <section>
          <h2>Example: next.config.js</h2>
          <p>
            To configure redirects in a Next.js project, add a{' '}
            <code>redirects</code> function to your <code>next.config.js</code>:
          </p>
          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug*',
        destination: '/blog/:slug*',
        permanent: true, // 301 redirect
      },
      {
        source: '/docs',
        destination: '/documentation',
        permanent: false, // 302 redirect
      },
    ]
  },
}`}
          </CodeBlock>
        </section>

        <section>
          <h2>Best Practices</h2>
          <ul>
            <li>
              Use <code>permanent: true</code> for URLs that have moved
              permanently to help search engines update their indexes.
            </li>
            <li>
              Use <code>permanent: false</code> for temporary changes.
            </li>
            <li>
              Test your redirects to ensure they work as expected and avoid
              redirect loops.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
