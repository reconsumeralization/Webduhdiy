'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

const navigationStructure: NavItem[] = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started-with-webduh',
    children: [
      {
        title: 'Projects & Deployments',
        href: '/docs/getting-started-with-webduh/projects-deployments',
      },
      {
        title: 'Use a Template',
        href: '/docs/getting-started-with-webduh/template',
      },
      {
        title: 'Import Existing Project',
        href: '/docs/getting-started-with-webduh/import',
      },
      {
        title: 'Add a Domain',
        href: '/docs/getting-started-with-webduh/domains',
      },
    ],
  },
  {
    title: 'Frameworks',
    href: '/docs/frameworks',
    children: [
      { title: 'Next.js', href: '/docs/frameworks/nextjs' },
      { title: 'SvelteKit', href: '/docs/frameworks/sveltekit' },
      { title: 'Astro', href: '/docs/frameworks/astro' },
      { title: 'Nuxt', href: '/docs/frameworks/nuxt' },
      { title: 'Vite', href: '/docs/frameworks/vite' },
    ],
  },
  {
    title: 'Functions',
    href: '/docs/functions',
    children: [
      { title: 'Quickstart', href: '/docs/functions/quickstart' },
      { title: 'Node.js Runtime', href: '/docs/functions/runtimes/node-js' },
      { title: 'Python Runtime', href: '/docs/functions/runtimes/python' },
      { title: 'Edge Runtime', href: '/docs/functions/runtimes/edge' },
    ],
  },
  {
    title: 'Deployments',
    href: '/docs/deployments',
    children: [
      { title: 'Environments', href: '/docs/deployments/environments' },
      { title: 'Generated URLs', href: '/docs/deployments/generated-urls' },
      {
        title: 'Managing Deployments',
        href: '/docs/deployments/managing-deployments',
      },
    ],
  },
  {
    title: 'Domains',
    href: '/docs/domains',
    children: [
      {
        title: 'Working with Domains',
        href: '/docs/domains/working-with-domains',
      },
      { title: 'Working with DNS', href: '/docs/domains/working-with-dns' },
      { title: 'Working with SSL', href: '/docs/domains/working-with-ssl' },
    ],
  },
  {
    title: 'CLI',
    href: '/docs/cli',
    children: [
      { title: 'Deploy Command', href: '/docs/cli/deploy' },
      { title: 'Dev Command', href: '/docs/cli/dev' },
      { title: 'Build Command', href: '/docs/cli/build' },
    ],
  },
  {
    title: 'Analytics',
    href: '/docs/analytics',
    children: [{ title: 'Quickstart', href: '/docs/analytics/quickstart' }],
  },
  {
    title: 'Speed Insights',
    href: '/docs/speed-insights',
    children: [
      { title: 'Quickstart', href: '/docs/speed-insights/quickstart' },
    ],
  },
];

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({
  isOpen,
  onClose,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  // Close mobile nav when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Auto-expand section containing current page
  useEffect(() => {
    const currentSection = navigationStructure.find(
      (section) =>
        section.href === pathname ||
        section.children?.some((child) => child.href === pathname),
    );

    if (currentSection) {
      setExpandedSections(
        (prev) => new Set([...Array.from(prev), currentSection.title]),
      );
    }
  }, [pathname]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const isCurrentPage = (href: string) => pathname === href;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile navigation panel */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Documentation
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close navigation"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {navigationStructure.map((section) => {
                const isExpanded = expandedSections.has(section.title);
                const hasChildren =
                  section.children && section.children.length > 0;

                return (
                  <div key={section.title}>
                    {/* Section header */}
                    <div className="flex items-center">
                      <Link
                        href={section.href}
                        className={`flex-1 flex items-center py-2 px-3 text-sm rounded-lg transition-colors ${
                          isCurrentPage(section.href)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="font-medium">{section.title}</span>
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={() => toggleSection(section.title)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title}`}
                        >
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
                        </button>
                      )}
                    </div>

                    {/* Section children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {section.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                              isCurrentPage(child.href)
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>webduh Documentation</span>
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for controlling mobile navigation
export function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);
  const toggleNav = () => setIsOpen((prev) => !prev);

  return { isOpen, openNav, closeNav, toggleNav };
}
