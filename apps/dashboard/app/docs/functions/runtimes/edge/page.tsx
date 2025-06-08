'use client';

import DocPage from '../../../components/DocPage';
import CodeBlock from '../../../components/CodeBlock';

export default function EdgePage() {
  return (
    <DocPage
      title="Edge Runtime"
      description="Run serverless functions at the edge for ultra-low latency and global reach."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Runtimes', href: '/docs/functions/runtimes' },
        { label: 'Edge', href: '/docs/functions/runtimes/edge' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">
        <section>
          <h2>What is the Edge Runtime?</h2>
          <p>
            The <strong>Edge Runtime</strong> enables your serverless functions
            to execute as close as possible to your users, reducing latency and
            improving performance. Functions deployed to the edge run in
            globally distributed locations, enabling near-instant responses
            worldwide.
          </p>
          <p>
            Edge functions are ideal for use cases that demand speed,
            personalization, and real-time data—such as authentication, A/B
            testing, and geo-aware APIs.
          </p>
        </section>

        <section>
          <h3>Key Benefits</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Ultra-low latency</strong> for users anywhere in the world
            </li>
            <li>
              <strong>Automatic scaling</strong> and high availability
            </li>
            <li>
              <strong>Secure, isolated execution environments</strong>
            </li>
            <li>
              Great for <strong>authentication</strong>,{' '}
              <strong>personalization</strong>, and{' '}
              <strong>real-time APIs</strong>
            </li>
            <li>
              Runs on a <strong>global edge network</strong>—no server
              management required
            </li>
          </ul>
        </section>

        <section>
          <h3>Example: Edge Function</h3>
          <p>
            Here’s a minimal example of an edge function. Note that edge
            functions use the <code>Request</code> and <code>Response</code> Web
            APIs for maximum compatibility and performance.
          </p>
          <CodeBlock language="javascript" filename="api/edge-hello.js">
            {`// api/edge-hello.js
export default function handler(req) {
  return new Response(
    JSON.stringify({ message: "Hello from the edge!" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
`}
          </CodeBlock>
        </section>

        <section>
          <h3>How to Deploy to the Edge</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>
                Place your function in the <code>api/</code> directory.
              </strong>
              <br />
              For example: <code>api/edge-hello.js</code>
            </li>
            <li>
              <strong>
                Specify the <code>runtime</code> as <code>"edge"</code> in your{' '}
                <code>webduh.json</code>:
              </strong>
              <CodeBlock language="json" filename="webduh.json">
                {`{
  "functions": {
    "api/edge-hello.js": {
      "runtime": "edge"
    }
  }
}
`}
              </CodeBlock>
            </li>
            <li>
              <strong>Deploy your project:</strong>
              <CodeBlock language="bash" filename="Deploy">
                {`webduh deploy`}
              </CodeBlock>
              Your function will run at the edge automatically after deployment.
            </li>
          </ol>
        </section>

        <section>
          <h3>Best Use Cases for Edge Functions</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personalized content</strong> and A/B testing
            </li>
            <li>
              <strong>Authentication</strong> and authorization
            </li>
            <li>
              <strong>Geo-aware APIs</strong> (e.g., serve content based on user
              location)
            </li>
            <li>
              <strong>Real-time data processing</strong> (e.g., chat, analytics,
              streaming)
            </li>
            <li>Request/response rewriting and advanced routing</li>
          </ul>
        </section>

        <section>
          <h3>Limitations & Considerations</h3>
          <ul className="list-disc pl-6">
            <li>
              Edge functions have <strong>limited execution time</strong>{' '}
              (typically &lt;1s)
            </li>
            <li>No access to local filesystem or native Node.js APIs</li>
            <li>
              Use <code>fetch</code> and Web APIs for networking and data access
            </li>
            <li>
              For heavy computation or long-running tasks, use standard
              serverless functions
            </li>
          </ul>
        </section>

        <section>
          <h3>Learn More</h3>
          <ul className="list-disc pl-6">
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Response"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDN: Response API
              </a>
            </li>
            <li>
              <a href="/docs/functions" className="text-blue-600 underline">
                Webduh Functions Documentation
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
