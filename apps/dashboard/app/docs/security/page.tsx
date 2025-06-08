// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
type DocPageProps = {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href: string }[];
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        {breadcrumbs && (
          <ol className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((bc, i) => (
              <li key={bc.href}>
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
                {i < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
              </li>
            ))}
          </ol>
        )}
      </nav>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: React.ReactNode;
};

function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-t">
          {filename}
        </div>
      )}
      <pre
        className={`rounded-b ${language ? `language-${language}` : ''} bg-gray-900 text-gray-100 p-4 overflow-x-auto`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <DocPage
      title="Security"
      description="webduh provides enterprise-grade security features including automatic SSL, DDoS protection, and security headers."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            Security is built into every layer of webduh. From automatic SSL
            certificates to DDoS protection, your applications are secured by
            default.
          </p>
        </div>

        <div>
          <h2 id="ssl-certificates">SSL Certificates</h2>
          <p>Free, automatic SSL certificates for all deployments:</p>

          <ul>
            <li>• Automatic HTTPS redirect</li>
            <li>• TLS 1.3 encryption</li>
            <li>• Wildcard certificate support</li>
            <li>• Automatic renewal</li>
          </ul>
        </div>

        <div>
          <h2 id="security-headers">Security Headers</h2>
          <p>Configure security headers for your application:</p>

          <CodeBlock language="javascript" filename="next.config.js">
            {`module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="environment-isolation">Environment Isolation</h2>
          <p>Each deployment runs in an isolated environment:</p>

          <ul>
            <li>• Containerized functions</li>
            <li>• Network isolation</li>
            <li>• Encrypted environment variables</li>
            <li>• Secure secret management</li>
          </ul>
        </div>
      </div>
    </DocPage>
  );
}
