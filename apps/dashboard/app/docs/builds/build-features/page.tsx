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

export default function BuildFeaturesPage() {
  return (
    <DocPage
      title="Build Features"
      description="Explore the advanced build features available in webduh. Learn how to optimize your builds, enable experimental features, and customize your deployment pipeline for maximum performance and flexibility."
      breadcrumbs={[
        { label: 'Builds', href: '/docs/builds' },
        { label: 'Build Features', href: '/docs/builds/build-features' },
      ]}
      sections={[
        {
          heading: 'Incremental Builds',
          content:
            'Speed up your deployments by only rebuilding what has changed. Incremental builds reduce build times and resource usage, making your workflow more efficient.',
        },
        {
          heading: 'Environment Variables',
          content:
            'Easily manage environment variables for different stages (development, preview, production). Securely inject secrets and configuration into your build process.',
        },
        {
          heading: 'Custom Build Commands',
          content:
            "Define custom build and install commands to tailor the build process to your project's needs. Supports monorepos, workspaces, and advanced tooling.",
        },
        {
          heading: 'Build Caching',
          content:
            'Leverage build caching to avoid redundant work and accelerate repeated builds. Caching is automatic for supported frameworks and can be customized for advanced use cases.',
        },
        {
          heading: 'Preview Deployments',
          content:
            'Every pull request gets its own preview deployment, allowing you to test changes in isolation before merging. Share preview URLs with your team for fast feedback.',
        },
      ]}
    />
  );
}
