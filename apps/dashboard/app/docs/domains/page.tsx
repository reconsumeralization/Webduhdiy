'use client';

import DocPage from '../components/DocPage';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

export default function DomainsPage() {
  return (
    <DocPage
      title="Custom Domains"
      description="Configure custom domains for your webduh projects. Automatic SSL certificates, DNS management, and global CDN distribution."
    >
      <div className="space-y-8">
        <div>
          <h2 id="overview">Overview</h2>
          <p>
            webduh makes it easy to use custom domains for your projects. Every
            deployment gets automatic HTTPS, global CDN distribution, and
            enterprise-grade security. No complex configuration required.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔒 Automatic SSL
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Free SSL certificates that auto-renew. HTTPS enabled by default.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🌍 Global CDN
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your domain is served from 50+ edge locations worldwide.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ⚡ Edge Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sub-100ms response times with automatic caching and
                optimization.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 id="quick-setup">Quick Setup</h2>
          <p>Add a custom domain to your project in 3 simple steps:</p>

          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Add Domain
              </h3>
              <CodeBlock language="bash">
                {`webduh domains add example.com`}
              </CodeBlock>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Configure DNS
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Add a CNAME record pointing to your webduh deployment:
              </p>
              <CodeBlock language="text">
                {`Type: CNAME
Name: @ (or www)
Value: cname.webduh.app`}
              </CodeBlock>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Verify & Deploy
              </h3>
              <CodeBlock language="bash">
                {`webduh domains verify example.com`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 id="dns-configuration">DNS Configuration</h2>
          <p>Configure your domain's DNS records to point to webduh:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Value</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="p-3 font-mono">CNAME</td>
                  <td className="p-3 font-mono">www</td>
                  <td className="p-3 font-mono">cname.webduh.app</td>
                  <td className="p-3">www subdomain</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono">A</td>
                  <td className="p-3 font-mono">@</td>
                  <td className="p-3 font-mono">76.76.19.19</td>
                  <td className="p-3">Apex domain</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono">AAAA</td>
                  <td className="p-3 font-mono">@</td>
                  <td className="p-3 font-mono">2606:4700:10::ac43:1313</td>
                  <td className="p-3">IPv6 support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 id="ssl-certificates">SSL Certificates</h2>
          <p>
            webduh automatically provides and manages SSL certificates for all
            custom domains:
          </p>

          <ul>
            <li>
              <strong>Free certificates:</strong> No additional cost
            </li>
            <li>
              <strong>Auto-renewal:</strong> Certificates renew 30 days before
              expiration
            </li>
            <li>
              <strong>Wildcard support:</strong> *.example.com subdomains
              included
            </li>
            <li>
              <strong>Multiple domains:</strong> Single certificate for all
              project domains
            </li>
          </ul>

          <CodeBlock language="bash">
            {`# Check SSL certificate status
webduh ssl status example.com

# Force SSL certificate renewal
webduh ssl renew example.com

# List all SSL certificates
webduh ssl list`}
          </CodeBlock>
        </div>
      </div>
    </DocPage>
  );
}
