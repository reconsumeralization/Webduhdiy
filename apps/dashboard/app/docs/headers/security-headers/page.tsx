import React from 'react';
import DocPage from '../../components/DocPage';

export default function SecurityHeadersPage() {
  return (
    <DocPage
      title="Security Headers"
      description="Learn about HTTP security headers, their importance, and how to configure them for your web applications."
      breadcrumbs={[{ label: 'Headers', href: '/docs/headers' }]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Security headers are HTTP response headers that help protect your
            application from common web vulnerabilities by instructing browsers
            on how to behave when handling your site’s content. Properly
            configuring these headers is a critical part of a strong security
            posture.
          </p>
        </section>
        <section>
          <h3>Common Security Headers</h3>
          <ul>
            <li>
              <strong>Content-Security-Policy (CSP):</strong> Prevents
              cross-site scripting (XSS), clickjacking, and other code injection
              attacks by specifying which sources are allowed to load content.
            </li>
            <li>
              <strong>Strict-Transport-Security (HSTS):</strong> Forces browsers
              to use HTTPS, protecting against protocol downgrade attacks.
            </li>
            <li>
              <strong>X-Frame-Options:</strong> Prevents your site from being
              embedded in iframes, mitigating clickjacking attacks.
            </li>
            <li>
              <strong>X-Content-Type-Options:</strong> Stops browsers from
              MIME-sniffing a response away from the declared content-type.
            </li>
            <li>
              <strong>Referrer-Policy:</strong> Controls how much referrer
              information is included with requests.
            </li>
            <li>
              <strong>Permissions-Policy:</strong> Restricts which browser
              features can be used in the context of your site.
            </li>
          </ul>
        </section>
        <section>
          <h3>Best Practices</h3>
          <ul>
            <li>Always use HTTPS and enable HSTS with a long max-age.</li>
            <li>
              Define a strict Content-Security-Policy tailored to your
              application’s needs.
            </li>
            <li>
              Set X-Frame-Options to <code>DENY</code> or{' '}
              <code>SAMEORIGIN</code> unless framing is required.
            </li>
            <li>
              Set X-Content-Type-Options to <code>nosniff</code>.
            </li>
            <li>Review and set Referrer-Policy to limit data leakage.</li>
            <li>
              Regularly audit your headers using tools like{' '}
              <a
                href="https://securityheaders.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                securityheaders.com
              </a>
              .
            </li>
          </ul>
        </section>
        <section>
          <h3>Example Configuration</h3>
          <pre>
            {`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=()`}
          </pre>
        </section>
      </div>
    </DocPage>
  );
}
