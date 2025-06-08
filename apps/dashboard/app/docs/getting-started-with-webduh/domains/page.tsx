import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function AddDomainPage() {
  return (
    <DocPage
      title="Add a Domain"
      description="Connect your custom domain to your webduh project."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Add a Domain',
          href: '/docs/getting-started-with-webduh/domains',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Add a Custom Domain?</h2>
          <p>
            Using a custom domain makes your project look professional and
            easier to remember. Instead of the default{' '}
            <code>your-app.webduh.app</code>, you can use something like{' '}
            <code>yourbrand.com</code>.
          </p>
        </section>
        <section>
          <h3>Step 1: Register Your Domain</h3>
          <p>Purchase a domain from a registrar such as:</p>
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
            After adding your domain, you'll see DNS records to configure at
            your registrar. Typically, you'll add an <code>A</code> record or a{' '}
            <code>CNAME</code> record pointing to webduh. For example:
          </p>
          <CodeBlock
            language="text"
            children={`Type   Name      Value
A      @         76.76.21.21
CNAME  www       cname.webduh.app`}
            filename="DNS Records"
          />
          <p>
            <strong>Note:</strong> DNS changes can take up to 24 hours to
            propagate.
          </p>
        </section>
        <section>
          <h3>Step 4: Verify and Launch</h3>
          <p>
            Once DNS is set up, webduh will automatically issue an SSL
            certificate for your domain. Visit your domain in the browser to
            confirm it's working!
          </p>
        </section>
      </div>
    </DocPage>
  );
}
