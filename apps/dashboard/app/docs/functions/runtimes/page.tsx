'use client';

import DocPage from '../../components/DocPage';
import Link from 'next/link';

export default function RuntimesPage() {
  return (
    <DocPage
      title="Runtimes"
      description="Explore the available runtimes for serverless functions on webduh. Choose the right environment for your code, whether it's JavaScript, Python, or ultra-fast edge execution."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Runtimes', href: '/docs/functions/runtimes' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Available Runtimes</h2>
          <ul>
            <li>
              <Link
                href="/docs/functions/runtimes/node-js"
                className="text-blue-600 hover:underline"
              >
                Node.js
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                Modern JavaScript & npm support
              </span>
            </li>
            <li>
              <Link
                href="/docs/functions/runtimes/python"
                className="text-blue-600 hover:underline"
              >
                Python
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                Python 3.10 & 3.11, pip packages
              </span>
            </li>
            <li>
              <Link
                href="/docs/functions/runtimes/edge"
                className="text-blue-600 hover:underline"
              >
                Edge
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                Ultra-low latency, global reach
              </span>
            </li>
          </ul>
        </section>
        <section>
          <h3>What is a Runtime?</h3>
          <p>
            A <strong>runtime</strong> is the environment in which your
            serverless function code executes. Each runtime provides different
            language support, features, and performance characteristics. Choose
            the runtime that best fits your use case.
          </p>
        </section>
        <section>
          <h3>Learn More</h3>
          <ul>
            <li>
              <Link
                href="/docs/functions/runtimes/node-js"
                className="text-blue-600 hover:underline"
              >
                Node.js Runtime Documentation
              </Link>
            </li>
            <li>
              <Link
                href="/docs/functions/runtimes/python"
                className="text-blue-600 hover:underline"
              >
                Python Runtime Documentation
              </Link>
            </li>
            <li>
              <Link
                href="/docs/functions/runtimes/edge"
                className="text-blue-600 hover:underline"
              >
                Edge Runtime Documentation
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
