'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import ProgressIndicator from '../components/ProgressIndicator';

export default function BuildsPage() {
  const steps = [
    {
      id: '1',
      title: 'Build Process',
      status: 'current' as const,
      href: '#build-process',
    },
    {
      id: '2',
      title: 'Configuration',
      status: 'upcoming' as const,
      href: '#configuration',
    },
    {
      id: '3',
      title: 'Build Cache',
      status: 'upcoming' as const,
      href: '#build-cache',
    },
    {
      id: '4',
      title: 'Custom Builds',
      status: 'upcoming' as const,
      href: '#custom-builds',
    },
    {
      id: '5',
      title: 'Optimization',
      status: 'upcoming' as const,
      href: '#optimization',
    },
  ];

  return (
    <DocPage
      title="Build Configuration"
      description="Learn how to configure, optimize, and customize your build process in webduh for faster, more reliable deployments."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Builds', href: '/docs/builds' },
      ]}
    >
      <ProgressIndicator steps={steps} />

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Build Process Overview</h2>
        <p>
          Webduh streamlines your CI/CD workflow by automatically detecting your
          framework and applying optimal build settings. Each build runs in a
          secure, isolated environment with up-to-date tools and dependencies,
          ensuring consistency and reliability.
        </p>

        <h3>Supported Frameworks</h3>
        <ul>
          <li>
            <strong>Next.js</strong> &mdash; Full-stack React with SSR/SSG
          </li>
          <li>
            <strong>React</strong> &mdash; Create React App, Vite
          </li>
          <li>
            <strong>Vue.js</strong> &mdash; Vue 3, Vite, Nuxt.js
          </li>
          <li>
            <strong>Svelte</strong> &mdash; SvelteKit, Svelte
          </li>
          <li>
            <strong>Angular</strong> &mdash; Angular CLI
          </li>
          <li>
            <strong>Static Sites</strong> &mdash; HTML, CSS, JavaScript
          </li>
        </ul>

        <h2>Build Configuration</h2>
        <p>
          Customize your build process by adding a <code>webduh.json</code> file
          to your project root. This file lets you define build commands,
          environment variables, routes, and more.
        </p>
        <CodeBlock
          language="json"
          children={`{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@webduh/node@latest",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api-url"
    }
  }
}`}
          filename="webduh.json"
        />

        <h3>Automatic Framework Detection</h3>
        <p>
          Webduh inspects your project structure to auto-detect the framework
          and recommended build settings:
        </p>
        <CodeBlock
          language="json"
          children={`{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}`}
          filename="Auto-detected settings"
        />

        <h2>Build Cache</h2>
        <p>
          To accelerate builds, webduh caches dependencies and build outputs
          between runs. This reduces build times and resource usage, especially
          for large projects.
        </p>

        <h3>Cached Directories</h3>
        <ul>
          <li>
            <code>node_modules</code> &mdash; NPM dependencies
          </li>
          <li>
            <code>.next/cache</code> &mdash; Next.js build cache
          </li>
          <li>
            <code>dist</code> &mdash; Build output
          </li>
          <li>
            <code>.cache</code> &mdash; Framework-specific cache
          </li>
        </ul>

        <h2>Environment Variables</h2>
        <p>
          Define environment variables for both build-time and runtime. Use the
          dashboard or <code>webduh.json</code> to manage secrets and
          configuration.
        </p>
        <CodeBlock
          language="bash"
          children={`# Build-time environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
ANALYZE=true
NODE_ENV=production

# Runtime environment variables (serverless functions)
DATABASE_URL=postgresql://...
API_SECRET=your-secret-key`}
          filename="Environment variables"
        />

        <h2>Build Optimization</h2>
        <h3>Bundle Analysis</h3>
        <p>
          Monitor and optimize your bundle size to improve performance. Add an
          analyze script to your <code>package.json</code>:
        </p>
        <CodeBlock
          language="json"
          children={`{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}`}
          filename="Bundle analysis"
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>
              Use <code>.webduhignore</code>:
            </strong>{' '}
            Exclude unnecessary files from builds for faster deployments.
          </li>
          <li>
            <strong>Optimize images:</strong> Use <code>next/image</code> or
            similar tools for efficient image delivery.
          </li>
          <li>
            <strong>Enable compression:</strong> Gzip and Brotli are enabled by
            default for smaller assets.
          </li>
          <li>
            <strong>Monitor bundle size:</strong> Set up bundle analysis in your
            CI/CD pipeline.
          </li>
          <li>
            <strong>Leverage build cache:</strong> Keep caching enabled for
            optimal performance.
          </li>
        </ul>
      </div>
    </DocPage>
  );
}
