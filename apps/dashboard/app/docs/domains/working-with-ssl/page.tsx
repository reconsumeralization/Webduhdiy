'use client';

import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import ProgressIndicator from '../../components/ProgressIndicator';

export default function WorkingWithSslPage() {
  const sslSteps = [
    {
      id: 'overview',
      title: 'SSL Overview',
      href: '#ssl-overview',
      description: 'Understand SSL and its importance',
      status: 'completed' as const,
    },
    {
      id: 'auto-ssl',
      title: 'Automatic SSL',
      href: '#automatic-ssl',
      description: 'How webduh provisions SSL for your domains',
      status: 'current' as const,
    },
    {
      id: 'custom-cert',
      title: 'Custom Certificates',
      href: '#custom-certificates',
      description: 'Upload and manage your own SSL certificates',
      status: 'upcoming' as const,
    },
    {
      id: 'troubleshoot',
      title: 'Troubleshooting',
      href: '#troubleshooting',
      description: 'Resolve common SSL issues',
      status: 'upcoming' as const,
    },
  ];

  return (
    <DocPage
      title="Working with SSL"
      description="Secure your domains with SSL/TLS. Learn about automatic SSL provisioning, custom certificates, and troubleshooting."
    >
      <div className="space-y-8">
        {/* Quick start progress */}
        <ProgressIndicator steps={sslSteps} title="SSL Setup Guide" />

        {/* Overview */}
        <div>
          <h2 id="ssl-overview">SSL Overview</h2>
          <p>
            SSL (Secure Sockets Layer) and its successor TLS (Transport Layer
            Security) are protocols that encrypt data between your users and
            your site. All webduh domains are secured with SSL by default,
            ensuring privacy and trust for your visitors.
          </p>
        </div>

        {/* Automatic SSL */}
        <div>
          <h2 id="automatic-ssl">Automatic SSL</h2>
          <p>
            When you add a domain to webduh, we automatically provision and
            renew SSL certificates for you using trusted Certificate Authorities
            (CAs). No manual setup is required. Your site will always be served
            over HTTPS.
          </p>
          <CodeBlock language="bash" filename="No action required">
            {`# SSL is enabled automatically for all domains
https://yourdomain.com`}
          </CodeBlock>
        </div>

        {/* Custom Certificates */}
        <div>
          <h2 id="custom-certificates">Custom Certificates</h2>
          <p>
            If you need to use your own SSL certificate (for example, for EV or
            wildcard certificates), you can upload it in the domain settings.
            webduh will use your certificate instead of the default one.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Go to <InlineCode>Domains &gt; [Your Domain] &gt; SSL</InlineCode>{' '}
              in the dashboard.
            </li>
            <li>
              Click <InlineCode>Upload Certificate</InlineCode>.
            </li>
            <li>Paste your certificate and private key, then save.</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div>
          <h2 id="troubleshooting">Troubleshooting</h2>
          <p>If you encounter SSL errors, check the following:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>DNS is correctly pointed to webduh.</li>
            <li>Your custom certificate (if used) is valid and not expired.</li>
            <li>Propagation may take a few minutes after changes.</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div>
          <h2 id="next-steps">Next Steps</h2>
          <p>Explore more domain features:</p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: 'DNS Management',
                href: '/docs/domains/working-with-dns',
                description: 'Advanced DNS configuration and management',
              },
              {
                title: 'Edge Network',
                href: '/docs/edge-network',
                description: 'Global CDN and performance optimization',
              },
              {
                title: 'Analytics',
                href: '/docs/analytics',
                description: 'Track domain performance and usage',
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DocPage>
  );
}
