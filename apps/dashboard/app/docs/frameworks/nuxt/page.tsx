import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function NuxtPage() {
  return (
    <DocPage
      title="Nuxt"
      description="Deploy Nuxt.js applications with Vue.js SSR support. Learn how to integrate Nuxt for seamless deployments, edge performance, and environment management."
      breadcrumbs={[
        { label: 'Frameworks', href: '/docs/frameworks' },
        { label: 'Nuxt', href: '/docs/frameworks/nuxt' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>Why Nuxt?</h2>
        <p>
          Nuxt is a powerful Vue.js framework for building server-rendered,
          statically generated, and hybrid web applications. It offers automatic
          routing, server-side rendering (SSR), and a rich plugin ecosystem.
        </p>

        <h2>Quick Start</h2>
        <ol>
          <li>
            <strong>Initialize your Nuxt project:</strong>
            <CodeBlock language="bash">{`npx nuxi init my-nuxt-app && cd my-nuxt-app && npm install`}</CodeBlock>
          </li>
          <li>
            <strong>Deploy with webduh:</strong>
            <CodeBlock language="bash">{`webduh deploy`}</CodeBlock>
          </li>
        </ol>

        <h2>webduh Integration</h2>
        <ul>
          <li>
            <strong>Automatic SSR and static optimization</strong> for fast,
            global delivery.
          </li>
          <li>
            <strong>Edge caching</strong> and <strong>zero-config CDN</strong>.
          </li>
          <li>
            <strong>Environment variable support</strong> for build-time and
            runtime configuration.
          </li>
        </ul>

        <h2>Example: Using Environment Variables</h2>
        <CodeBlock
          language="env"
          filename=".env"
        >{`NUXT_PUBLIC_API_URL=https://api.example.com`}</CodeBlock>
        <CodeBlock language="js" filename="nuxt.config.ts">{`// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL
    }
  }
})
`}</CodeBlock>
        <CodeBlock language="vue" filename="pages/index.vue">{`<template>
  <div>API URL: {{ apiUrl }}</div>
</template>

<script setup>
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
</script>
`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>NUXT_PUBLIC_*</code> prefix for variables you want
            available in the browser.
          </li>
          <li>Keep secrets and private keys out of client-side code.</li>
        </ul>
      </section>
    </DocPage>
  );
}
