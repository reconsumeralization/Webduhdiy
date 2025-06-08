import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function FunctionsQuickstartPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Create your first serverless function on Webduh"
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Quickstart: Deploy Your First Function</h2>
        <p>
          Serverless functions let you run backend code without managing
          infrastructure. With Webduh, you can deploy functions in seconds.
        </p>
        <h3>1. Create a Function File</h3>
        <p>
          Add a file to your <code>/functions</code> directory. For example,{' '}
          <code>hello.ts</code>:
        </p>
        <CodeBlock language="typescript" filename="functions/hello.ts">
          {`// functions/hello.ts
export default async function handler(req, res) {
  return Response.json({ message: "Hello from Webduh Functions!" });
}
`}
        </CodeBlock>
        <h3>2. Deploy Your Function</h3>
        <p>Use the Webduh CLI to deploy:</p>
        <CodeBlock language="bash" filename="Deploy">
          {`npm install -g @webduh/cli
webduh --prod`}
        </CodeBlock>
        <h3>3. Invoke Your Function</h3>
        <p>After deployment, access your function at:</p>
        <CodeBlock language="bash" filename="Invoke">
          {`https://<your-app>.webduh.app/api/hello`}
        </CodeBlock>
        <p>
          That’s it! You’ve deployed your first serverless function on Webduh.
        </p>
      </div>
    </DocPage>
  );
}
