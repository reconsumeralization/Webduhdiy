'use client';

import DocPage from '../../../components/DocPage';
import CodeBlock from '../../../components/CodeBlock';

export default function NodeJsPage() {
  return (
    <DocPage
      title="Node.js Runtime"
      description="Run serverless functions using the Node.js runtime on webduh. Supports modern JavaScript, npm packages, and async/await."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Runtimes', href: '/docs/functions/runtimes' },
        { label: 'Node.js', href: '/docs/functions/runtimes/node-js' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            The <strong>Node.js runtime</strong> lets you write serverless
            functions in JavaScript or TypeScript, use npm packages, and
            leverage the full power of the Node.js ecosystem. Perfect for APIs,
            backend logic, and integrations.
          </p>
        </section>
        <section>
          <h3>Example: Hello World Function</h3>
          <CodeBlock language="javascript" filename="api/hello.js">
            {`// api/hello.js
export default function handler(req, res) {
  res.json({ message: "Hello from Node.js on webduh!" });
}`}
          </CodeBlock>
        </section>
        <section>
          <h3>Features</h3>
          <ul>
            <li>Supports Node.js 18.x and 20.x</li>
            <li>Full npm package support</li>
            <li>
              Native <code>async/await</code> and ES modules
            </li>
            <li>Environment variables and secrets</li>
            <li>Customizable memory and timeout</li>
          </ul>
        </section>
        <section>
          <h3>Configuring Node.js Functions</h3>
          <p>
            Use <code>webduh.json</code> to set runtime, memory, and environment
            variables for your Node.js functions.
          </p>
          <CodeBlock language="json" filename="webduh.json">
            {`{
  "functions": {
    "api/hello.js": {
      "runtime": "nodejs20.x",
      "memory": 256,
      "env": {
        "MY_SECRET": "@my-secret"
      }
    }
  }
}`}
          </CodeBlock>
        </section>
        <section>
          <h3>When to Use Node.js Runtime?</h3>
          <ul>
            <li>When you need npm packages or Node.js APIs</li>
            <li>For backend APIs, webhooks, and integrations</li>
            <li>When you want to use TypeScript or modern JavaScript</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
