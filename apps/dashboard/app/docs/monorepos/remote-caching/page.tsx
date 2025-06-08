'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function RemoteCachingPage() {
  return (
    <DocPage
      title="Remote Caching"
      description="Speed up your monorepo builds with remote caching. Learn how to set up, configure, and troubleshoot remote cache for Turborepo, Nx, and more."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Monorepos', href: '/docs/monorepos' },
        { label: 'Remote Caching', href: '/docs/monorepos/remote-caching' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Remote caching</strong> allows you to share build and test
            outputs between your local machine and your CI/CD pipelines. This
            dramatically speeds up builds by reusing previously computed
            results, especially in monorepos with many packages or apps.
          </p>
          <p>
            Tools like <strong>Turborepo</strong> and <strong>Nx</strong>{' '}
            support remote caching out of the box. With webduh, you can easily
            enable and configure remote caching for your monorepo projects.
          </p>
        </section>

        <section>
          <h2 id="benefits">Benefits of Remote Caching</h2>
          <ul>
            <li>Faster CI/CD pipelines by avoiding redundant work</li>
            <li>Consistent build results across environments</li>
            <li>Reduced cloud compute costs</li>
            <li>Improved developer experience with faster local builds</li>
          </ul>
        </section>

        <section>
          <h2 id="setup">How to Enable Remote Caching</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Choose a remote cache provider:</strong> Popular options
              include{' '}
              <a
                href="https://turbo.build/repo/docs/core-concepts/remote-caching"
                target="_blank"
                rel="noopener noreferrer"
              >
                Turborepo Remote Cache
              </a>
              ,{' '}
              <a
                href="https://nx.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nx Cloud
              </a>
              , or self-hosted solutions.
            </li>
            <li>
              <strong>Configure your tool:</strong> Update your{' '}
              <code>turbo.json</code> or <code>nx.json</code> to point to your
              remote cache provider.
              <CodeBlock language="json" filename="turbo.json">{`{
  "pipeline": { /* ... */ },
  "remoteCache": {
    "enabled": true,
    "url": "https://your-remote-cache-provider.com/project"
  }
}`}</CodeBlock>
            </li>
            <li>
              <strong>Set up authentication:</strong> Most providers require an
              API key or token. Store secrets securely using environment
              variables.
            </li>
            <li>
              <strong>Verify caching:</strong> Run your build locally and in CI.
              You should see cache hits and misses in the output logs.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="troubleshooting">Troubleshooting</h2>
          <ul>
            <li>
              <strong>Cache misses?</strong> Ensure your cache provider URL and
              credentials are correct, and that your build steps are
              deterministic.
            </li>
            <li>
              <strong>Security:</strong> Never commit API keys or tokens to your
              repository. Use environment variables or a secrets manager.
            </li>
            <li>
              <strong>Debugging:</strong> Most tools provide verbose logging
              flags (e.g., <code>--verbose</code>) to help diagnose cache
              issues.
            </li>
          </ul>
        </section>

        <section>
          <h2 id="resources">Further Reading</h2>
          <ul>
            <li>
              <a
                href="https://turbo.build/repo/docs/core-concepts/remote-caching"
                target="_blank"
                rel="noopener noreferrer"
              >
                Turborepo Remote Caching Docs
              </a>
            </li>
            <li>
              <a
                href="https://nx.dev/using-nx/cloud/intro"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nx Cloud Documentation
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
