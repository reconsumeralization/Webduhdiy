import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function BuyDomainPage() {
  return (
    <DocPage
      title="Buy a Domain"
      description="Learn how to purchase and connect a custom domain to your webduh project."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Buy a Domain',
          href: '/docs/getting-started-with-webduh/buy-domain',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Use a Custom Domain?</h2>
          <p>
            A custom domain makes your project look professional and easier to
            remember. Instead of using the default{' '}
            <code>your-app.webduh.app</code> address, you can use something like{' '}
            <code>yourbrand.com</code>.
          </p>
        </section>
        <section>
          <h3>Step 1: Choose and Purchase a Domain</h3>
          <p>You can buy a domain from any domain registrar, such as:</p>
          <ul>
            <li>
              <a
                href="https://namecheap.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Namecheap
              </a>
            </li>
            <li>
              <a
                href="https://domains.google"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Domains
              </a>
            </li>
            <li>
              <a
                href="https://godaddy.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GoDaddy
              </a>
            </li>
            <li>
              <a
                href="https://porkbun.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Porkbun
              </a>
            </li>
          </ul>
          <p>
            Search for your desired domain name, add it to your cart, and
            complete the purchase.
          </p>
        </section>
        <section>
          <h3>Step 2: Add Your Domain in webduh Dashboard</h3>
          <ol>
            <li>
              Go to your project in the <strong>webduh Dashboard</strong>.
            </li>
            <li>
              Navigate to <strong>Settings &rarr; Domains</strong>.
            </li>
            <li>
              Click <strong>Add Domain</strong> and enter your purchased domain
              (e.g., <code>yourbrand.com</code>).
            </li>
          </ol>
        </section>
        <section>
          <h3>Step 3: Update DNS Records</h3>
          <p>
            After adding your domain, webduh will show you the DNS records to
            add at your registrar. Typically, you’ll need to add an{' '}
            <code>A</code> record or a <code>CNAME</code> record.
          </p>
          <CodeBlock language="text" filename="DNS Example">
            {`Type: CNAME
Host: www
Value: cname.webduh.app`}
          </CodeBlock>
          <p>
            Follow the instructions in the dashboard for your specific setup.
            DNS changes may take a few minutes to propagate.
          </p>
        </section>
        <section>
          <h3>Step 4: Verify and Go Live</h3>
          <p>
            Once DNS is set up, return to the webduh dashboard and click{' '}
            <strong>Verify</strong>. When verification succeeds, your site will
            be live on your custom domain!
          </p>
        </section>
        <section>
          <h3>Need Help?</h3>
          <p>
            If you run into issues, check the{' '}
            <a href="/docs/domains/troubleshooting">
              domain troubleshooting guide
            </a>{' '}
            or contact support.
          </p>
        </section>
      </div>
    </DocPage>
  );
}
