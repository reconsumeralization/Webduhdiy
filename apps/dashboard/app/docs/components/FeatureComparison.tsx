'use client';

// TODO: confirm version & license.
import React from 'react';

/* ---- embedded utilities ---- */
// Heroicons CheckIcon (Outline, 24px)
// Source: https://github.com/tailwindlabs/heroicons/blob/master/optimized/24/outline/check.svg
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

// Heroicons XMarkIcon (Outline, 24px)
// Source: https://github.com/tailwindlabs/heroicons/blob/master/optimized/24/outline/x-mark.svg
function XMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
/* ---- end embedded utilities ---- */

interface ComparisonFeature {
  name: string;
  webduh: boolean | string;
  vercel: boolean | string;
  netlify: boolean | string;
  description?: string;
}

interface FeatureComparisonProps {
  features: ComparisonFeature[];
  title?: string;
  className?: string;
}

export function FeatureComparison({
  features,
  title = 'Feature Comparison',
  className = '',
}: FeatureComparisonProps) {
  const renderFeatureValue = (
    value: boolean | string,
    highlight: boolean = false,
  ) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon
          className={`h-5 w-5 ${highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
        />
      ) : (
        <XMarkIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
      );
    }
    return (
      <span
        className={`text-sm ${highlight ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
      >
        {value}
      </span>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Feature
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Webduh
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vercel
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Netlify
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {features.map((feature, index) => (
              <tr
                key={feature.name}
                className={
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {feature.name}
                    </div>
                    {feature.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {feature.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.webduh, true)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.vercel)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderFeatureValue(feature.netlify)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
