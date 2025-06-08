import React from 'react';
import DocPage from '../components/DocPage';

export default function EdgeMiddlewarePage() {
  return (
    <DocPage
      title="Edge Middleware"
      description="Edge Middleware lets you run code at the edge, enabling dynamic routing, authentication, and more—before a request reaches your application."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Edge Middleware', href: '/docs/edge-middleware' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What is Edge Middleware?</h2>
        <p>
          Edge Middleware allows you to run lightweight code at the edge, close
          to your users, before a request is processed by your application. This
          enables use cases like authentication, redirects, rewrites, and
          feature flags with minimal latency.
        </p>
        <h3>Common Use Cases</h3>
        <ul>
          <li>Authentication and access control</li>
          <li>URL rewrites and redirects</li>
          <li>Geolocation-based personalization</li>
          <li>Feature flagging and A/B testing</li>
        </ul>
        <h3>Getting Started</h3>
        <p>
          To learn how to set up and use Edge Middleware in your project, check
          out the{' '}
          <a
            href="/docs/edge-middleware/quickstart"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Quickstart
          </a>
          .
        </p>
      </section>
    </DocPage>
  );
}
