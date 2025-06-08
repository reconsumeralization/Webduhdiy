'use client';

import DocPage from '../../../components/DocPage';
import CodeBlock from '../../../components/CodeBlock';

export default function PythonPage() {
  return (
    <DocPage
      title="Python Runtime"
      description="Run serverless functions using Python on webduh. Supports modern Python, pip packages, async/await, and seamless deployment."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Functions', href: '/docs/functions' },
        { label: 'Runtimes', href: '/docs/functions/runtimes' },
        { label: 'Python', href: '/docs/functions/runtimes/python' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">
        <section>
          <h2>Overview</h2>
          <p>
            The <strong>Python runtime</strong> lets you write serverless
            functions in Python, use pip packages, and leverage the power of the
            Python ecosystem. Perfect for APIs, data processing, automation, and
            integrations.
          </p>
          <p>
            Python functions on webduh are stateless, scalable, and deploy
            globally in seconds. You can use any pure-Python library, and most
            popular data science, web, and utility packages.
          </p>
        </section>
        <section>
          <h3>Example: Hello World Function</h3>
          <p>
            Here’s a minimal Python function. The <code>handler</code> receives
            a <code>request</code> object and returns a dictionary
            (automatically serialized to JSON).
          </p>
          <CodeBlock language="python" filename="api/hello.py">{`# api/hello.py
def handler(request):
    return { "message": "Hello from Python on webduh!" }
`}</CodeBlock>
        </section>
        <section>
          <h3>Features</h3>
          <ul className="list-disc pl-6">
            <li>
              Supports <strong>Python 3.10</strong> and <strong>3.11</strong>
            </li>
            <li>
              Full pip package support (<code>requirements.txt</code>)
            </li>
            <li>
              Native <code>async</code> and <code>await</code> support
            </li>
            <li>
              Access to <strong>environment variables</strong> and{' '}
              <strong>secrets</strong>
            </li>
            <li>
              Customizable <strong>memory</strong> and <strong>timeout</strong>{' '}
              per function
            </li>
            <li>Automatic JSON serialization of responses</li>
            <li>Stateless, horizontally scalable, and globally distributed</li>
          </ul>
        </section>
        <section>
          <h3>Advanced Example: Using Dependencies & Async</h3>
          <p>
            You can use third-party packages and async functions. Just add a{' '}
            <code>requirements.txt</code> and use <code>async def</code> if
            needed.
          </p>
          <CodeBlock
            language="python"
            filename="api/async-hello.py"
          >{`# api/async-hello.py
import httpx

async def handler(request):
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.github.com")
        return { "github_status": r.status_code }
`}</CodeBlock>
          <CodeBlock language="text" filename="requirements.txt">{`httpx
`}</CodeBlock>
        </section>
        <section>
          <h3>Configuring Python Functions</h3>
          <p>
            Use <code>webduh.json</code> to set runtime, memory, and environment
            variables for your Python functions. You can also specify secrets
            and per-function overrides.
          </p>
          <CodeBlock language="json" filename="webduh.json">{`{
  "functions": {
    "api/hello.py": {
      "runtime": "python3.11",
      "memory": 256,
      "timeout": 10,
      "env": {
        "MY_SECRET": "@my-secret"
      }
    }
  }
}`}</CodeBlock>
        </section>
        <section>
          <h3>Deploying Your Python Function</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>
                Place your function in the <code>api/</code> directory
              </strong>{' '}
              (e.g., <code>api/hello.py</code>).
            </li>
            <li>
              <strong>
                (Optional) Add a <code>requirements.txt</code> file
              </strong>{' '}
              for dependencies.
            </li>
            <li>
              <strong>Deploy with the Webduh CLI:</strong>
              <CodeBlock
                language="bash"
                filename="Deploy"
              >{`webduh deploy`}</CodeBlock>
            </li>
            <li>
              <strong>Invoke your function at:</strong>
              <CodeBlock
                language="bash"
                filename="Invoke"
              >{`https://<your-app>.webduh.app/api/hello`}</CodeBlock>
            </li>
          </ol>
        </section>
        <section>
          <h3>Best Practices & Tips</h3>
          <ul className="list-disc pl-6">
            <li>
              Keep functions stateless—use databases or external storage for
              persistent data.
            </li>
            <li>
              Use <code>async def</code> for I/O-bound code to maximize
              performance.
            </li>
            <li>Store secrets in environment variables, not in code.</li>
            <li>Test locally with the same Python version as your runtime.</li>
            <li>
              For large dependencies, use <code>requirements.txt</code> and
              avoid unnecessary packages.
            </li>
          </ul>
        </section>
        <section>
          <h3>Learn More</h3>
          <ul className="list-disc pl-6">
            <li>
              <a
                href="https://docs.python.org/3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Python Official Documentation
              </a>
            </li>
            <li>
              <a
                href="https://webduh.com/docs/functions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Webduh Functions Documentation
              </a>
            </li>
            <li>
              <a
                href="https://pypi.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PyPI (Python Package Index)
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
