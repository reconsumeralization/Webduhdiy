import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';

export default function ManagingDnsRecordsPage() {
  return (
    <DocPage
      title="Managing DNS Records"
      description="Learn how to add, edit, and remove DNS records for your custom domains. Understand record types and best practices for reliable domain configuration."
      breadcrumbs={[
        { label: 'Domains', href: '/docs/domains' },
        {
          label: 'Managing DNS Records',
          href: '/docs/domains/managing-dns-records',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What are DNS Records?</h2>
        <p>
          DNS records are instructions that tell the internet how to route
          traffic for your domain. Common record types include{' '}
          <InlineCode>A</InlineCode>, <InlineCode>CNAME</InlineCode>,{' '}
          <InlineCode>TXT</InlineCode>, and <InlineCode>MX</InlineCode>.
        </p>

        <h2>Adding a DNS Record</h2>
        <ol>
          <li>
            Go to the <b>Domains</b> section in your dashboard and select your
            domain.
          </li>
          <li>
            Click <b>Manage DNS</b> or <b>Add Record</b>.
          </li>
          <li>
            Choose the record type (<InlineCode>A</InlineCode>,{' '}
            <InlineCode>CNAME</InlineCode>, etc.).
          </li>
          <li>
            Enter the required details (e.g., <b>Name</b>, <b>Value</b>,{' '}
            <b>TTL</b>).
          </li>
          <li>
            Click <b>Save</b> to apply the changes.
          </li>
        </ol>
        <CodeBlock language="bash">{`# Example: Adding an A record
Type:   A
Name:   @
Value:  203.0.113.42
TTL:    3600`}</CodeBlock>

        <h2>Editing or Removing Records</h2>
        <ul>
          <li>
            To edit, locate the record in your DNS list, click <b>Edit</b>,
            update the fields, and save.
          </li>
          <li>
            To remove, click <b>Delete</b> next to the record you wish to
            remove.
          </li>
        </ul>

        <h2>Common Record Types</h2>
        <ul>
          <li>
            <b>A</b>: Points a domain to an IPv4 address.
          </li>
          <li>
            <b>CNAME</b>: Points a subdomain to another domain name.
          </li>
          <li>
            <b>TXT</b>: Stores text data, often for verification.
          </li>
          <li>
            <b>MX</b>: Directs email to mail servers.
          </li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Double-check values before saving changes.</li>
          <li>
            DNS changes may take time to propagate (usually up to 24 hours).
          </li>
          <li>Keep your DNS records organized and remove unused entries.</li>
        </ul>
      </section>
    </DocPage>
  );
}
