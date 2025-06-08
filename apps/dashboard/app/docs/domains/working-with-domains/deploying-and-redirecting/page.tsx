import React from 'react';
import DocPage from '../../../components/DocPage';

export default function DeployingAndRedirectingPage() {
  return (
    <DocPage
      title="Deploying & Redirecting Domains"
      description="Learn how to deploy your project to a custom domain and set up domain redirects for seamless user experience."
      breadcrumbs={[
        { label: 'Domains', href: '/docs/domains' },
        {
          label: 'Working with Domains',
          href: '/docs/domains/working-with-domains',
        },
        {
          label: 'Deploying & Redirecting',
          href: '/docs/domains/working-with-domains/deploying-and-redirecting',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>Deploying to a Custom Domain</h2>
        <ol>
          <li>
            <strong>Add your domain</strong> in the <code>Domains</code> section
            of your project dashboard.
          </li>
          <li>
            <strong>Verify ownership</strong> by adding the provided DNS record
            to your domain's DNS settings.
          </li>
          <li>
            <strong>Wait for verification</strong>. This may take a few minutes
            depending on your DNS provider.
          </li>
          <li>
            <strong>Deploy your project</strong>. Once verified, your project
            will be accessible via your custom domain.
          </li>
        </ol>

        <h2>Setting Up Redirects</h2>
        <p>
          Redirects help ensure users always land on the correct version of your
          site. You can set up:
        </p>
        <ul>
          <li>
            <strong>www to non-www</strong> (or vice versa) redirects
          </li>
          <li>
            <strong>HTTP to HTTPS</strong> redirects for secure browsing
          </li>
          <li>
            <strong>Path-based</strong> redirects (e.g., <code>/old-page</code>{' '}
            to <code>/new-page</code>)
          </li>
        </ul>
        <p>
          Configure redirects in your dashboard or by adding a{' '}
          <code>redirects.json</code> file to your project root. Example:
        </p>
        <pre>
          {`[
  { "source": "/old-blog", "destination": "/blog", "permanent": true },
  { "source": "http://yourdomain.com", "destination": "https://yourdomain.com", "permanent": true }
]`}
        </pre>

        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>DNS changes not detected?</strong> Double-check your DNS
            records and allow up to 24 hours for propagation.
          </li>
          <li>
            <strong>SSL issues?</strong> Ensure your domain is correctly pointed
            and verified. SSL certificates are issued automatically.
          </li>
          <li>
            <strong>Redirects not working?</strong> Make sure your{' '}
            <code>redirects.json</code> is valid and deployed.
          </li>
        </ul>
        <p>
          For more help, see the <a href="/docs/support">Support</a> page.
        </p>
      </section>
    </DocPage>
  );
}
