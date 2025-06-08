import React from 'react';
import DocPage from '../components/DocPage';

export default function HeadersPage() {
  return (
    <DocPage
      title="Headers"
      description="Understand HTTP headers, their types, and how to configure them for your web applications."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Headers', href: '/docs/headers' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            HTTP headers are key-value pairs sent between the client and server
            with every request and response. They control how content is
            delivered, enhance security, and enable advanced features like
            caching and content negotiation.
          </p>
        </section>
        <section>
          <h3>Common Types of Headers</h3>
          <ul>
            <li>
              <strong>General Headers:</strong> Apply to both requests and
              responses, e.g., <code>Date</code>, <code>Connection</code>.
            </li>
            <li>
              <strong>Request Headers:</strong> Sent by the client, e.g.,{' '}
              <code>Accept</code>, <code>Authorization</code>,{' '}
              <code>User-Agent</code>.
            </li>
            <li>
              <strong>Response Headers:</strong> Sent by the server, e.g.,{' '}
              <code>Server</code>, <code>Set-Cookie</code>.
            </li>
            <li>
              <strong>Entity Headers:</strong> Provide information about the
              body, e.g., <code>Content-Type</code>, <code>Content-Length</code>
              .
            </li>
            <li>
              <strong>Security Headers:</strong> Enhance security, e.g.,{' '}
              <code>Content-Security-Policy</code>,{' '}
              <code>Strict-Transport-Security</code>.
            </li>
          </ul>
        </section>
        <section>
          <h3>Why Headers Matter</h3>
          <ul>
            <li>Control browser and server behavior</li>
            <li>Improve security and privacy</li>
            <li>Enable caching and performance optimizations</li>
            <li>Support content negotiation and localization</li>
          </ul>
        </section>
        <section>
          <h3>Learn More</h3>
          <ul>
            <li>
              <a href="/docs/headers/security-headers" className="underline">
                Security Headers
              </a>{' '}
              &ndash; Best practices for securing your app.
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                MDN Web Docs: HTTP Headers
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
