'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function TurborepoPage() {
  return (
    <DocPage
      title="Turborepo"
      description="How to use Turborepo for monorepos on webduh. Learn setup, configuration, and deployment best practices."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Monorepos', href: '/docs/monorepos' },
        { label: 'Turborepo', href: '/docs/monorepos/turborepo' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Turborepo</strong> is a high-performance build system for
            JavaScript and TypeScript monorepos. It enables fast, incremental
            builds and efficient task orchestration across multiple packages and
            apps.
          </p>
          <p>
            webduh has first-class support for Turborepo, making it easy to
            deploy individual apps from your monorepo.
          </p>
        </section>

        <section>
          <h2 id="setup">Getting Started</h2>
          <ol>
            <li>
              <strong>Install Turborepo:</strong>
              <CodeBlock language="bash">{`npx create-turbo@latest`}</CodeBlock>
            </li>
            <li>
              <strong>Project Structure Example:</strong>
              <CodeBlock
                language="bash"
                filename="Monorepo Structure"
              >{`my-turbo-monorepo/
  apps/
    web/
    admin/
  packages/
    ui/
    utils/
  turbo.json
  package.json`}</CodeBlock>
            </li>
            <li>
              <strong>
                Configure <code>turbo.json</code>:
              </strong>
              <CodeBlock language="json" filename="turbo.json">{`{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "test": {}
  }
}`}</CodeBlock>
            </li>
          </ol>
        </section>

        <section>
          <h2 id="deploy">Deploying with webduh</h2>
          <ol>
            <li>
              <strong>Select the app to deploy:</strong> During project setup on
              webduh, set the <code>root directory</code> to the app you want to
              deploy (e.g., <code>apps/web</code>).
            </li>
            <li>
              <strong>Set the build command:</strong> Use Turborepo to build
              only the selected app:
              <CodeBlock language="bash">{`npx turbo run build --filter=web`}</CodeBlock>
            </li>
            <li>
              <strong>Install dependencies:</strong> webduh will automatically
              install all dependencies at the root of your monorepo.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="tips">Tips & Best Practices</h2>
          <ul>
            <li>
              Use <code>turbo prune</code> for smaller, production-only
              deployments.
            </li>
            <li>
              Cache <code>.next</code> or <code>dist</code> outputs for faster
              builds.
            </li>
            <li>
              Keep your <code>turbo.json</code> pipeline up to date as your
              monorepo grows.
            </li>
            <li>
              Leverage{' '}
              <a
                href="https://turbo.build/repo/docs/features/remote-caching"
                target="_blank"
                rel="noopener noreferrer"
              >
                remote caching
              </a>{' '}
              for even faster CI/CD pipelines.
            </li>
          </ul>
        </section>

        <section>
          <h2 id="resources">Further Reading</h2>
          <ul>
            <li>
              <a
                href="https://turbo.build/repo/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Turborepo Documentation
              </a>
            </li>
            <li>
              <a
                href="https://webduh.com/docs/monorepos"
                target="_blank"
                rel="noopener noreferrer"
              >
                webduh Monorepos Guide
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
