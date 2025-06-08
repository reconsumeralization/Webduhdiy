// TODO: confirm version & license.
import React from 'react';

/* --- embedded utilities --- */
// Minimal DocPage component for documentation layout with sections prop.
type Section = {
  heading: string;
  content: React.ReactNode;
};
type DocPageProps = {
  title: string;
  description?: string;
  sections?: Section[];
  children?: React.ReactNode;
};
function DocPage({ title, description, sections, children }: DocPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="mb-6 text-lg text-muted-foreground">{description}</p>
      )}
      <main>
        {sections && sections.length > 0 ? (
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section key={section.heading + idx}>
                <h2 className="text-xl font-semibold mb-2">
                  {section.heading}
                </h2>
                <div>{section.content}</div>
              </section>
            ))}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <DocPage
      title="Account & Plan Management"
      description="Manage your user accounts, permissions, security settings, and subscription plans. Learn how to add, remove, and update accounts, configure roles, review account activity, and handle plan upgrades or downgrades."
      sections={[
        {
          heading: 'User Accounts',
          content: (
            <>
              <p>
                Create, update, or remove user accounts. Assign roles and
                permissions to control access to features and data.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Add new users to your organization or project.</li>
                <li>Edit user details and reset passwords.</li>
                <li>Remove users who no longer need access.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Roles & Permissions',
          content: (
            <>
              <p>
                Use roles to define what users can see and do. Common roles
                include <span className="font-semibold">Admin</span>,{' '}
                <span className="font-semibold">Editor</span>, and{' '}
                <span className="font-semibold">Viewer</span>.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Admins can manage all settings and users.</li>
                <li>Editors can modify content and settings.</li>
                <li>Viewers have read-only access.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Plan Management',
          content: (
            <>
              <p>
                Upgrade, downgrade, or cancel your subscription plan at any
                time. View current plan details, usage limits, and billing
                history.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Compare available plans and features.</li>
                <li>Change your plan to fit your needs.</li>
                <li>Access invoices and manage payment methods.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Account Security',
          content: (
            <>
              <p>
                Protect your account with strong passwords and two-factor
                authentication (2FA). Review recent account activity for
                security monitoring.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Enable or require 2FA for all users.</li>
                <li>Monitor login attempts and device access.</li>
                <li>Set up alerts for suspicious activity.</li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
