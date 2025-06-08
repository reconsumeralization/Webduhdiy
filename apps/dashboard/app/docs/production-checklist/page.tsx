'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import Link from 'next/link';

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
                      <Link
                        href={item.href}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
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

export default function ProductionChecklistPage() {
  return (
    <DocPage
      title="Production Checklist"
      description="Essential checklist to ensure your app is production-ready."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Production Checklist', href: '/docs/production-checklist' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            Follow this checklist to ensure your application is ready for
            production. Completing these steps will help you avoid common
            pitfalls and ensure a smooth launch.
          </p>
        </section>

        <section>
          <h2 id="checklist">Production Checklist</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Environment Variables:</strong> Double-check that all
              required environment variables are set and <code>NODE_ENV</code>{' '}
              is <code>production</code>.
            </li>
            <li>
              <strong>Secrets Management:</strong> Never commit secrets or API
              keys to your repository. Use environment variables or a secrets
              manager.
            </li>
            <li>
              <strong>Build Optimization:</strong> Run a production build (
              <code>npm run build</code> or <code>yarn build</code>) and verify
              there are no warnings or errors.
            </li>
            <li>
              <strong>Static Assets:</strong> Ensure all static assets (images,
              fonts, etc.) are optimized and included in your build output.
            </li>
            <li>
              <strong>404 and Error Pages:</strong> Provide custom{' '}
              <code>404</code> and <code>500</code> error pages for a better
              user experience.
            </li>
            <li>
              <strong>Security Headers:</strong> Set HTTP security headers (CSP,
              X-Frame-Options, etc.) to protect your app.
            </li>
            <li>
              <strong>HTTPS:</strong> Enforce HTTPS and redirect all HTTP
              traffic to HTTPS.
            </li>
            <li>
              <strong>Monitoring & Logging:</strong> Set up monitoring, logging,
              and alerting for your application and infrastructure.
            </li>
            <li>
              <strong>Backups:</strong> Ensure regular backups for databases and
              critical data.
            </li>
            <li>
              <strong>Performance:</strong> Audit your app with tools like
              Lighthouse and address any performance bottlenecks.
            </li>
            <li>
              <strong>Accessibility:</strong> Test your app for accessibility
              (a11y) compliance.
            </li>
            <li>
              <strong>SEO:</strong> Add meta tags, Open Graph tags, and ensure
              your app is crawlable by search engines.
            </li>
            <li>
              <strong>Domain & DNS:</strong> Verify your domain is correctly
              configured and DNS records are up to date.
            </li>
            <li>
              <strong>Third-party Integrations:</strong> Confirm all third-party
              services (analytics, email, payments, etc.) are working in
              production.
            </li>
            <li>
              <strong>Testing:</strong> Run your test suite and perform manual
              QA on critical flows.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="resources">Resources</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a
                href="https://web.dev/launch-checklist/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Web Launch Checklist
              </a>
            </li>
            <li>
              <a
                href="https://nextjs.org/docs/going-to-production"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js: Going to Production
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Deployment"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDN: Deploying your web application
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
