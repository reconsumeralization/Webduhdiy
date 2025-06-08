'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function ConfiguringFunctionsPage() {
  return (
    <DocPage
      title="Configuring Functions"
      description="Configure serverless functions for custom logic, API endpoints, and advanced workflows on webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Configuring', href: '/docs/functions/configuring-functions' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Serverless functions on <strong>webduh</strong> let you run backend
            code without managing infrastructure. You can configure routes,
            environment variables, memory, and more for each function.
          </p>
        </section>

        <section>
          <h3>Basic Function Configuration</h3>
          <p>
            Place your functions in the <code>api/</code> directory of your
            project. Each file becomes an endpoint.
          </p>
          <CodeBlock language="javascript" filename="api/hello.js">
            {`// api/hello.js
export default function handler(req, res) {
  res.json({ message: "Hello from webduh!" });
}`}
          </CodeBlock>
        </section>

        <section>
          <h3>Customizing Function Settings</h3>
          <p>
            Use a <code>webduh.json</code> file to set memory, timeout, and
            environment variables for your functions:
          </p>
          <CodeBlock language="json" filename="webduh.json">
            {`{
  "functions": {
    "api/hello.js": {
      "memory": 512,
      "timeout": 10,
      "env": {
        "MY_SECRET": "@my-secret"
      }
    }
  }
}`}
          </CodeBlock>
        </section>

        <section>
          <h3>Environment Variables</h3>
          <p>
            Securely reference secrets and environment variables in your
            function configuration. Use the <code>@</code> prefix to pull from
            your project’s secret store.
          </p>
        </section>

        <section>
          <h3>Advanced Routing</h3>
          <p>
            Functions can be mapped to custom routes using the{' '}
            <code>routes</code> property in <code>webduh.json</code>:
          </p>
          <CodeBlock language="json" filename="webduh.json">
            {`{
  "routes": [
    { "src": "/api/hello", "dest": "api/hello.js" }
  ]
}`}
          </CodeBlock>
        </section>

        <section>
          <h3>Next Steps</h3>
          <ul>
            <li>
              <a href="/docs/functions/deploying-functions">
                Deploying Functions
              </a>
            </li>
            <li>
              <a href="/docs/functions/environment-variables">
                Managing Environment Variables
              </a>
            </li>
            <li>
              <a href="/docs/functions/troubleshooting">
                Troubleshooting Functions
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
