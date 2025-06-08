// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Minimal DocPage component for documentation layout with sections prop.
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
    <code className="px-1 py-0.5 rounded bg-muted text-sm font-mono">
      {children}
    </code>
  );
}

export default function QuickstartPage() {
  return (
    <DocPage
      title="Analytics Quickstart"
      description="Get started with Webduh Analytics in just a few minutes. This guide walks you through connecting your site, configuring tracking, deploying, and exploring actionable insights."
      breadcrumbs={[
        { label: 'Web Analytics', href: '/docs/analytics' },
        { label: 'Quickstart', href: '/docs/analytics/quickstart' },
      ]}
      sections={[
        {
          heading: '1. Connect Your Data Source',
          content: (
            <>
              <p>
                Begin by linking your website or application to Webduh. Use the
                provided integration snippet or SDK for your platform.
              </p>
              <p className="mt-4 font-semibold">
                For a typical JavaScript website, add this snippet before the
                closing <InlineCode>&lt;/head&gt;</InlineCode> tag:
              </p>
              <CodeBlock language="html">{`<script async src="https://cdn.webduh.com/analytics.js" data-webduh-id="YOUR_ANALYTICS_ID"></script>`}</CodeBlock>
              <p className="mt-2 text-sm text-gray-500">
                Replace <InlineCode>YOUR_ANALYTICS_ID</InlineCode> with your
                actual analytics project ID.
              </p>
              <p className="mt-4">
                For other frameworks or platforms, see the{' '}
                <a
                  href="/docs/analytics/integrations"
                  className="text-blue-600 underline"
                >
                  integration guides
                </a>
                .
              </p>
            </>
          ),
        },
        {
          heading: '2. Configure Tracking',
          content: (
            <>
              <p>
                Customize what events and metrics you want to track. Webduh
                automatically tracks page views, but you can add custom events
                and user properties as needed.
              </p>
              <p className="mt-4 font-semibold">
                Example: Track a custom event when a user signs up:
              </p>
              <CodeBlock language="javascript">{`window.webduh && window.webduh.track('signup', { plan: 'pro' });`}</CodeBlock>
              <p className="mt-2 text-sm text-gray-500">
                See the{' '}
                <a
                  href="/docs/analytics/events"
                  className="text-blue-600 underline"
                >
                  events documentation
                </a>{' '}
                for more details.
              </p>
            </>
          ),
        },
        {
          heading: '3. Deploy and Verify',
          content: (
            <>
              <p>
                Deploy your project and verify that data is flowing into your
                analytics dashboard.
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Visit your website in a private/incognito window.</li>
                <li>Open your Webduh Analytics dashboard.</li>
                <li>
                  Check the <span className="font-semibold">Real-Time</span>{' '}
                  view to confirm events are being received.
                </li>
              </ol>
              <p className="mt-2 text-sm text-gray-500">
                If you don’t see data, double-check your integration and
                analytics ID.
              </p>
            </>
          ),
        },
        {
          heading: '4. Explore Insights',
          content: (
            <>
              <p>
                Navigate to your analytics dashboard to explore traffic,
                engagement, and conversion metrics. Use filters and segments to
                drill down into your data.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  Set up <span className="font-semibold">alerts</span> for
                  traffic spikes or goal completions.
                </li>
                <li>
                  Schedule{' '}
                  <span className="font-semibold">automated reports</span> to
                  your inbox.
                </li>
                <li>
                  Share dashboards with your team for collaborative analysis.
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                For advanced usage, see{' '}
                <a
                  href="/docs/analytics/insights"
                  className="text-blue-600 underline"
                >
                  Analytics Insights
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
