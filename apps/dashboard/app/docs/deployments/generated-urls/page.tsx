import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';

export default function GeneratedUrlsPage() {
  return (
    <DocPage
      title="Generated URLs"
      description="Discover how webduh automatically generates unique, secure URLs for every deployment, branch, and pull request—empowering instant previews, automated testing, and seamless collaboration."
      breadcrumbs={[
        { label: 'Deployments', href: '/docs/deployments' },
        { label: 'Generated URLs', href: '/docs/deployments/generated-urls' },
      ]}
    >
      <section className="prose dark:prose-invert max-w-none">
        <h2>What are Generated URLs?</h2>
        <p>
          With every deployment on webduh, a unique, shareable URL is created.
          These URLs enable your team to preview changes in real time, run
          automated tests, and share work-in-progress with stakeholders—without
          affecting your production environment.
        </p>
        <p>
          Generated URLs are a cornerstone of modern, collaborative development
          workflows, making it easy to validate features and gather feedback
          before merging to production.
        </p>

        <h2>Types of Generated URLs</h2>
        <ul>
          <li>
            <b>Branch URLs:</b> Each branch automatically receives its own
            preview URL, such as{' '}
            <InlineCode>https://feature-login-abc123.webduh.app</InlineCode>.
            This lets you test features in isolation.
          </li>
          <li>
            <b>Pull Request URLs:</b> Every pull request triggers a preview
            deployment with a unique URL, e.g.{' '}
            <InlineCode>https://pr-42-xyz789.webduh.app</InlineCode>. This is
            perfect for code reviews and QA.
          </li>
          <li>
            <b>Production URL:</b> The main branch (or your designated
            production branch) is always available at your primary domain, e.g.{' '}
            <InlineCode>https://yourdomain.com</InlineCode>.
          </li>
        </ul>

        <h2>Example URLs</h2>
        <CodeBlock language="bash">{`# Branch deployment
feature-login → https://feature-login-abc123.webduh.app

# Pull request deployment
PR #42 → https://pr-42-xyz789.webduh.app

# Production deployment
main → https://yourdomain.com`}</CodeBlock>

        <h2>Advanced Usage</h2>
        <ul>
          <li>
            <b>Instant Previews:</b> Share branch or PR URLs with your team for
            rapid feedback and collaborative testing.
          </li>
          <li>
            <b>Automated Testing:</b> Integrate generated URLs into your CI/CD
            pipeline for end-to-end and visual regression tests on every
            deployment.
          </li>
          <li>
            <b>Stakeholder Access:</b> Allow non-technical stakeholders to
            review the latest changes without requiring repository access.
          </li>
          <li>
            <b>Custom Domains:</b> Map your own domains or subdomains to
            production or preview deployments for a branded experience.
          </li>
        </ul>

        <h2>Security & Access Control</h2>
        <p>
          Preview URLs are intentionally long and unlisted to prevent accidental
          discovery. For sensitive branches or environments, you can enforce
          authentication, password protection, or IP allowlisting to restrict
          access.
        </p>
        <p>
          <b>Tip:</b> Use environment variables and branch protection rules to
          further secure preview deployments.
        </p>

        <h2>Best Practices</h2>
        <ul>
          <li>
            Regularly clean up unused preview deployments to keep your dashboard
            organized.
          </li>
          <li>Use descriptive branch names for more readable preview URLs.</li>
          <li>
            Communicate with your team about the purpose of each preview URL,
            especially when sharing with external stakeholders.
          </li>
        </ul>
      </section>
    </DocPage>
  );
}
