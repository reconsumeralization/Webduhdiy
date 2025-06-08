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

export default function BuildImagePage() {
  return (
    <DocPage
      title="Build Image"
      description="Understand the build image environment, its components, and how to customize it for your projects. Learn how build images affect your CI/CD pipelines and deployment workflows."
      breadcrumbs={[
        { label: 'Builds', href: '/docs/builds' },
        { label: 'Build Image', href: '/docs/builds/build-image' },
      ]}
      sections={[
        {
          heading: 'What is a Build Image?',
          content:
            'A build image is a pre-configured environment containing all the tools, libraries, and dependencies required to build and test your application. Using standardized build images ensures consistency and reliability across your CI/CD pipelines.',
        },
        {
          heading: 'Default Build Image',
          content:
            'Webduh provides a default build image optimized for most modern web projects. It includes popular runtimes (Node.js, Python, etc.), build tools, and utilities. You can view the full list of included software in the documentation.',
        },
        {
          heading: 'Customizing Your Build Image',
          content:
            'If your project requires additional dependencies or specific versions, you can customize the build image. Options include specifying a custom Dockerfile or extending the default image with extra packages.',
        },
        {
          heading: 'Best Practices',
          content:
            'Keep your build images lean by only including necessary dependencies. Regularly update your images to receive security patches and performance improvements. Test custom images locally before deploying to production.',
        },
      ]}
    />
  );
}
