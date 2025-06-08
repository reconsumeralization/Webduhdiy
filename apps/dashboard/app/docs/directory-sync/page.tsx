import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function DirectorySyncPage() {
  return (
    <DocPage
      title="Directory Sync"
      description="Learn how to connect and synchronize your organization's directory (such as Okta, Azure AD, or Google Workspace) to automate user and group management."
      breadcrumbs={[{ label: 'Directory Sync', href: '/docs/directory-sync' }]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What is Directory Sync?</h2>
        <p>
          Directory Sync allows you to connect your identity provider (IdP) to
          automatically provision, update, and deprovision users and groups in
          your application. This ensures your user base stays up-to-date and
          secure.
        </p>

        <h2>Supported Providers</h2>
        <ul>
          <li>Okta</li>
          <li>Azure Active Directory</li>
          <li>Google Workspace</li>
          <li>OneLogin</li>
        </ul>

        <h2>Getting Started</h2>
        <ol>
          <li>
            <strong>Navigate to Directory Sync:</strong> In your dashboard, go
            to <InlineCode>Directory Sync</InlineCode>.
          </li>
          <li>
            <strong>Select your provider:</strong> Choose your IdP from the list
            of supported providers.
          </li>
          <li>
            <strong>Follow the integration guide:</strong> Each provider has a
            step-by-step guide for connecting and authorizing directory sync.
          </li>
        </ol>

        <h2>Example: Connecting Okta</h2>
        <ol>
          <li>Log in to your Okta admin dashboard.</li>
          <li>
            Navigate to <InlineCode>Applications</InlineCode> &rarr;{' '}
            <InlineCode>Browse App Catalog</InlineCode>.
          </li>
          <li>
            Search for and add the <InlineCode>SCIM</InlineCode> integration.
          </li>
          <li>
            Copy the SCIM endpoint and bearer token from your dashboard and
            paste them into Okta's configuration.
          </li>
        </ol>
        <CodeBlock language="json">{`
{
  "scimEndpoint": "https://your-app.com/scim",
  "bearerToken": "YOUR_GENERATED_TOKEN"
}
        `}</CodeBlock>

        <h2>Troubleshooting</h2>
        <ul>
          <li>Ensure your IdP credentials and endpoints are correct.</li>
          <li>
            Check that your firewall allows outbound connections to the SCIM
            endpoint.
          </li>
          <li>Review sync logs in your dashboard for error details.</li>
        </ul>

        <h2>Learn More</h2>
        <p>For detailed guides, see:</p>
        <ul>
          <li>
            <a href="/docs/directory-sync/okta">Okta Directory Sync Guide</a>
          </li>
          <li>
            <a href="/docs/directory-sync/azure-ad">
              Azure AD Directory Sync Guide
            </a>
          </li>
          <li>
            <a href="/docs/directory-sync/google-workspace">
              Google Workspace Directory Sync Guide
            </a>
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
