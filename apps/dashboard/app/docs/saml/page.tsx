// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
type Breadcrumb = { label: string; href: string };

type DocPageProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
};

function DocPage({ title, description, breadcrumbs, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        {breadcrumbs && (
          <ol className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((bc, i) => (
              <li key={bc.href}>
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
                {i < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
              </li>
            ))}
          </ol>
        )}
      </nav>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

type CodeBlockProps = {
  language?: string;
  filename?: string;
  children: React.ReactNode;
};

function CodeBlock({ language, filename, children }: CodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-t">
          {filename}
        </div>
      )}
      <pre
        className={`rounded-b ${language ? `language-${language}` : ''} bg-gray-900 text-gray-100 p-4 overflow-x-auto`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function SamlPage() {
  return (
    <DocPage
      title="SAML SSO"
      description="Learn how to configure and use SAML Single Sign-On (SSO) with webduh for secure, enterprise-grade authentication."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'SAML SSO', href: '/docs/saml' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>What is SAML SSO?</h2>
          <p>
            <strong>SAML SSO</strong> (Security Assertion Markup Language Single
            Sign-On) allows organizations to securely authenticate users through
            their identity provider (IdP), enabling seamless and centralized
            access to webduh.
          </p>
        </section>

        <section>
          <h2>Benefits</h2>
          <ul>
            <li>Centralized user management</li>
            <li>Improved security and compliance</li>
            <li>Frictionless login experience for your team</li>
            <li>
              Supports major IdPs (Okta, Azure AD, Google Workspace, etc.)
            </li>
          </ul>
        </section>

        <section>
          <h2>How to Set Up SAML SSO</h2>
          <ol>
            <li>
              <strong>Contact Support:</strong> SAML SSO is available on
              enterprise plans. Contact{' '}
              <a href="mailto:support@webduh.com">support@webduh.com</a> to
              enable SAML for your organization.
            </li>
            <li>
              <strong>Gather IdP Details:</strong> You will need your IdP’s{' '}
              <code>Entity ID</code>, <code>SSO URL</code>, and{' '}
              <code>X.509 Certificate</code>.
            </li>
            <li>
              <strong>Configure in webduh:</strong> Once enabled, go to{' '}
              <code>Organization Settings &gt; Authentication</code> and enter
              your IdP details.
            </li>
            <li>
              <strong>Test Connection:</strong> Use the <code>Test SSO</code>{' '}
              button to verify your configuration.
            </li>
            <li>
              <strong>Enforce SSO:</strong> Optionally, require all users to log
              in via SAML SSO.
            </li>
          </ol>
        </section>

        <section>
          <h2>Example SAML Configuration (Okta)</h2>
          <CodeBlock language="xml" filename="okta-metadata.xml">
            {`<EntityDescriptor entityID="https://www.okta.com/EXAMPLE" ...>
  <IDPSSODescriptor ...>
    <KeyDescriptor use="signing">
      <KeyInfo>
        <X509Data>
          <X509Certificate>MIID...EXAMPLE...QAB</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
    <SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      Location="https://dev-123456.okta.com/app/example/sso/saml"/>
  </IDPSSODescriptor>
</EntityDescriptor>`}
          </CodeBlock>
        </section>

        <section>
          <h2>Troubleshooting</h2>
          <ul>
            <li>Ensure your IdP metadata is up to date.</li>
            <li>Check for typos in Entity ID or SSO URL.</li>
            <li>Verify your certificate is valid and not expired.</li>
            <li>
              Contact <a href="mailto:support@webduh.com">support@webduh.com</a>{' '}
              for help.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
