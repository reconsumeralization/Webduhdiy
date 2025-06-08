'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import Link from 'next/link';

/* --- embedded utilities --- */
// Heroicons v2.0.18 MIT License (https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
// All icons below are inlined for self-containment.

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

function HomeIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 10.5V19a2.25 2.25 0 002.25 2.25h2.25m6 0h2.25A2.25 2.25 0 0019.5 19v-8.5m-15 0L12 3.75m0 0l7.5 7.5"
      />
    </svg>
  );
}

function DocumentTextIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25v-1.5M9 9.75h6m-6 3h6m-6 3h3"
      />
    </svg>
  );
}

function RocketLaunchIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37l-5.96-5.96a.75.75 0 01.53-1.28h2.12a.75.75 0 01.53.22l5.96 5.96a.75.75 0 01-1.06 1.06zm-2.12 2.12l-5.96-5.96a.75.75 0 01.22-.53v-2.12a.75.75 0 01.53-.22h2.12a.75.75 0 01.53.22l5.96 5.96a.75.75 0 01-1.06 1.06zm-2.12 2.12l-5.96-5.96a.75.75 0 01.22-.53v-2.12a.75.75 0 01.53-.22h2.12a.75.75 0 01.53.22l5.96 5.96a.75.75 0 01-1.06 1.06z"
      />
    </svg>
  );
}

function MagnifyingGlassIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
      />
    </svg>
  );
}

function CommandLineIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5l7.5-7.5-7.5-7.5m9 15h6"
      />
    </svg>
  );
}

function ChatBubbleLeftRightIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 10.5h.008v.008H7.5v-.008zm4.5 0h.008v.008H12v-.008zm4.5 0h.008v.008H16.5v-.008z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12c0 3.728 3.728 6.75 8.25 6.75.98 0 1.92-.13 2.8-.37l3.7 1.23a.75.75 0 00.95-.95l-1.23-3.7c.24-.88.37-1.82.37-2.8 0-4.522-3.022-8.25-6.75-8.25S2.25 7.478 2.25 12z"
      />
    </svg>
  );
}

// FireIcon (24x24, solid)
function FireIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 8.147a.75.75 0 0 1-.07 1.058A5.25 5.25 0 0 0 12 18.75a.75.75 0 0 1-1.5 0c0-1.31-.37-2.13-.77-2.74-.41-.62-.93-1.06-1.43-1.36a.75.75 0 0 1-.22-1.06c.36-.54.67-1.13.67-1.85 0-1.13-.81-2.01-1.62-2.7a.75.75 0 0 1-.19-.8c.36-1.13.98-2.13 1.7-2.98C9.98 4.13 10.99 3.25 12 2.25c.24.23.48.47.72.72 1.13 1.18 2.23 2.6 2.99 4.07a.75.75 0 0 1-.07.8c-.81.69-1.62 1.57-1.62 2.7 0 .72.31 1.31.67 1.85a.75.75 0 0 1-.22 1.06c-.5.3-1.02.74-1.43 1.36-.4.61-.77 1.43-.77 2.74a.75.75 0 0 1-1.5 0 5.25 5.25 0 0 0-4.637-9.545.75.75 0 0 1-.07-1.058A7.5 7.5 0 0 1 12 2.25c1.01 1 2.02 1.88 2.98 2.98.72.85 1.34 1.85 1.7 2.98a.75.75 0 0 1-.19.8c-.81.69-1.62 1.57-1.62 2.7 0 .72.31 1.31.67 1.85a.75.75 0 0 1-.22 1.06c-.5.3-1.02.74-1.43 1.36-.4.61-.77 1.43-.77 2.74a.75.75 0 0 1-1.5 0 5.25 5.25 0 0 0-4.637-9.545z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* webduh Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <FireIcon className="h-12 w-12 text-primary-600" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 rounded-full animate-pulse"></div>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
            webduh
          </span>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
            404
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Page Not Found
          </p>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>

          <Link
            href="/docs"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Documentation
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Popular destinations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <Link
              href="/projects"
              className="flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <RocketLaunchIcon className="h-4 w-4 mr-1" />
              Projects
            </Link>

            <Link
              href="/analytics"
              className="flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Analytics
            </Link>

            <Link
              href="/settings"
              className="flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <CommandLineIcon className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-center mb-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Need Help?
            </span>
          </div>
          <p className="text-xs text-primary-800 dark:text-primary-200">
            Check our documentation or contact support if you believe this is an
            error.
          </p>
        </div>
      </div>
    </div>
  );
}
