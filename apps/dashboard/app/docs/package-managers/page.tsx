'use client';

import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

export default function PackageManagersPage() {
  return (
    <DocPage
      title="Package Managers"
      description="Use any package manager with webduh: npm, yarn, pnpm, and more."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Package Managers', href: '/docs/package-managers' },
      ]}
    >
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 id="overview">Overview</h2>
          <p>
            <strong>webduh</strong> supports all modern JavaScript package
            managers out of the box, including <code>npm</code>,{' '}
            <code>yarn</code>, <code>pnpm</code>, and <code>bun</code>. You can
            use your preferred tool to install dependencies, run scripts, and
            manage your project.
          </p>
        </section>

        <section>
          <h2 id="supported">Supported Package Managers</h2>
          <ul>
            <li>
              <strong>npm</strong> (default for Node.js projects)
            </li>
            <li>
              <strong>yarn</strong> (classic and berry)
            </li>
            <li>
              <strong>pnpm</strong>
            </li>
            <li>
              <strong>bun</strong>
            </li>
          </ul>
          <p>
            webduh automatically detects your package manager based on the
            presence of <code>package-lock.json</code>, <code>yarn.lock</code>,{' '}
            <code>pnpm-lock.yaml</code>, or <code>bun.lockb</code> in your
            repository.
          </p>
        </section>

        <section>
          <h2 id="examples">Example Commands</h2>
          <p>
            Here’s how you can install dependencies and run your build script
            with each package manager:
          </p>
          <CodeBlock language="bash" filename="npm">{`# Install dependencies
npm install

# Run build script
npm run build`}</CodeBlock>
          <CodeBlock language="bash" filename="yarn">{`# Install dependencies
yarn install

# Run build script
yarn build`}</CodeBlock>
          <CodeBlock language="bash" filename="pnpm">{`# Install dependencies
pnpm install

# Run build script
pnpm build`}</CodeBlock>
          <CodeBlock language="bash" filename="bun">{`# Install dependencies
bun install

# Run build script
bun run build`}</CodeBlock>
        </section>

        <section>
          <h2 id="custom">Custom Build Commands</h2>
          <p>
            You can specify a custom build command in your project settings or
            via the CLI. For example:
          </p>
          <CodeBlock
            language="bash"
            filename="webduh CLI"
          >{`webduh --prod --build-command="pnpm run build:prod"`}</CodeBlock>
        </section>

        <section>
          <h2 id="troubleshooting">Troubleshooting</h2>
          <ul>
            <li>
              <strong>Missing lockfile:</strong> If no lockfile is found,{' '}
              <code>npm</code> will be used by default.
            </li>
            <li>
              <strong>Version mismatches:</strong> Ensure your{' '}
              <code>engines</code> field in <code>package.json</code> specifies
              the correct Node.js and package manager versions if you require a
              specific version.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
