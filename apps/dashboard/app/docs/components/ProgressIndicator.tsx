import React from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  href: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  steps: Step[];
  title?: string;
  className?: string;
}

export default function ProgressIndicator({
  steps,
  title = 'Progress',
  className = '',
}: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.status === 'current');
  const completedSteps = steps.filter(
    (step) => step.status === 'completed',
  ).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            {completedSteps} of {steps.length} completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-3 h-3 bg-current rounded-full" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-8 left-4 w-px h-6 transform -translate-x-1/2 ${
                      isCompleted || isCurrent
                        ? 'bg-green-300 dark:bg-green-700'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                {step.href ? (
                  <Link
                    href={step.href}
                    className={`block group ${
                      isCompleted || isCurrent
                        ? 'cursor-pointer'
                        : 'cursor-default pointer-events-none'
                    }`}
                  >
                    <div
                      className={`font-medium ${
                        isCompleted
                          ? 'text-green-900 dark:text-green-100 group-hover:text-green-700 dark:group-hover:text-green-300'
                          : isCurrent
                            ? 'text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400'
                      } transition-colors`}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div
                        className={`text-sm mt-1 ${
                          isCompleted || isCurrent
                            ? 'text-gray-600 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {step.description}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div>
                    <div
                      className={`font-medium ${
                        isCompleted
                          ? 'text-green-900 dark:text-green-100'
                          : isCurrent
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div
                        className={`text-sm mt-1 ${
                          isCompleted || isCurrent
                            ? 'text-gray-600 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex-shrink-0">
                {isCompleted && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Done
                  </span>
                )}
                {isCurrent && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next step suggestion */}
      {currentStepIndex < steps.length - 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Next up:
          </div>
          <Link
            href={steps[currentStepIndex + 1]?.href || '#'}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>{steps[currentStepIndex + 1]?.title}</span>
            <svg
              className="w-4 h-4"
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
          </Link>
        </div>
      )}
    </div>
  );
}

// Helper function to create step data for getting started guides
export function createGettingStartedSteps(currentPath: string) {
  const gettingStartedSteps = [
    {
      id: 'overview',
      title: 'Getting Started',
      href: '/docs/getting-started-with-webduh',
      description: 'Learn the basics of webduh',
    },
    {
      id: 'projects',
      title: 'Projects & Deployments',
      href: '/docs/getting-started-with-webduh/projects-deployments',
      description: 'Understand core concepts',
    },
    {
      id: 'template',
      title: 'Use a Template',
      href: '/docs/getting-started-with-webduh/template',
      description: 'Quick start with templates',
    },
    {
      id: 'import',
      title: 'Import Project',
      href: '/docs/getting-started-with-webduh/import',
      description: 'Bring existing projects',
    },
    {
      id: 'domain',
      title: 'Add Domain',
      href: '/docs/getting-started-with-webduh/domains',
      description: 'Custom domain setup',
    },
    {
      id: 'collaborate',
      title: 'Collaborate',
      href: '/docs/getting-started-with-webduh/collaborate',
      description: 'Team collaboration',
    },
  ];

  // Determine status based on current path
  return gettingStartedSteps.map((step, index) => {
    const currentIndex = gettingStartedSteps.findIndex(
      (s) => s.href === currentPath,
    );

    let status: 'completed' | 'current' | 'upcoming';
    if (index < currentIndex) {
      status = 'completed';
    } else if (index === currentIndex) {
      status = 'current';
    } else {
      status = 'upcoming';
    }

    return { ...step, status };
  });
}
