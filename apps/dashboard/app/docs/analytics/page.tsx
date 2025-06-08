'use client';

// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Minimal DocPage component for documentation layout with sections prop and optional breadcrumbs.
type Section = {
  heading: string;
  content: React.ReactNode;
};
type Breadcrumb = { label: string; href: string };
type DocPageProps = {
  title: string;
  description?: string;
  sections?: Section[];
  breadcrumbs?: Breadcrumb[];
  children?: React.ReactNode;
};
function DocPage({
  title,
  description,
  sections,
  breadcrumbs,
  children,
}: DocPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {breadcrumbs && (
        <nav className="mb-6 text-sm text-muted-foreground">
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
        </nav>
      )}
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="mb-6 text-lg text-muted-foreground">{description}</p>
      )}
      <main>
        {sections && sections.length > 0 ? (
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section key={section.heading + idx}>
                <h2 className="text-xl font-semibold mb-2">
                  {section.heading}
                </h2>
                <div>{section.content}</div>
              </section>
            ))}
          </div>
        ) : (
          children
        )}
      </main>
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

// Minimal InlineCode component for inline code styling.
type InlineCodeProps = {
  children: React.ReactNode;
};
function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="px-1 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground">
      {children}
    </code>
  );
}

export default function AnalyticsPage() {
  return (
    <DocPage
      title="Web Analytics"
      description="Track your website's performance and user behavior with webduh Analytics. Privacy-focused, GDPR compliant, and easy to set up."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            webduh Analytics provides privacy-focused web analytics for your
            applications. Track page views, user sessions, performance metrics,
            and more without compromising user privacy or requiring cookie
            banners.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔒 Privacy-First
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No cookies, no tracking, GDPR compliant by design.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ⚡ Real-time
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Live analytics dashboard with real-time visitor tracking.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📊 Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Detailed reports on traffic, performance, and user behavior.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 id="quick-setup">Quick Setup</h2>
          <p>Enable analytics for your project in seconds:</p>

          <CodeBlock language="bash">
            {`# Enable analytics for your project
webduh analytics enable

# Get your analytics ID
webduh analytics info`}
          </CodeBlock>

          <p>For Next.js projects, add the analytics script:</p>
          <CodeBlock language="javascript" filename="app/layout.js">
            {`import { Analytics } from '@webduh/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="tracking-events">Tracking Events</h2>
          <p>Track custom events to understand user behavior:</p>

          <CodeBlock language="javascript">
            {`import { track } from '@webduh/analytics'

// Track button clicks
function handleClick() {
  track('button_click', {
    button: 'signup',
    location: 'header'
  })
}

// Track page views (automatic in most frameworks)
track('page_view', {
  page: '/pricing',
  referrer: document.referrer
})

// Track conversions
track('conversion', {
  type: 'signup',
  plan: 'pro',
  value: 29.99
})`}
          </CodeBlock>
        </div>

        <div>
          <h2 id="metrics">Available Metrics</h2>
          <p>webduh Analytics tracks comprehensive metrics:</p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Traffic Metrics
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Page views and unique visitors</li>
                <li>• Session duration and bounce rate</li>
                <li>• Traffic sources and referrers</li>
                <li>• Geographic distribution</li>
              </ul>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Performance Metrics
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Core Web Vitals (LCP, FID, CLS)</li>
                <li>• Page load times</li>
                <li>• Time to first byte (TTFB)</li>
                <li>• Custom performance marks</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 id="dashboard">Analytics Dashboard</h2>
          <p>Access your analytics dashboard to view detailed reports:</p>

          <CodeBlock language="bash">
            {`# Open analytics dashboard
webduh analytics dashboard

# Export analytics data
webduh analytics export --format csv --period 30d`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
