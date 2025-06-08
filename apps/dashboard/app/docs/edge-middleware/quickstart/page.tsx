import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function QuickstartPage() {
  return (
    <DocPage
      title="Edge Middleware Quickstart"
      description="Learn how to use edge middleware to enhance your webduh project with authentication, redirects, and more."
      breadcrumbs={[
        { label: 'Edge Middleware', href: '/docs/edge-middleware' },
        { label: 'Quickstart', href: '/docs/edge-middleware/quickstart' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What is Edge Middleware?</h2>
        <p>
          Edge Middleware lets you run code before a request is completed,
          enabling features like authentication, redirects, rewrites, and
          more—right at the edge, close to your users.
        </p>

        <h2>Quickstart Guide</h2>
        <ol>
          <li>
            <strong>
              Create a <code>middleware.ts</code> file
            </strong>{' '}
            in the root of your project:
            <CodeBlock language="typescript">{`// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Example: Redirect all traffic to HTTPS
  if (request.nextUrl.protocol !== 'https:') {
    return NextResponse.redirect(
      new URL('https://' + request.nextUrl.host + request.nextUrl.pathname)
    )
  }
  return NextResponse.next()
}
`}</CodeBlock>
          </li>
          <li>
            <strong>Deploy your project</strong> to webduh. The middleware will
            run on every request.
          </li>
          <li>
            <strong>Test your middleware</strong> by visiting your site and
            observing the behavior (e.g., automatic HTTPS redirect).
          </li>
        </ol>

        <h2>Common Use Cases</h2>
        <ul>
          <li>Authentication and access control</li>
          <li>URL rewrites and redirects</li>
          <li>Geolocation-based personalization</li>
          <li>Header manipulation</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Explore more advanced middleware patterns in the{' '}
          <a href="/docs/edge-middleware">Edge Middleware documentation</a>.
        </p>
      </section>
    </DocPage>
  );
}
