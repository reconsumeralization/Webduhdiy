import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function ImportPage() {
  return (
    <DocPage
      title="Import Existing Project"
      description="Bring your existing projects to webduh"
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        { label: 'Import', href: '/docs/getting-started-with-webduh/import' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Import an Existing Project?</h2>
          <p>
            Migrating your current app to webduh lets you take advantage of
            serverless infrastructure, instant deployments, and built-in
            scaling—without starting from scratch.
          </p>
        </section>
        <section>
          <h3>Step 1: Prepare Your Project</h3>
          <ul>
            <li>
              Ensure your project uses a supported framework (e.g., Next.js,
              React, SvelteKit, Astro, etc.).
            </li>
            <li>
              Check that your code is committed to a Git repository (GitHub,
              GitLab, or Bitbucket).
            </li>
          </ul>
        </section>
        <section>
          <h3>Step 2: Import via webduh Dashboard</h3>
          <ol>
            <li>
              Go to the <strong>webduh Dashboard</strong> and click{' '}
              <strong>New Project</strong>.
            </li>
            <li>
              Select <strong>Import from Git</strong>.
            </li>
            <li>Connect your Git provider and choose your repository.</li>
            <li>
              webduh will auto-detect your framework and suggest optimal
              settings.
            </li>
          </ol>
        </section>
        <section>
          <h3>Step 3: Configure Build Settings (Optional)</h3>
          <p>
            If your project needs custom build or output settings, you can
            adjust them before deploying.
          </p>
          <CodeBlock
            language="json"
            children={`{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs"
}`}
            filename="webduh.json"
          />
        </section>
        <section>
          <h3>Step 4: Deploy</h3>
          <ol>
            <li>
              Click <strong>Deploy</strong> in the dashboard.
            </li>
            <li>webduh will build and deploy your project automatically.</li>
            <li>
              Once deployed, you’ll get a live preview URL and can add a custom
              domain.
            </li>
          </ol>
        </section>
        <section>
          <h3>Troubleshooting</h3>
          <ul>
            <li>
              Check the <strong>Build Logs</strong> in the dashboard for errors.
            </li>
            <li>
              Review your <code>webduh.json</code> for correct build/output
              settings.
            </li>
            <li>
              Contact <a href="mailto:support@webduh.com">support@webduh.com</a>{' '}
              for help.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
