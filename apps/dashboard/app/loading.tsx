'use client';

// TODO: confirm version & license.
import React from 'react';

/* --- embedded utilities --- */
// Heroicons v2.0.18 MIT License (https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
// FireIcon (24x24, solid)
type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };
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

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <FireIcon className="h-12 w-12 text-primary-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary-500 rounded-full animate-ping"></div>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
            webduh
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 dark:text-gray-400 text-sm animate-pulse">
          Loading your dashboard...
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
