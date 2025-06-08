'use client';

// TODO: confirm version & license.
import * as React from 'react';

// TODO: confirm version & license.
type ComponentType<P = {}> = React.ComponentType<P>;

/* ---- embedded utilities ---- */
// Heroicons v2.0.18 (MIT) - https://github.com/tailwindlabs/heroicons
// Only the required outline icons are embedded below.

function CommandLineIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.5 8.25l6 6-6 6M20.25 6.75v10.5"
      />
    </svg>
  );
}

function DocumentDuplicateIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 8.25V6A2.25 2.25 0 0014.25 3.75h-7.5A2.25 2.25 0 004.5 6v12A2.25 2.25 0 006.75 20.25h7.5A2.25 2.25 0 0016.5 18v-2.25M9.75 12h7.5m0 0l-3-3m3 3l-3 3"
      />
    </svg>
  );
}

function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
      />
    </svg>
  );
}

function CodeBracketIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.242 7.757l3.536 3.536a2.25 2.25 0 010 3.182l-3.536 3.536M7.757 16.243l-3.536-3.536a2.25 2.25 0 010-3.182l3.536-3.536"
      />
    </svg>
  );
}

function BookOpenIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.75c-2.485 0-4.5 2.015-4.5 4.5v6.75m9 0V11.25c0-2.485-2.015-4.5-4.5-4.5m0 0V3.75m0 3v0"
      />
    </svg>
  );
}

function ChatBubbleLeftRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7.5 8.25h9m-9 3h6m-6 3h3m-6 3.75V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25z"
      />
    </svg>
  );
}

interface QuickAction {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = '' }: QuickActionsProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const actions: QuickAction[] = [
    {
      icon: CommandLineIcon,
      title: 'Install Webduh CLI',
      description: 'Get started with the command line interface',
      action: () => copyToClipboard('npm install -g @webduh/cli', 'cli'),
      shortcut: '⌘ + I',
    },
    {
      icon: PlayIcon,
      title: 'Deploy Now',
      description: 'Deploy your project in seconds',
      action: () => copyToClipboard('webduh --prod', 'deploy'),
      shortcut: '⌘ + D',
    },
    {
      icon: CodeBracketIcon,
      title: 'View Examples',
      description: 'Browse sample projects and templates',
      action: () => window.open('/docs/examples', '_blank'),
      shortcut: '⌘ + E',
    },
    {
      icon: BookOpenIcon,
      title: 'API Reference',
      description: 'Complete REST API documentation',
      action: () => window.open('/docs/rest-api', '_blank'),
      shortcut: '⌘ + A',
    },
    {
      icon: DocumentDuplicateIcon,
      title: 'Quick Start',
      description: 'Deploy your first project',
      action: () => window.open('/docs/getting-started-with-webduh', '_blank'),
      shortcut: '⌘ + Q',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Get Help',
      description: 'Join our community Discord',
      action: () => window.open('https://discord.gg/webduh', '_blank'),
      shortcut: '⌘ + H',
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        // Only show "Copied" for the first two actions (copy actions)
        const isCopied =
          copied === (index === 0 ? 'cli' : index === 1 ? 'deploy' : '');

        return (
          <button
            key={action.title}
            onClick={action.action}
            className="group relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left"
            type="button"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>
              {action.shortcut && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {action.shortcut}
                  </span>
                </div>
              )}
            </div>

            {isCopied && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Copied to clipboard!
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
