import React from 'react';
import Link from 'next/link';

interface PageInfo {
  title: string;
  href: string;
  description?: string;
}

interface PrevNextNavigationProps {
  currentPath: string;
}

// Navigation order for documentation pages
const navigationOrder: PageInfo[] = [
  // Getting Started
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

  // Frameworks
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

  // Deployments
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

  // Functions
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

  // Infrastructure
  { title: 'Domains', href: '/docs/domains', description: 'Domain management' },
  {
    title: 'Edge Network',
    href: '/docs/edge-network',
    description: 'Global CDN',
  },
  { title: 'Headers', href: '/docs/headers', description: 'HTTP headers' },

  // Tools
  { title: 'CLI', href: '/docs/cli', description: 'Command line' },
  { title: 'REST API', href: '/docs/rest-api', description: 'API reference' },
  {
    title: 'Git Integrations',
    href: '/docs/git',
    description: 'Version control',
  },

  // Analytics
  {
    title: 'Web Analytics',
    href: '/docs/analytics',
    description: 'Track visitors',
  },
  {
    title: 'Speed Insights',
    href: '/docs/speed-insights',
    description: 'Performance monitoring',
  },
];

export default function PrevNextNavigation({
  currentPath,
}: PrevNextNavigationProps) {
  const currentIndex = navigationOrder.findIndex(
    (page) => page.href === currentPath,
  );

  if (currentIndex === -1) {
    return null; // Current page not found in navigation order
  }

  const prevPage = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null;
  const nextPage =
    currentIndex < navigationOrder.length - 1
      ? navigationOrder[currentIndex + 1]
      : null;

  return (
    <nav className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
      {/* Previous page */}
      <div className="flex-1">
        {prevPage && (
          <Link
            href={prevPage.href}
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all max-w-sm"
          >
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Previous
              </div>
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                {prevPage.title}
              </div>
              {prevPage.description && (
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {prevPage.description}
                </div>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Next page */}
      <div className="flex-1 flex justify-end">
        {nextPage && (
          <Link
            href={nextPage.href}
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all max-w-sm"
          >
            <div className="flex-1 min-w-0 text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Next
              </div>
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                {nextPage.title}
              </div>
              {nextPage.description && (
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {nextPage.description}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
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
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
