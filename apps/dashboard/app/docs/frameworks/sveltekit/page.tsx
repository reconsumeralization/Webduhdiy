'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function SvelteKitPage() {
  return (
    <DocPage
      title="SvelteKit"
      description="Deploy SvelteKit applications with full SSR support"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'SvelteKit', href: '/docs/frameworks/sveltekit' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>SvelteKit</strong> is a modern framework for building web
            applications with Svelte, offering server-side rendering (SSR),
            static site generation, and seamless routing. Deploy your SvelteKit
            apps on <strong>webduh</strong> for instant, zero-config global
            hosting with full SSR support.
          </p>
        </section>
        <section>
          <h3>Getting Started</h3>
          <ol>
            <li>
              <strong>Create a SvelteKit App:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npm create svelte@latest my-sveltekit-app
cd my-sveltekit-app
npm install`}
              </CodeBlock>
            </li>
            <li>
              <strong>Deploy with webduh:</strong>
              <CodeBlock language="bash" filename="Terminal">
                {`npm install -g @webduh/cli
webduh --prod`}
              </CodeBlock>
            </li>
          </ol>
        </section>
        <section>
          <h3>Automatic Configuration</h3>
          <ul>
            <li>
              webduh auto-detects SvelteKit projects and configures SSR and
              static assets automatically.
            </li>
            <li>
              No need to manually set build or output directories—just deploy!
            </li>
          </ul>
        </section>
        <section>
          <h3>Custom Domains & Edge Caching</h3>
          <ul>
            <li>Connect your own domain for a branded experience.</li>
            <li>
              Enjoy instant global edge caching for fast performance worldwide.
            </li>
          </ul>
        </section>
        <section>
          <h3>Next Steps</h3>
          <ul>
            <li>
              <a href="/docs/frameworks">Back to Frameworks Overview</a>
            </li>
            <li>
              <a
                href="https://kit.svelte.dev/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                SvelteKit Documentation
              </a>
            </li>
            <li>
              <a href="/docs/functions">Learn about Serverless Functions</a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
