import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function FrameworkEnvironmentVariablesPage() {
  return (
    <DocPage
      title="Framework Environment Variables"
      description="Understand how to use environment variables provided by your framework (like Next.js) in your webduh project. Learn about their purpose, security, and best practices."
      breadcrumbs={[
        { label: 'Environment Variables', href: '/docs/environment-variables' },
        {
          label: 'Framework Environment Variables',
          href: '/docs/environment-variables/framework-environment-variables',
        },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none space-y-6">
        <h2>What Are Framework Environment Variables?</h2>
        <p>
          Framework environment variables are special variables that your
          framework (such as Next.js) recognizes and injects into your
          application at build or runtime. They are commonly used to store
          secrets, API keys, and configuration values.
        </p>

        <h2>Next.js Environment Variable Conventions</h2>
        <ul>
          <li>
            <code>NEXT_PUBLIC_*</code>: Exposed to the browser. Use for
            non-sensitive values you want available on the client.
          </li>
          <li>
            <code>process.env.*</code>: Only available on the server by default.
            Use for secrets and sensitive data.
          </li>
        </ul>

        <h2>Example Usage</h2>
        <CodeBlock language="env" filename=".env.local">{`# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_API_KEY=supersecretkey
`}</CodeBlock>
        <CodeBlock
          language="javascript"
          filename="pages/index.js"
        >{`// Accessing environment variables in Next.js
export default function Home() {
  // This will be replaced at build time
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // This will only be available on the server
  const secretKey = process.env.SECRET_API_KEY

  return <div>API URL: {apiUrl}</div>
}
`}</CodeBlock>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Never expose secrets to the client—only use{' '}
            <code>NEXT_PUBLIC_*</code> for safe, public values.
          </li>
          <li>
            Store sensitive values in <code>.env.local</code> and never commit
            them to version control.
          </li>
          <li>Restart your dev server after changing environment variables.</li>
        </ul>

        <h2>webduh Deployment</h2>
        <p>
          When deploying to webduh, set your environment variables in the
          dashboard or CLI. They will be injected securely at build and runtime.
        </p>
      </section>
    </DocPage>
  );
}
