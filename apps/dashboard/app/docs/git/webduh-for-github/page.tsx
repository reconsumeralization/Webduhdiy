import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function WebduhForGithubPage() {
  return (
    <DocPage
      title="GitHub Integration"
      description="How to deploy with webduh using GitHub. Automate your deployments from GitHub to webduh for seamless CI/CD."
      breadcrumbs={[
        { label: 'Git Integrations', href: '/docs/git' },
        { label: 'GitHub', href: '/docs/git/webduh-for-github' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Integrate GitHub with webduh to automate deployments on every push
            or pull request. This guide walks you through setting up a GitHub
            Actions workflow that deploys your app to webduh using the CLI.
          </p>
        </section>
        <section>
          <h3>1. Prerequisites</h3>
          <ul>
            <li>
              A repository on{' '}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub
              </a>
            </li>
            <li>
              A{' '}
              <a
                href="https://webduh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                webduh
              </a>{' '}
              account and project
            </li>
            <li>
              Your <strong>webduh API token</strong> (find it in your webduh
              dashboard under Account &gt; API Tokens)
            </li>
          </ul>
        </section>
        <section>
          <h3>2. Add webduh CLI to Your Workflow</h3>
          <p>
            In your GitHub repository, add a{' '}
            <code>.github/workflows/deploy.yml</code> file to install the webduh
            CLI and deploy on push.
          </p>
          <CodeBlock
            language="yaml"
            filename=".github/workflows/deploy.yml"
          >{`name: Deploy to webduh

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install webduh CLI
        run: npm install -g webduh

      - name: Deploy to webduh
        env:
          WEBDUH_API_TOKEN: \${{ secrets.WEBDUH_API_TOKEN }}
        run: webduh deploy --token $WEBDUH_API_TOKEN
`}</CodeBlock>
        </section>
        <section>
          <h3>3. Set Your API Token in GitHub Secrets</h3>
          <ol>
            <li>Go to your repository on GitHub.</li>
            <li>
              Navigate to{' '}
              <strong>Settings &gt; Secrets and variables &gt; Actions</strong>.
            </li>
            <li>
              Add a new secret named <code>WEBDUH_API_TOKEN</code> with your
              webduh API token value.
            </li>
          </ol>
        </section>
        <section>
          <h3>4. Push to Deploy</h3>
          <p>
            Now, every push to the <code>main</code> branch will trigger a
            deployment to webduh automatically.
          </p>
        </section>
      </div>
    </DocPage>
  );
}
