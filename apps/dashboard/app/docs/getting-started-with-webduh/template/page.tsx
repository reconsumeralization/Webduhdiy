import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function TemplatePage() {
  return (
    <DocPage
      title="Use a Template"
      description="Deploy quickly with pre-built templates"
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Use a Template',
          href: '/docs/getting-started-with-webduh/template',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Use a Template?</h2>
          <p>
            Templates help you launch projects faster by providing
            pre-configured codebases for popular frameworks and use cases. Skip
            boilerplate setup and focus on building your unique features.
          </p>
        </section>
        <section>
          <h3>Step 1: Browse Available Templates</h3>
          <p>
            In the <strong>webduh Dashboard</strong>, click{' '}
            <strong>New Project</strong> and select{' '}
            <strong>Start from Template</strong>. You’ll see templates for:
          </p>
          <ul>
            <li>Next.js Starter</li>
            <li>React Landing Page</li>
            <li>Blog (Astro, SvelteKit, etc.)</li>
            <li>API Server</li>
            <li>...and more</li>
          </ul>
        </section>
        <section>
          <h3>Step 2: Deploy Your Template</h3>
          <ol>
            <li>Choose a template that fits your needs.</li>
            <li>
              Click <strong>Deploy</strong>. webduh will clone the template and
              set up your new project.
            </li>
            <li>
              Optionally, connect your Git provider to push changes to your own
              repository.
            </li>
          </ol>
        </section>
        <section>
          <h3>Step 3: Customize Your Project</h3>
          <p>
            Once deployed, you can edit the code directly in your connected Git
            repository. Make it your own by updating content, styles, and
            functionality.
          </p>
          <CodeBlock
            language="bash"
            children={`# Clone the template
git clone https://github.com/webduh-templates/nextjs-starter.git

# Install dependencies
cd nextjs-starter
npm install
npm run dev`}
            filename="Terminal"
          />
        </section>
        <section>
          <h3>Tips</h3>
          <ul>
            <li>
              Check the <strong>README</strong> in each template for usage
              instructions.
            </li>
            <li>
              Templates are updated regularly—pull the latest changes or start
              fresh anytime.
            </li>
            <li>
              Need a custom template?{' '}
              <a
                href="https://github.com/webduh-templates"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute or request one here
              </a>
              .
            </li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
