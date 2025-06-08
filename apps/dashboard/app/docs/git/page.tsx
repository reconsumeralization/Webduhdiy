import React from 'react';
import DocPage from '../components/DocPage';

export default function GitPage() {
  return (
    <DocPage
      title="Git Integrations"
      description="Connect your GitHub, GitLab, Bitbucket, and Azure DevOps repositories to webduh for seamless, automated deployments. Learn how to set up CI/CD pipelines and streamline your workflow."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Git Integrations', href: '/docs/git' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            webduh supports integration with all major Git providers, enabling
            you to automate deployments and manage your projects efficiently.
            Choose your provider below to get started with step-by-step guides.
          </p>
        </section>
        <section>
          <h3>Supported Providers</h3>
          <ul>
            <li>
              <a href="/docs/git/webduh-for-github" className="underline">
                GitHub
              </a>{' '}
              &ndash; Set up GitHub Actions for automated deployments.
            </li>
            <li>
              <a href="/docs/git/webduh-for-gitlab" className="underline">
                GitLab
              </a>{' '}
              &ndash; Integrate with GitLab CI/CD pipelines.
            </li>
            <li>
              <a href="/docs/git/webduh-for-bitbucket" className="underline">
                Bitbucket
              </a>{' '}
              &ndash; Connect Bitbucket repositories for seamless deployment.
            </li>
            <li>
              <a
                href="/docs/git/webduh-for-azure-pipelines"
                className="underline"
              >
                Azure DevOps
              </a>{' '}
              &ndash; Use Azure Pipelines to deploy to webduh.
            </li>
          </ul>
        </section>
        <section>
          <h3>Why Integrate?</h3>
          <ul>
            <li>Automate deployments on every push or pull request.</li>
            <li>Reduce manual steps and human error.</li>
            <li>Enable continuous delivery and faster iteration.</li>
            <li>Centralize deployment logs and status in your Git provider.</li>
          </ul>
        </section>
        <section>
          <h3>Get Started</h3>
          <p>
            Select your Git provider above to view detailed integration
            instructions, including example configuration files and best
            practices.
          </p>
        </section>
      </div>
    </DocPage>
  );
}
