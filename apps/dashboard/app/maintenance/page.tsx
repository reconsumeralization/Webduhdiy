'use client';

// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Heroicons (Outline & Solid) - Inlined SVG React components

function WrenchScrewdriverIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536l-7.5 7.5a2.5 2.5 0 01-3.536-3.536l7.5-7.5zm-7.5 7.5l-3.536-3.536m5.036 2.036a2.5 2.5 0 01-3.536-3.536l7.5-7.5a2.5 2.5 0 013.536 3.536l-7.5 7.5z"
      />
    </svg>
  );
}

function ClockIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ChatBubbleLeftRightIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3h6m-6 3h3m-6 3.75V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25z"
      />
    </svg>
  );
}

function FireIcon({ className = '' }) {
  // Solid style
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.62 7.992c.13.31.25.63.35.96.19.62.29 1.28.29 1.97 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-.69.1-1.35.29-1.97.1-.33.22-.65.35-.96C7.13 9.36 6 11.05 6 13c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.95-1.13-3.64-2.38-5.008z" />
      <path d="M12 2C9.243 5.243 8 8.243 8 11c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-1.243-5.757-4-9z" />
    </svg>
  );
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* webduh Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <FireIcon className="h-12 w-12 text-primary-600" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-warning-500 rounded-full animate-pulse"></div>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
            webduh
          </span>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center mb-4">
            <WrenchScrewdriverIcon className="h-8 w-8 text-warning-600 dark:text-warning-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Under Maintenance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We're performing scheduled maintenance to improve your experience.
          </p>
        </div>

        {/* Estimated Time */}
        <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="h-5 w-5 text-warning-600 dark:text-warning-400 mr-2" />
            <span className="text-sm font-medium text-warning-900 dark:text-warning-100">
              Estimated Completion
            </span>
          </div>
          <p className="text-warning-800 dark:text-warning-200 font-mono text-lg">
            ~30 minutes
          </p>
        </div>

        {/* What's Being Updated */}
        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            What we're working on:
          </h3>

          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                Database optimizations
              </span>
            </div>

            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                Performance improvements
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-warning-500 border-t-transparent rounded-full animate-spin mr-3 flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Security updates
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-gray-500 dark:text-gray-500">
                Final testing
              </span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-center mb-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Need immediate assistance?
            </span>
          </div>

          <a
            href="mailto:support@webduh.com"
            className="inline-flex items-center px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            Contact Emergency Support
          </a>
        </div>

        {/* Status Updates */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Follow{' '}
            <a
              href="https://status.webduh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              @webduh_status
            </a>{' '}
            for real-time updates or check our{' '}
            <a
              href="https://status.webduh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              status page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
