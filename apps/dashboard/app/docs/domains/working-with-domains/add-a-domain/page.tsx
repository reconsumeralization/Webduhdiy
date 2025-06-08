import React from 'react';
import DocPage from '../../../components/DocPage';

export default function AddADomainPage() {
  return (
    <DocPage
      title="Adding a Domain"
      description="Learn how to add a custom domain to your project, verify ownership, and configure DNS for seamless deployment."
      breadcrumbs={[
        { label: 'Domains', href: '/docs/domains' },
        {
          label: 'Working with Domains',
          href: '/docs/domains/working-with-domains',
        },
        {
          label: 'Add a Domain',
          href: '/docs/domains/working-with-domains/add-a-domain',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>Step 1: Open the Domains Dashboard</h2>
        <p>
          Navigate to the <b>Domains</b> section in your project dashboard.
          Click <b>Add Domain</b> to begin the process.
        </p>

        <h2>Step 2: Enter Your Domain Name</h2>
        <p>
          Enter the domain you want to add (e.g., <code>yourdomain.com</code>).
          You can add both root domains and subdomains.
        </p>

        <h2>Step 3: Verify Domain Ownership</h2>
        <p>
          To verify ownership, you'll be provided with a unique DNS record
          (usually a <code>TXT</code> record). Add this record to your domain's
          DNS settings with your registrar.
        </p>
        <ul>
          <li>
            Log in to your domain registrar (e.g., Namecheap, GoDaddy,
            Cloudflare).
          </li>
          <li>Find the DNS management section.</li>
          <li>
            Add the provided <code>TXT</code> record.
          </li>
        </ul>
        <p>
          Once added, click <b>Verify</b> in the dashboard. Verification may
          take a few minutes to propagate.
        </p>

        <h2>Step 4: Configure DNS for Deployment</h2>
        <p>
          After verification, you'll receive instructions to point your domain
          to our platform. Typically, this involves adding an <code>A</code>{' '}
          record or <code>CNAME</code> record:
        </p>
        <ul>
          <li>
            <b>Root domain</b> (<code>yourdomain.com</code>): Add an{' '}
            <code>A</code> record pointing to our IP address.
          </li>
          <li>
            <b>Subdomain</b> (<code>www.yourdomain.com</code>): Add a{' '}
            <code>CNAME</code> record pointing to the provided target.
          </li>
        </ul>
        <p>
          DNS changes may take up to 24 hours to propagate, but are often much
          faster.
        </p>

        <h2>Step 5: SSL & Automatic Configuration</h2>
        <p>
          Once DNS is set up, SSL certificates will be issued automatically.
          Your domain will be served securely over HTTPS.
        </p>

        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <b>DNS not propagating?</b> Use tools like{' '}
            <a
              href="https://dnschecker.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              dnschecker.org
            </a>{' '}
            to check your records.
          </li>
          <li>
            <b>Verification failed?</b> Double-check the <code>TXT</code> record
            and ensure there are no typos or extra spaces.
          </li>
          <li>
            <b>Need help?</b> Contact support or visit our{' '}
            <a href="/docs/support">Support Docs</a>.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
