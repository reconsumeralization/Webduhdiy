import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function WebduhForBitbucketPage() {
  return (
    <DocPage
      title="Bitbucket Integration"
      description="Connect your Bitbucket repositories to webduh for seamless, automated deployments."
      breadcrumbs={[
        { label: 'Git Integrations', href: '/docs/git' },
        { label: 'Bitbucket', href: '/docs/git/webduh-for-bitbucket' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Integrate your Bitbucket repositories with webduh to enable
            automatic deployments on every push. This guide walks you through
            connecting Bitbucket, configuring your project, and best practices
            for CI/CD.
          </p>
        </section>
        <section>
          <h3>Step 1: Connect Bitbucket to webduh</h3>
          <ol>
            <li>
              In the <strong>webduh Dashboard</strong>, go to{' '}
              <strong>Integrations</strong> &rarr;{' '}
              <strong>Git Providers</strong>.
            </li>
            <li>
              Click <strong>Connect Bitbucket</strong> and follow the
              authentication prompts.
            </li>
            <li>Authorize webduh to access your Bitbucket repositories.</li>
          </ol>
        </section>
        <section>
          <h3>Step 2: Import Your Repository</h3>
          <ol>
            <li>
              After connecting, click <strong>New Project</strong> and select{' '}
              <strong>Import from Git</strong>.
            </li>
            <li>Choose your Bitbucket repository from the list.</li>
            <li>
              Configure build settings if needed, then click{' '}
              <strong>Deploy</strong>.
            </li>
          </ol>
        </section>
        <section>
          <h3>Step 3: Automatic Deployments</h3>
          <p>
            Whenever you push to your Bitbucket repository, webduh will
            automatically build and deploy your project. You can monitor
            deployment status in the dashboard.
          </p>
          <CodeBlock
            language="bash"
            filename="Bitbucket Example"
            showLineNumbers={false}
          >{`# Make a change and push to Bitbucket
git add .
git commit -m "Update homepage"
git push origin main
# webduh will detect the push and deploy automatically
`}</CodeBlock>
        </section>
        <section>
          <h3>Troubleshooting</h3>
          <ul>
            <li>
              <strong>Missing Repositories?</strong> Ensure you granted webduh
              access to all relevant Bitbucket workspaces.
            </li>
            <li>
              <strong>Build Failures?</strong> Check your build logs in the
              webduh dashboard for errors and recommended fixes.
            </li>
            <li>
              <strong>Need Help?</strong> Visit our{' '}
              <a href="/docs/support">Support</a> page or contact us directly.
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
