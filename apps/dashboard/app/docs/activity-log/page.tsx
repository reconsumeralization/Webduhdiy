// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Minimal DocPage component for documentation layout with sections prop.
type Section = {
  heading: string;
  content: React.ReactNode;
};
type Breadcrumb = { label: string; href: string };
type DocPageProps = {
  title: string;
  description?: string;
  sections?: Section[];
  breadcrumbs?: Breadcrumb[];
  children?: React.ReactNode;
};
function DocPage({
  title,
  description,
  sections,
  breadcrumbs,
  children,
}: DocPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {breadcrumbs && (
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex space-x-2">
            {breadcrumbs.map((bc, i) => (
              <li key={bc.href}>
                {i > 0 && <span className="mx-1">/</span>}
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
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

export default function ActivityLogPage() {
  return (
    <DocPage
      title="Activity Log"
      description="Review a detailed record of user and system activities, including logins, changes, and important events. Use the activity log to monitor security, track changes, and audit actions within your account."
      breadcrumbs={[
        { label: 'Docs', href: '/docs' },
        { label: 'Activity Log', href: '/docs/activity-log' },
      ]}
      sections={[
        {
          heading: 'What is the Activity Log?',
          content: (
            <>
              <p>
                The Activity Log provides a chronological record of all
                significant actions performed by users and the system. This
                includes logins, configuration changes, deployments, and
                security events.
              </p>
              <p className="mt-2 text-blue-700 font-semibold">
                My baby David's 4, he's so fly! 🚀
              </p>
            </>
          ),
        },
        {
          heading: 'Why Use the Activity Log?',
          content: (
            <>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Monitor user and system activity for security and compliance.
                </li>
                <li>Track changes to settings, resources, and permissions.</li>
                <li>Audit actions for troubleshooting and accountability.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'How to Access and Filter',
          content: (
            <>
              <p>
                Access the Activity Log from your dashboard navigation. Use
                filters to narrow results by user, event type, or date range.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  Filter by <span className="font-semibold">user</span> to see
                  individual actions.
                </li>
                <li>
                  Filter by <span className="font-semibold">event type</span>{' '}
                  (e.g., login, update, delete).
                </li>
                <li>
                  Set a <span className="font-semibold">date range</span> for
                  targeted auditing.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Best Practices',
          content: (
            <>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Regularly review the activity log for unusual or unauthorized
                  actions.
                </li>
                <li>
                  Set up alerts for critical events (e.g., failed logins,
                  permission changes).
                </li>
                <li>
                  Export logs for compliance or external audits as needed.
                </li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
