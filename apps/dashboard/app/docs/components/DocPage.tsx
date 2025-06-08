'use client';

// TODO: confirm version & license.
import React, { useState, useEffect } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import { usePathname } from 'next/navigation';

/* ---- embedded utilities ---- */

// SearchComponent (minimal stub for self-containment)
function SearchComponent() {
  return (
    <input
      type="search"
      placeholder="Search docs..."
      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      aria-label="Search documentation"
    />
  );
}

// TableOfContents (minimal stub for self-containment)
function TableOfContents() {
  return (
    <nav aria-label="Table of contents">
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        Table of Contents
      </div>
      {/* Add actual TOC logic here */}
    </nav>
  );
}

// PrevNextNavigation (minimal stub for self-containment)
interface PageInfo {
  title: string;
  href: string;
  description?: string;
}
interface PrevNextNavigationProps {
  currentPath: string;
}
const navigationOrder: PageInfo[] = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started-with-webduh',
    description: 'Learn the basics',
  },
  {
    title: 'Projects and Deployments',
    href: '/docs/getting-started-with-webduh/projects-deployments',
    description: 'Core concepts',
  },
  {
    title: 'Use a Template',
    href: '/docs/getting-started-with-webduh/template',
    description: 'Quick deployment',
  },
  {
    title: 'Import Existing Project',
    href: '/docs/getting-started-with-webduh/import',
    description: 'Migrate your project',
  },
  {
    title: 'Add a Domain',
    href: '/docs/getting-started-with-webduh/domains',
    description: 'Custom domains',
  },
  {
    title: 'Frameworks Overview',
    href: '/docs/frameworks',
    description: 'Supported frameworks',
  },
  {
    title: 'Next.js',
    href: '/docs/frameworks/nextjs',
    description: 'React framework',
  },
  {
    title: 'SvelteKit',
    href: '/docs/frameworks/sveltekit',
    description: 'Svelte framework',
  },
  {
    title: 'Astro',
    href: '/docs/frameworks/astro',
    description: 'Static site generator',
  },
  {
    title: 'Nuxt',
    href: '/docs/frameworks/nuxt',
    description: 'Vue.js framework',
  },
  { title: 'Vite', href: '/docs/frameworks/vite', description: 'Build tool' },
  {
    title: 'Deployments',
    href: '/docs/deployments',
    description: 'Manage deployments',
  },
  {
    title: 'Environment Variables',
    href: '/docs/environment-variables',
    description: 'Configuration',
  },
  { title: 'Builds', href: '/docs/builds', description: 'Build process' },
  {
    title: 'Functions',
    href: '/docs/functions',
    description: 'Serverless functions',
  },
  {
    title: 'Functions Quickstart',
    href: '/docs/functions/quickstart',
    description: 'Get started',
  },
  {
    title: 'Node.js Runtime',
    href: '/docs/functions/runtimes/node-js',
    description: 'JavaScript runtime',
  },
  {
    title: 'Python Runtime',
    href: '/docs/functions/runtimes/python',
    description: 'Python runtime',
  },
  {
    title: 'Edge Runtime',
    href: '/docs/functions/runtimes/edge',
    description: 'Edge functions',
  },
  { title: 'Domains', href: '/docs/domains', description: 'Domain management' },
  {
    title: 'Edge Network',
    href: '/docs/edge-network',
    description: 'Global CDN',
  },
  { title: 'Headers', href: '/docs/headers', description: 'HTTP headers' },
  { title: 'CLI', href: '/docs/cli', description: 'Command line' },
  { title: 'REST API', href: '/docs/rest-api', description: 'API reference' },
];
function PrevNextNavigation({ currentPath }: PrevNextNavigationProps) {
  const idx = navigationOrder.findIndex((page) => page.href === currentPath);
  const prev = idx > 0 ? navigationOrder[idx - 1] : null;
  const next =
    idx >= 0 && idx < navigationOrder.length - 1
      ? navigationOrder[idx + 1]
      : null;
  if (!prev && !next) return null;
  return (
    <nav className="flex justify-between mt-12" aria-label="Page navigation">
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← {prev.title}
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={next.href}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {next.title} →
          </Link>
        )}
      </div>
    </nav>
  );
}

