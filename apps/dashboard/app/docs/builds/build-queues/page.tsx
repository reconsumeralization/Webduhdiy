// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Minimal DocPage component for documentation layout with sections prop and optional breadcrumbs.
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

export default function BuildQueuesPage() {
  return (
    <DocPage
      title="Build Queues"
      description="Understand how build queues work in webduh, how they manage concurrent builds, and how to optimize your CI/CD pipeline for efficiency and reliability."
      breadcrumbs={[
        { label: 'Builds', href: '/docs/builds' },
        { label: 'Build Queues', href: '/docs/builds/build-queues' },
      ]}
      sections={[
        {
          heading: 'What Are Build Queues?',
          content:
            'Build queues manage the order and concurrency of builds in your CI/CD pipeline. When multiple builds are triggered simultaneously, the queue ensures that resources are allocated efficiently and builds are processed in a controlled manner.',
        },
        {
          heading: 'How Build Queues Work',
          content:
            'Each project has a dedicated build queue. When a build is triggered, it is added to the queue. The system processes builds based on available resources and queue priority. You can configure concurrency limits to control how many builds run in parallel.',
        },
        {
          heading: 'Optimizing Your Build Queue',
          content:
            'To reduce wait times, consider increasing your concurrency limits or optimizing your build steps for speed. Monitor your queue to identify bottlenecks and adjust your pipeline configuration as needed.',
        },
        {
          heading: 'Best Practices',
          content:
            'Keep your builds fast and reliable by caching dependencies, running tests in parallel, and only triggering builds for relevant changes. Regularly review your queue metrics to ensure optimal performance.',
        },
      ]}
    />
  );
}
