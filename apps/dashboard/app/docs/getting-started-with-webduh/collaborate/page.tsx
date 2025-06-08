import React from 'react';
import DocPage from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

export default function CollaboratePage() {
  return (
    <DocPage
      title="Collaborate"
      description="Invite teammates, manage roles, and work together on your webduh project."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started-with-webduh' },
        {
          label: 'Collaborate',
          href: '/docs/getting-started-with-webduh/collaborate',
        },
      ]}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Why Collaborate?</h2>
          <p>
            Working with a team lets you build, deploy, and manage your webduh
            projects faster and more securely. Invite developers, designers, and
            stakeholders to streamline your workflow.
          </p>
        </section>
        <section>
          <h3>Inviting Teammates</h3>
          <ol>
            <li>Go to your project dashboard.</li>
            <li>
              Click on <strong>Team</strong> in the sidebar.
            </li>
            <li>Enter your teammate’s email address and choose a role.</li>
            <li>
              Click <strong>Invite</strong>. They’ll receive an email to join
              your project.
            </li>
          </ol>
        </section>
        <section>
          <h3>Roles & Permissions</h3>
          <ul>
            <li>
              <strong>Owner</strong>: Full access, including billing and
              settings.
            </li>
            <li>
              <strong>Admin</strong>: Manage deployments, functions, and team
              members.
            </li>
            <li>
              <strong>Developer</strong>: Deploy code and manage functions.
            </li>
            <li>
              <strong>Viewer</strong>: Read-only access to project resources.
            </li>
          </ul>
        </section>
        <section>
          <h3>Example: Invite a Teammate via CLI</h3>
          <CodeBlock
            language="bash"
            children={`# Invite via CLI
webduh team invite alice@example.com --role=developer`}
            filename="Terminal"
          />
        </section>
        <section>
          <h3>Best Practices</h3>
          <ul>
            <li>Assign the least privilege necessary for each teammate.</li>
            <li>Review team access regularly.</li>
            <li>Remove users who no longer need access.</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
