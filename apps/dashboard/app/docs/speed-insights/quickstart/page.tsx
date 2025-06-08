// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
type Breadcrumb = { label: string; href: string };

type DocPageProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
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

const quickstartContent = (
  <div className="prose dark:prose-invert max-w-none">
    <h2>Quickstart: Deploying Your First Project with Webduh Speed Insights</h2>
    <p>
      Follow these steps to get up and running with Speed Insights and start
      monitoring your web application's performance.
    </p>
    <ol>
      <li>
        <strong>Sign Up or Log In:</strong> Create a Webduh account or log in to
        your existing account.
      </li>
      <li>
        <strong>Add Your Project:</strong> In the dashboard, click{' '}
        <code>New Project</code> and enter your website’s URL.
      </li>
      <li>
        <strong>Verify Ownership:</strong> Follow the instructions to verify you
        own the domain. This may involve adding a DNS record or uploading a
        verification file.
      </li>
      <li>
        <strong>Install the Webduh Script:</strong> Copy the provided script tag
        and add it to the <code>&lt;head&gt;</code> of your website’s HTML.
        <pre>
          <code>
            {`<script src="https://cdn.webduh.com/speed-insights.js" async></script>`}
          </code>
        </pre>
      </li>
      <li>
        <strong>Deploy Your Site:</strong> Push your changes live. Webduh will
        automatically start collecting performance data.
      </li>
      <li>
        <strong>View Insights:</strong> Return to the Speed Insights dashboard
        to see real-time metrics, recommendations, and historical trends.
      </li>
    </ol>
    <h3>Next Steps</h3>
    <ul>
      <li>
        <a href="/docs/speed-insights">
          Learn more about Speed Insights metrics
        </a>
      </li>
      <li>
        <a href="/docs/speed-insights/troubleshooting">
          Troubleshooting common issues
        </a>
      </li>
      <li>
        <a href="/docs/webhooks">
          Integrate with webhooks for automated alerts
        </a>
      </li>
    </ul>
    <p>
      <strong>Tip:</strong> For best results, keep your Webduh script up to date
      and review recommendations regularly.
    </p>
  </div>
);

export default function QuickstartPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Learn how to deploy your first project with webduh"
      breadcrumbs={[{ label: 'Speed Insights', href: '/docs/speed-insights' }]}
    >
      {quickstartContent}
    </DocPage>
  );
}
