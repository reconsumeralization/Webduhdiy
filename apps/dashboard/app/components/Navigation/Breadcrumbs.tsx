'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route mappings for automatic breadcrumb generation
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  projects: 'Projects',
  analytics: 'Analytics',
  domains: 'Domains',
  ai: '10X AI Features',
  team: 'Team',
  docs: 'Documentation',
  settings: 'Settings',
  new: 'Create New',
  edit: 'Edit',
  templates: 'Templates',
  import: 'Import',
  performance: 'Performance',
  realtime: 'Real-time',
  reports: 'Reports',
  add: 'Add',
  dns: 'DNS Records',
  ssl: 'SSL Certificates',
  optimizer: 'Performance Optimizer',
  scaling: 'Predictive Scaling',
  deployment: 'Smart Deployment',
  analysis: 'Code Analysis',
  permissions: 'Permissions',
  activity: 'Activity',
  'getting-started-with-webduh': 'Getting Started',
  deployments: 'Deployments',
  functions: 'Functions',
  cli: 'CLI',
  'rest-api': 'API Reference',
  security: 'Security',
  billing: 'Billing',
  integrations: 'Integrations',
};

export default function Breadcrumbs({
  items,
  className = '',
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2" />
              )}

              {isFirst ? (
                <Link
                  href={item.href || '/'}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ) : isLast ? (
                <span
                  className="text-gray-900 dark:text-white font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/',
  });

  // Build breadcrumbs from path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = routeLabels[segment] || formatSegment(segment);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast,
    });
  });

  return breadcrumbs;
}

function formatSegment(segment: string): string {
  // Handle UUIDs or IDs
  if (segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) {
    return 'Details';
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Enhanced breadcrumbs with custom styling and icons
interface EnhancedBreadcrumbsProps extends BreadcrumbsProps {
  showBackground?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function EnhancedBreadcrumbs({
  items,
  className = '',
  showBackground = false,
  size = 'md',
}: EnhancedBreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const backgroundClasses = showBackground
    ? 'bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700'
    : '';

  return (
    <nav
      className={`flex items-center space-x-2 ${sizeClasses[size]} ${backgroundClasses} ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  className={`text-gray-400 dark:text-gray-500 mx-2 ${
                    size === 'sm'
                      ? 'h-3 w-3'
                      : size === 'lg'
                        ? 'h-5 w-5'
                        : 'h-4 w-4'
                  }`}
                />
              )}

              {isFirst ? (
                <Link
                  href={item.href || '/'}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
                >
                  <HomeIcon
                    className={`mr-1 group-hover:scale-110 transition-transform ${
                      size === 'sm'
                        ? 'h-3 w-3'
                        : size === 'lg'
                          ? 'h-5 w-5'
                          : 'h-4 w-4'
                    }`}
                  />
                  {size !== 'sm' && (
                    <span className="sr-only">{item.label}</span>
                  )}
                </Link>
              ) : isLast ? (
                <span
                  className="text-gray-900 dark:text-white font-medium px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
