import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function UseExistingPage() {
  return (
    <DocPage
      title="Transfer an Existing Domain"
      description="Learn how to transfer your existing domain to webduh and manage it seamlessly."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Use Existing Domain',
          href: '/docs/getting-started-with-webduh/use-existing',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Transfer Your Domain?</h2>
          <p>
            Transferring your existing domain to webduh allows you to manage
            your DNS, SSL, and domain settings all in one place. Enjoy automatic
            SSL, instant DNS changes, and seamless integration with your webduh
            projects.
          </p>
        </section>
        <section>
          <h3>Step 1: Prepare Your Domain for Transfer</h3>
          <ul>
            <li>Unlock your domain at your current registrar.</li>
            <li>
              Obtain the domain’s <strong>authorization code</strong> (also
              called EPP code).
            </li>
            <li>
              Ensure your domain is eligible for transfer (registered for at
              least 60 days, not recently transferred).
            </li>
          </ul>
        </section>
        <section>
          <h3>Step 2: Start the Transfer in webduh</h3>
          <ol>
            <li>
              Go to the <strong>webduh Dashboard</strong> and navigate to{' '}
              <strong>Domains</strong>.
            </li>
            <li>
              Click <strong>Transfer Domain</strong> and enter your domain name.
            </li>
            <li>Enter the authorization code when prompted.</li>
          </ol>
        </section>
        <section>
          <h3>Step 3: Approve and Complete the Transfer</h3>
          <ul>
            <li>
              Check your email for a confirmation link from your current
              registrar and approve the transfer.
            </li>
            <li>
              The transfer process may take a few hours to a few days, depending
              on your registrar.
            </li>
            <li>
              Once complete, your domain will appear in your webduh dashboard.
            </li>
          </ul>
        </section>
        <section>
          <h3>Step 4: Update DNS and Connect to Your Project</h3>
          <ol>
            <li>After the transfer, manage DNS records directly in webduh.</li>
            <li>
              Connect your domain to a webduh project for instant deployment and
              SSL.
            </li>
          </ol>
          <CodeBlock
            language="bash"
            filename="Connect Domain Example"
            showLineNumbers={false}
          >{`# In your webduh dashboard:
# 1. Go to your project settings
# 2. Click "Add Domain"
# 3. Enter your transferred domain
# 4. webduh will automatically configure DNS and SSL
`}</CodeBlock>
        </section>
        <section>
          <h3>Troubleshooting</h3>
          <ul>
            <li>
              If your transfer is delayed, check for emails from your current
              registrar and approve any pending requests.
            </li>
            <li>
              Ensure your domain is unlocked and the authorization code is
              correct.
            </li>
            <li>Contact webduh support if you encounter issues.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
