'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

export default function MonoreposPage() {
  return (
    <DocPage
      title="Monorepos"
      description="Deploy multiple projects from a single repository with webduh."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Monorepos', href: '/docs/monorepos' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>Monorepos</strong> allow you to manage multiple projects or
            packages within a single repository. This approach is ideal for
            organizations or teams that want to share code, dependencies, and
            workflows across several applications or libraries.
          </p>
        </section>

        <section>
          <h2 id="supported-tools">Supported Monorepo Tools</h2>
          <ul>
            <li>
              <strong>Turborepo</strong>
            </li>
            <li>
              <strong>Nx</strong>
            </li>
            <li>
              <strong>Lerna</strong>
            </li>
            <li>
              <strong>Yarn Workspaces</strong>
            </li>
            <li>
              <strong>pnpm Workspaces</strong>
            </li>
          </ul>
          <p>
            webduh automatically detects common monorepo tools and can deploy
            individual apps or packages from your monorepo.
          </p>
        </section>

        <section>
          <h2 id="configuration">Configuration Example</h2>
          <p>
            To deploy a specific app from your monorepo, specify the{' '}
            <code>root directory</code> of the app during project setup. For
            example, if your monorepo structure looks like this:
          </p>
          <CodeBlock language="bash" filename="Monorepo Structure">
            {`my-monorepo/
  apps/
    web/
    admin/
  packages/
    ui/
    utils/`}
          </CodeBlock>
          <p>
            You can deploy <code>apps/web</code> or <code>apps/admin</code> as
            separate projects by selecting the appropriate root directory.
          </p>
        </section>

        <section>
          <h2 id="build-settings">Custom Build Settings</h2>
          <p>
            You may need to customize your build and install commands for
            monorepos. For example, with <strong>pnpm</strong>:
          </p>
          <CodeBlock language="bash" filename="pnpm">
            {`# Install dependencies for the whole monorepo
pnpm install

# Build only the web app
pnpm --filter ./apps/web... build`}
          </CodeBlock>
          <p>
            Adjust these commands based on your monorepo tool and project
            structure.
          </p>
        </section>

        <section>
          <h2 id="best-practices">Best Practices</h2>
          <ul>
            <li>
              Keep shared code in <code>packages/</code> or a similar directory.
            </li>
            <li>Use consistent dependency versions across projects.</li>
            <li>Leverage caching and parallel builds for faster CI/CD.</li>
            <li>Document your monorepo structure for contributors.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
