import React from 'react';
import DocPage from '../../components/DocPage';

export default function MoreFrameworksPage() {
  return (
    <DocPage
      title="All Frameworks"
      description="Explore documentation and deployment guides for a wide range of frameworks supported by webduh. Find best practices, integration tips, and environment management for your favorite tools."
      breadcrumbs={[
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'More Frameworks', href: '/docs/frameworks/more-frameworks' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>Supported Frameworks</h2>
        <p>
          webduh supports a wide variety of modern web frameworks for seamless
          deployment, edge performance, and environment management. Whether you
          use a static site generator, a React-based framework, or something
          more niche, you’ll find guides and best practices here.
        </p>
        <ul>
          <li>
            <a href="/docs/frameworks/astro">Astro</a>
          </li>
          <li>
            <a href="/docs/frameworks/create-react-app">Create React App</a>
          </li>
          <li>
            <a href="/docs/frameworks/gatsby">Gatsby</a>
          </li>
          <li>
            <a href="/docs/frameworks/nextjs">Next.js</a>
          </li>
          <li>
            <a href="/docs/frameworks/nuxt">Nuxt</a>
          </li>
          <li>
            <a href="/docs/frameworks/remix">Remix</a>
          </li>
          <li>
            <a href="/docs/frameworks/sveltekit">SvelteKit</a>
          </li>
          <li>
            <a href="/docs/frameworks/vue">Vue</a>
          </li>
          <li>
            <a href="/docs/frameworks/solid">SolidJS</a>
          </li>
          <li>
            <a href="/docs/frameworks/qwik">Qwik</a>
          </li>
          <li>
            <a href="/docs/frameworks/eleventy">Eleventy (11ty)</a>
          </li>
          <li>
            <a href="/docs/frameworks/hugo">Hugo</a>
          </li>
          <li>
            <a href="/docs/frameworks/jekyll">Jekyll</a>
          </li>
          <li>
            <a href="/docs/frameworks/other">Other & Custom Frameworks</a>
          </li>
        </ul>
        <h2>Don’t see your framework?</h2>
        <p>
          webduh is framework-agnostic and can deploy any static or
          Node.js-based site. For custom setups, see the{' '}
          <a href="/docs/frameworks/other">Other & Custom Frameworks</a> guide.
        </p>
      </section>
    </DocPage>
  );
}
