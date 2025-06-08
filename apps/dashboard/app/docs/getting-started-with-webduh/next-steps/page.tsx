import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function NextStepsPage() {
  return (
    <DocPage
      title="Next Steps"
      description="Where to go from here with webduh"
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Next Steps',
          href: '/docs/getting-started-with-webduh/next-steps',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Congratulations!</h2>
          <p>
            You’ve completed the getting started guide for webduh. Your project
            is up and running. Here are some recommended next steps to help you
            get the most out of webduh.
          </p>
        </section>
        <section>
          <h3>1. Add a Custom Domain</h3>
          <p>
            Make your project look professional by connecting a custom domain.
            <a
              href="/docs/getting-started-with-webduh/domains"
              className="underline ml-1"
            >
              Learn how &rarr;
            </a>
          </p>
        </section>
        <section>
          <h3>2. Invite Teammates</h3>
          <p>
            Collaborate with others by inviting teammates to your project.
            <a
              href="/docs/getting-started-with-webduh/collaborate"
              className="underline ml-1"
            >
              See collaboration guide &rarr;
            </a>
          </p>
        </section>
        <section>
          <h3>3. Import Existing Projects</h3>
          <p>
            Bring your existing apps to webduh for instant deployments and
            scaling.
            <a
              href="/docs/getting-started-with-webduh/import"
              className="underline ml-1"
            >
              Import instructions &rarr;
            </a>
          </p>
        </section>
        <section>
          <h3>4. Explore Serverless Functions</h3>
          <p>
            Deploy APIs, webhooks, and background jobs with webduh Functions.
            <a href="/docs/functions" className="underline ml-1">
              Read the functions docs &rarr;
            </a>
          </p>
        </section>
        <section>
          <h3>5. Join the Community</h3>
          <p>Get help, share feedback, and connect with other developers:</p>
          <ul>
            <li>
              <a
                href="https://discord.gg/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Join our Discord
              </a>
            </li>
            <li>
              <a
                href="https://github.com/webduh/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Star us on GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Follow us on Twitter
              </a>
            </li>
          </ul>
        </section>
        <section>
          <h3>Example: Deploy a Function</h3>
          <CodeBlock
            language="bash"
            filename="Terminal"
          >{`webduh functions deploy hello-world.js`}</CodeBlock>
        </section>
        <section>
          <h3>Need Help?</h3>
          <p>
            Check out our{' '}
            <a href="/docs" className="underline">
              full documentation
            </a>{' '}
            or reach out on Discord for support.
          </p>
        </section>
      </div>
    </DocPage>
  );
}