// FeedbackWidget (minimal stub for self-containment)
interface FeedbackWidgetProps {
  pageTitle: string;
  pagePath: string;
}
function FeedbackWidget({ pageTitle, pagePath }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
      <div className="mb-2 text-gray-700 dark:text-gray-200">
        Was this page helpful?
      </div>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${feedback === 'helpful' ? 'bg-green-200' : 'bg-gray-200'} dark:bg-gray-800`}
          onClick={() => {
            setFeedback('helpful');
            setSubmitted(true);
          }}
          disabled={submitted}
        >
          Yes
        </button>
        <button
          className={`px-3 py-1 rounded ${feedback === 'not-helpful' ? 'bg-red-200' : 'bg-gray-200'} dark:bg-gray-800`}
          onClick={() => {
            setFeedback('not-helpful');
            setSubmitted(true);
          }}
          disabled={submitted}
        >
          No
        </button>
      </div>
      {submitted && (
        <div className="mt-2 text-sm text-gray-500">
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
}

// ThemeToggle (minimal stub for self-containment)
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
  return (
    <button
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? (
        // Moon icon
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      ) : (
        // Sun icon
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx={12} cy={12} r={5} stroke="currentColor" strokeWidth={2} />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          />
        </svg>
      )}
    </button>
  );
}

// MobileNavigation and useMobileNavigation (minimal stub for self-containment)
interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}
function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex">
      <div className="bg-white dark:bg-gray-900 w-64 p-6">
        <button
          onClick={onClose}
          className="mb-4 text-gray-600 dark:text-gray-300"
        >
          Close
        </button>
        <nav>
          <Link href="/docs" className="block py-2">
            Docs Home
          </Link>
          {/* Add more navigation items as needed */}
        </nav>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    openNav: () => setIsOpen(true),
    closeNav: () => setIsOpen(false),
  };
}

/* ---- end embedded utilities ---- */

interface DocPageProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href: string }>;
  sections?: Array<{ heading: string; content: string | React.ReactNode }>;
}

export default function DocPage({
  title,
  description,
  children,
  breadcrumbs: customBreadcrumbs,
  sections,
}: DocPageProps) {
  const pathname = usePathname();
  const { isOpen, openNav, closeNav } = useMobileNavigation();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const isLast = i === segments.length - 1;

      let label = segments[i]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special cases for better labels
      if (label === 'Getting Started With Webduh') {
        label = 'Getting Started';
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Mobile Navigation */}
      <MobileNavigation isOpen={isOpen} onClose={closeNav} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Mobile menu button */}
            <div className="flex items-center gap-4">
              <button
                onClick={openNav}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <Link href="/docs" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  webduh
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  / docs
                </span>
              </Link>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <SearchComponent />
            </div>

            {/* Right: Theme toggle + GitHub link */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="https://github.com/webduh/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="View on GitHub"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left sidebar - Desktop navigation (hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-24 py-8">
              {/* Desktop navigation would go here - simplified for now */}
              <div className="space-y-1">
                <Link
                  href="/docs"
                  className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ← Back to Documentation
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content area */}
          <main className="lg:col-span-6 xl:col-span-7">
            <div className="py-8">
              {/* Mobile search */}
              <div className="md:hidden mb-6">
                <SearchComponent />
              </div>

              {/* Breadcrumbs */}
              {breadcrumbs.length > 1 && (
                <nav className="mb-6" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={crumb.href} className="flex items-center">
                        {index > 0 && (
                          <svg
                            className="w-4 h-4 text-gray-400 mx-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                        {crumb.isLast ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            {crumb.label}
                          </span>
                        ) : (
                          <Link
                            href={crumb.href}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            {crumb.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Page header */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Content */}
              {children && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {children}
                </div>
              )}

              {/* Sections */}
              {sections && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {section.heading}
                      </h2>
                      <div className="text-gray-600 dark:text-gray-300">
                        {typeof section.content === 'string' ? (
                          <p>{section.content}</p>
                        ) : (
                          section.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Previous/Next navigation */}
              <PrevNextNavigation currentPath={pathname} />

              {/* Feedback widget */}
              <div className="mt-12">
                <FeedbackWidget pageTitle={title} pagePath={pathname} />
              </div>
            </div>
          </main>

          {/* Right sidebar - Table of Contents */}
          <aside className="hidden xl:block xl:col-span-3">
            <div className="py-8">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 webduh. Built with ❤️ for developers.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/docs"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/webduh/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://webduh.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
