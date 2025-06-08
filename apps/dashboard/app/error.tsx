'use client';

// TODO: confirm version & license.
import React, { useEffect } from 'react';

// TODO: confirm version & license.
import Link from 'next/link';

/* --- embedded utilities --- */
// Heroicons v2.0.18 MIT License (https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
// SVG icon components inlined for self-containment.

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

function ArrowPathIcon({ className = '', ...props }: IconProps) {
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
        d="M4.5 12a7.5 7.5 0 017.5-7.5c2.485 0 4.71 1.14 6.15 2.925M19.5 12a7.5 7.5 0 01-7.5 7.5c-2.485 0-4.71-1.14-6.15-2.925M4.5 12H2.25m0 0v-2.25m0 2.25v2.25M19.5 12h2.25m0 0v-2.25m0 2.25v2.25"
      />
    </svg>
  );
}

function ExclamationTriangleIcon({ className = '', ...props }: IconProps) {
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
        d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm9.401-2.034a1.5 1.5 0 00.133-1.316l-7.5-13.5a1.5 1.5 0 00-2.668 0l-7.5 13.5a1.5 1.5 0 00.133 1.316A1.5 1.5 0 003.75 18h16.5a1.5 1.5 0 001.151-2.534z"
      />
    </svg>
  );
}

function BugAntIcon({ className = '', ...props }: IconProps) {
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
        d="M12 3v1.5m0 0a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5m9 0V9a4.5 4.5 0 00-4.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 014.5 4.5v1.5m-9 0V9a4.5 4.5 0 014.5-4.5m0 0V3m0 1.5V3m0 1.5a4.5 4.5 0 00-4.5 4.5v1.5"
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
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
        d="M19.5 14.25v-6.75A2.25 2.25 0 0017.25 5.25h-10.5A2.25 2.25 0 004.5 7.5v9A2.25 2.25 0 006.75 18.75h10.5A2.25 2.25 0 0019.5 16.5v-2.25"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9.75h6m-6 3h6m-6 3h6"
      />
    </svg>
  );
}

function FireIcon({ className = '', ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16.7 7.6c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7 1.2 1.2 1.9 2.8 1.9 4.5 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.2-4.2 3.1-5.3.2-.1.3-.4.2-.6-.1-.2-.4-.3-.6-.2C5.7 7.2 4.5 9.5 4.5 12c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5c0-2.1-.8-4-2.3-5.4z" />
      <path d="M12.7 2.3c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7 1.7 1.7 2.7 4 2.7 6.5 0 2.5-2 4.5-4.5 4.5-.3 0-.5.2-.5.5s.2.5.5.5c3 0 5.5-2.5 5.5-5.5 0-2.8-1.1-5.4-3-7.2z" />
    </svg>
  );
}

/* --- end embedded utilities --- */

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

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

        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-error-600 dark:text-error-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We encountered an unexpected error. Don't worry, our team has been
            notified.
          </p>

          {/* Development Error Details */}
          {isDevelopment && (
            <div className="mt-4 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <BugAntIcon className="h-4 w-4 text-error-600 dark:text-error-400 mr-2" />
                <span className="text-sm font-medium text-error-900 dark:text-error-100">
                  Development Error
                </span>
              </div>
              <p className="text-xs text-error-800 dark:text-error-200 font-mono text-left bg-error-100 dark:bg-error-900/40 p-2 rounded border">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={reset}
            className="flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Helpful Resources */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help debugging?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link
              href="/docs/troubleshooting"
              className="flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              Troubleshooting
            </Link>

            <a
              href="mailto:support@webduh.com"
              className="flex items-center justify-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              Contact Support
            </a>
          </div>
        </div>

        {/* Status Page Link */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Check our{' '}
            <a
              href="https://status.webduh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              status page
            </a>{' '}
            for any ongoing issues or maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}
