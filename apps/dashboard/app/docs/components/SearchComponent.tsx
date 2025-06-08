'use client';

// TODO: confirm version & license.
import * as React from 'react';
// TODO: confirm version & license.
import { useRouter } from 'next/navigation';

/* ---- embedded utilities ---- */
// None required; all logic is self-contained and React/next/navigation are imported above.

interface SearchResult {
  title: string;
  path: string;
  description: string;
  section: string;
}

const searchData: SearchResult[] = [
  // Getting Started
  {
    title: 'Getting Started',
    path: '/docs/getting-started-with-webduh',
    description: 'Learn how to deploy your first project with webduh',
    section: 'Getting Started',
  },
  {
    title: 'Projects and Deployments',
    path: '/docs/getting-started-with-webduh/projects-deployments',
    description: 'Understand the core concepts of projects and deployments',
    section: 'Getting Started',
  },
  {
    title: 'Use a Template',
    path: '/docs/getting-started-with-webduh/template',
    description: 'Deploy quickly with pre-built templates',
    section: 'Getting Started',
  },
  {
    title: 'Import Existing Project',
    path: '/docs/getting-started-with-webduh/import',
    description: 'Bring your existing projects to webduh',
    section: 'Getting Started',
  },

  // Frameworks
  {
    title: 'Next.js',
    path: '/docs/frameworks/nextjs',
    description: 'Deploy Next.js applications with zero configuration',
    section: 'Frameworks',
  },
  {
    title: 'React',
    path: '/docs/frameworks/create-react-app',
    description: 'Deploy React applications built with Create React App',
    section: 'Frameworks',
  },
  {
    title: 'Vue.js',
    path: '/docs/frameworks/nuxt',
    description: 'Deploy Vue.js applications with Nuxt framework',
    section: 'Frameworks',
  },
  {
    title: 'Svelte',
    path: '/docs/frameworks/sveltekit',
    description: 'Deploy SvelteKit applications with full SSR support',
    section: 'Frameworks',
  },
  {
    title: 'Astro',
    path: '/docs/frameworks/astro',
    description: 'Deploy Astro sites with optimal performance',
    section: 'Frameworks',
  },

  // Functions
  {
    title: 'Functions',
    path: '/docs/functions',
    description: 'Serverless functions and API routes',
    section: 'Advanced Features',
  },
  {
    title: 'Node.js Runtime',
    path: '/docs/functions/runtimes/node-js',
    description: 'Run serverless functions with Node.js',
    section: 'Advanced Features',
  },
  {
    title: 'Python Runtime',
    path: '/docs/functions/runtimes/python',
    description: 'Run serverless functions with Python',
    section: 'Advanced Features',
  },
  {
    title: 'Edge Runtime',
    path: '/docs/functions/runtimes/edge',
    description: 'Ultra-fast edge functions',
    section: 'Advanced Features',
  },

  // Domains
  {
    title: 'Domains',
    path: '/docs/domains',
    description: 'Custom domains, SSL certificates, and DNS management',
    section: 'Infrastructure',
  },
  {
    title: 'Working with DNS',
    path: '/docs/domains/working-with-dns',
    description: 'Configure DNS records for your domain',
    section: 'Infrastructure',
  },
  {
    title: 'SSL Certificates',
    path: '/docs/domains/working-with-ssl',
    description: 'Secure your domains with SSL/TLS',
    section: 'Infrastructure',
  },

  // CLI
  {
    title: 'CLI',
    path: '/docs/cli',
    description: 'Command line interface for deploying and managing projects',
    section: 'Tools',
  },
  {
    title: 'Deploy Command',
    path: '/docs/cli/deploy',
    description: 'Deploy your project from the command line',
    section: 'Tools',
  },
  {
    title: 'Dev Command',
    path: '/docs/cli/dev',
    description: 'Start a local development server',
    section: 'Tools',
  },

  // More can be added...
];

export default function SearchComponent() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Search functionality
  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filteredResults = searchData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 8); // Limit to 8 results

    setResults(filteredResults);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }

      // Arrow navigation when search is open
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSelect(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.path);
    setIsOpen(false);
    setQuery('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-64"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded border">
          ⌘K
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
            {/* Search input */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1 py-4 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoComplete="off"
              />
            </div>

            {/* Search results */}
            <div ref={resultsRef} className="max-h-80 overflow-y-auto">
              {query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}

              {results.map((result, index) => (
                <button
                  key={result.path}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                    index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {result.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.section}
                      </div>
                    </div>
                    <div className="ml-4 text-gray-400">
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
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            {query.length < 2 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Start typing to search...</span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      ↑↓
                    </kbd>
                    <span>to navigate</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      ↵
                    </kbd>
                    <span>to select</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      esc
                    </kbd>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
