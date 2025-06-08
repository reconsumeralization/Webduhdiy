import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function WebduhForGitlabPage() {
  return (
    <DocPage
      title="GitLab Integration"
      description="How to deploy with webduh using GitLab CI/CD. Automate your deployments from GitLab to webduh for seamless CI/CD."
      breadcrumbs={[
        { label: 'Git Integrations', href: '/docs/git' },
        { label: 'GitLab', href: '/docs/git/webduh-for-gitlab' },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Overview</h2>
          <p>
            Integrate GitLab CI/CD with webduh to automate deployments on every
            push or merge request. This guide walks you through setting up a
            pipeline that deploys your app to webduh using the CLI.
          </p>
        </section>
        <section>
          <h3>1. Prerequisites</h3>
          <ul>
            <li>
              An existing project on{' '}
              <a
                href="https://gitlab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitLab
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
          <h3>2. Add webduh CLI to Your Pipeline</h3>
          <p>
            In your GitLab repository, add a <code>.gitlab-ci.yml</code> file
            (or edit your existing one) to install the webduh CLI and deploy on
            build.
          </p>
          <CodeBlock language="yaml" filename=".gitlab-ci.yml">
            {`stages:
  - deploy

deploy_webduh:
  stage: deploy
  image: node:18
  script:
    - npm install -g webduh
    - webduh --version
    - webduh deploy --token $WEBDUH_API_TOKEN
  only:
    - main
`}
          </CodeBlock>
        </section>
        <section>
          <h3>3. Set Up Your API Token</h3>
          <ol>
            <li>
              In your GitLab project, go to{' '}
              <strong>Settings &gt; CI/CD &gt; Variables</strong>.
            </li>
            <li>
              Add a new variable named <code>WEBDUH_API_TOKEN</code> and paste
              your webduh API token as the value.
            </li>
            <li>
              Make sure the variable is <strong>masked</strong> and{' '}
              <strong>protected</strong> if you use protected branches.
            </li>
          </ol>
        </section>
        <section>
          <h3>4. Trigger a Deployment</h3>
          <ul>
            <li>
              Push a commit to your <code>main</code> branch.
            </li>
            <li>
              GitLab CI/CD will run the pipeline and deploy your project to
              webduh automatically.
            </li>
            <li>Check your webduh dashboard for deployment status and logs.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
