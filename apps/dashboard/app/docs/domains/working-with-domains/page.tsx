'use client';

import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import ProgressIndicator from '../../components/ProgressIndicator';

export default function WorkingWithDomainsPage() {
  const domainSteps = [
    {
      id: 'overview',
      title: 'Domain Overview',
      href: '#domain-overview',
      description: 'Understand what domains are and how they work',
      status: 'completed' as const,
    },
    {
      id: 'add-domain',
      title: 'Add a Domain',
      href: '#add-domain',
      description: 'Connect your custom domain to webduh',
      status: 'current' as const,
    },
    {
      id: 'dns-setup',
      title: 'DNS Setup',
      href: '#dns-setup',
      description: 'Configure DNS records for your domain',
      status: 'upcoming' as const,
    },
    {
      id: 'troubleshoot',
      title: 'Troubleshooting',
      href: '#troubleshooting',
      description: 'Resolve common domain issues',
      status: 'upcoming' as const,
    },
  ];

  return (
    <DocPage
      title="Working with Domains"
      description="Connect, configure, and manage your custom domains on webduh. Learn about DNS, SSL, and troubleshooting."
    >
      <div className="space-y-8">
        {/* Quick start progress */}
        <ProgressIndicator steps={domainSteps} title="Domain Setup Guide" />

        {/* Overview */}
        <div>
          <h2 id="domain-overview" className="text-xl font-semibold mb-2">
            Domain Overview
          </h2>
          <p>
            Domains are unique names that identify your website on the internet.
            With webduh, you can connect your own custom domains to your
            projects for a professional presence.
          </p>
        </div>

        {/* Add a Domain */}
        <div>
          <h2 id="add-domain" className="text-xl font-semibold mb-2 mt-8">
            Add a Domain
          </h2>
          <p>
            To add a domain, navigate to the <InlineCode>Domains</InlineCode>{' '}
            section in your dashboard and click{' '}
            <InlineCode>Add Domain</InlineCode>. Enter your domain name and
            follow the prompts.
          </p>
          <CodeBlock language="bash">{`webduh domains add yourdomain.com`}</CodeBlock>
        </div>

        {/* DNS Setup */}
        <div>
          <h2 id="dns-setup" className="text-xl font-semibold mb-2 mt-8">
            DNS Setup
          </h2>
          <p>
            After adding your domain, you’ll need to update your DNS records.
            Point your domain’s <InlineCode>A</InlineCode> or{' '}
            <InlineCode>CNAME</InlineCode> record to the values provided by
            webduh.
          </p>
          <CodeBlock language="bash">{`# Example A record
yourdomain.com    A    76.76.21.21

# Example CNAME record
www.yourdomain.com    CNAME    cname.webduh.com`}</CodeBlock>
        </div>

        {/* Troubleshooting */}
        <div>
          <h2 id="troubleshooting" className="text-xl font-semibold mb-2 mt-8">
            Troubleshooting
          </h2>
          <p>
            If your domain isn’t working as expected, double-check your DNS
            settings and propagation status. For more help, see the{' '}
            <a
              href="/docs/domains/working-with-dns"
              className="text-blue-600 underline"
            >
              DNS documentation
            </a>{' '}
            or contact support.
          </p>
        </div>
      </div>
    </DocPage>
  );
}
