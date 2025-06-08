'use client';

import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function NxPage() {
  return (
    <DocPage
      title="Nx"
      description="How to use Nx for monorepos on webduh. Learn setup, configuration, and deployment best practices."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Monorepos', href: '/docs/monorepos' },
        { label: 'Nx', href: '/docs/monorepos/nx' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Nx</strong> is a powerful build system and monorepo manager
            for JavaScript, TypeScript, and more. It provides advanced code
            sharing, task orchestration, and caching for large-scale
            repositories.
          </p>
          <p>
            webduh supports Nx monorepos out of the box, making it easy to
            deploy individual apps or packages from your Nx workspace.
          </p>
        </section>

        <section>
          <h2 id="setup">Getting Started</h2>
          <ol>
            <li>
              <strong>Install Nx:</strong>
              <CodeBlock language="bash">{`npx create-nx-workspace@latest`}</CodeBlock>
            </li>
            <li>
              <strong>Project Structure Example:</strong>
              <CodeBlock
                language="bash"
                filename="Nx Monorepo Structure"
              >{`my-nx-monorepo/
  apps/
    web/
    admin/
  libs/
    ui/
    utils/
  nx.json
  workspace.json
  package.json`}</CodeBlock>
            </li>
            <li>
              <strong>
                Configure <code>nx.json</code> and <code>workspace.json</code>:
              </strong>
              <p>
                Ensure your apps and libraries are properly defined. For most
                deployments, you’ll specify the <code>root directory</code> of
                the app you want to deploy.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 id="deployment">Deploying with webduh</h2>
          <ol>
            <li>
              <strong>Select the app to deploy:</strong> During project setup on
              webduh, set the <code>root directory</code> to the path of your Nx
              app (e.g., <code>apps/web</code>).
            </li>
            <li>
              <strong>Set the build command:</strong> Use the Nx CLI to build
              your app. For example:
              <CodeBlock language="bash">{`npx nx build web`}</CodeBlock>
            </li>
            <li>
              <strong>Set the output directory:</strong> By default, Nx outputs
              builds to <code>dist/apps/[app-name]</code>. Set this as your
              output directory in webduh.
            </li>
          </ol>
        </section>

        <section>
          <h2 id="caching">Remote Caching</h2>
          <p>
            Nx supports remote caching to speed up builds across your team and
            CI. You can enable Nx Cloud or other remote cache providers for
            optimal performance.
          </p>
        </section>

        <section>
          <h2 id="resources">Resources</h2>
          <ul>
            <li>
              <a
                href="https://nx.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nx Documentation
              </a>
            </li>
            <li>
              <a
                href="https://webduh.com/docs/monorepos/remote-caching"
                target="_blank"
                rel="noopener noreferrer"
              >
                Remote Caching on webduh
              </a>
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
