'use client';

import DocPage from '../components/DocPage';

export default function FrameworksPage() {
  return (
    <DocPage
      title="Frameworks"
      description="Deploy your favorite frameworks on webduh with zero configuration."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Frameworks', href: '/docs/frameworks' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>webduh</strong> supports all major frontend frameworks out
            of the box, including React, Next.js, Vue, Svelte, Angular, and
            more. Enjoy seamless deployments with zero configuration—just push
            your code and go live in seconds.
          </p>
        </section>
        <section>
          <h3>Popular Frameworks</h3>
          <ul>
            <li>
              <a
                href="/docs/frameworks/react"
                className="text-primary-600 hover:underline"
              >
                React
              </a>
            </li>
            <li>
              <a
                href="/docs/frameworks/nextjs"
                className="text-primary-600 hover:underline"
              >
                Next.js
              </a>
            </li>
            <li>
              <a
                href="/docs/frameworks/vue"
                className="text-primary-600 hover:underline"
              >
                Vue
              </a>
            </li>
            <li>
              <a
                href="/docs/frameworks/svelte"
                className="text-primary-600 hover:underline"
              >
                Svelte
              </a>
            </li>
            <li>
              <a
                href="/docs/frameworks/angular"
                className="text-primary-600 hover:underline"
              >
                Angular
              </a>
            </li>
          </ul>
        </section>
        <section>
          <h3>Why Choose webduh?</h3>
          <ul>
            <li>Automatic framework detection and optimal build settings</li>
            <li>Instant global deployments</li>
            <li>Zero-config for most projects</li>
            <li>Custom domains, SSL, and edge caching included</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
