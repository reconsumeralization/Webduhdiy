import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function StreamingFunctionsPage() {
  return (
    <DocPage
      title="Streaming Functions"
      description="Stream data from your serverless functions for real-time updates, large payloads, and efficient resource usage on webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Streaming', href: '/docs/functions/streaming-functions' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Streaming functions let you send data to clients as it becomes
            available, rather than waiting for the entire response to be ready.
            This is ideal for real-time updates, large files, or progressive
            rendering.
          </p>
        </section>

        <section>
          <h3>When to Use Streaming</h3>
          <ul>
            <li>Real-time dashboards and notifications</li>
            <li>Large file downloads or uploads</li>
            <li>Progressive rendering of HTML or data</li>
            <li>Server-Sent Events (SSE) and chat applications</li>
          </ul>
        </section>

        <section>
          <h3>Basic Streaming Example</h3>
          <p>
            Here’s how to stream a response from a function using the{' '}
            <code>ReadableStream</code> API:
          </p>
          <CodeBlock
            language="typescript"
            filename="functions/stream.ts"
          >{`// functions/stream.ts
export default async function handler(req, res) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(encoder.encode(\`Chunk \${i}\\n\`));
        await new Promise(r => setTimeout(r, 500));
      }
      controller.close();
    }
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain" }
  });
}
`}</CodeBlock>
          <p>
            This function streams five chunks to the client, one every 500ms.
          </p>
        </section>

        <section>
          <h3>Streaming with Server-Sent Events (SSE)</h3>
          <p>
            For real-time updates, you can use SSE by setting the appropriate
            headers and streaming events:
          </p>
          <CodeBlock
            language="typescript"
            filename="functions/sse.ts"
          >{`// functions/sse.ts
export default async function handler(req, res) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 3; i++) {
        controller.enqueue(encoder.encode(\`data: Message \${i}\\n\\n\`));
        await new Promise(r => setTimeout(r, 1000));
      }
      controller.close();
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
`}</CodeBlock>
          <p>
            The client can listen for these events using{' '}
            <code>EventSource</code> in the browser.
          </p>
        </section>

        <section>
          <h3>Best Practices</h3>
          <ul>
            <li>
              Always set appropriate <code>Content-Type</code> headers for your
              stream.
            </li>
            <li>Close the stream when finished to avoid resource leaks.</li>
            <li>Handle client disconnects gracefully.</li>
            <li>
              Test streaming endpoints with <code>curl</code> or browser dev
              tools.
            </li>
          </ul>
        </section>

        <section>
          <h3>Next Steps</h3>
          <ul>
            <li>
              <a href="/docs/functions/configuring-functions">
                Configuring Functions
              </a>
            </li>
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
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
