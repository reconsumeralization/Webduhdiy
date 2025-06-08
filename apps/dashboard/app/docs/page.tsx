import React from 'react';
import Link from 'next/link';
import SearchComponent from './components/SearchComponent';
import ThemeToggle from './components/ThemeToggle';
import CodeBlock from './components/CodeBlock';
import ProgressIndicator, {
  createGettingStartedSteps,
} from './components/ProgressIndicator';

export default function DocsPage() {
  const gettingStartedSteps = createGettingStartedSteps('/docs');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/docs" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                webduh
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                / docs
              </span>
            </Link>

            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <SearchComponent />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="https://github.com/webduh/webduh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              webduh Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Everything you need to deploy, scale, and manage your applications
              on the webduh platform. From quick starts to advanced
              configurations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/docs/getting-started-with-webduh"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/docs/frameworks"
                className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Browse Frameworks
              </Link>
            </div>

            {/* Mobile search */}
            <div className="md:hidden max-w-md mx-auto">
              <SearchComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Quick Start Guide */}
          <div className="lg:col-span-2">
            <div className="space-y-12">
              {/* Getting Started Progress */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🚀 Quick Start Guide
                </h2>
                <ProgressIndicator
                  steps={gettingStartedSteps}
                  title="Get up and running with webduh"
                />
              </div>

              {/* Popular Frameworks */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🛠️ Popular Frameworks
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Next.js',
                      href: '/docs/frameworks/nextjs',
                      description: 'Full-stack React framework',
                      icon: '⚛️',
                    },
                    {
                      name: 'SvelteKit',
                      href: '/docs/frameworks/sveltekit',
                      description: 'Modern web development',
                      icon: '🔥',
                    },
                    {
                      name: 'Astro',
                      href: '/docs/frameworks/astro',
                      description: 'Content-focused websites',
                      icon: '🚀',
                    },
                    {
                      name: 'Nuxt',
                      href: '/docs/frameworks/nuxt',
                      description: 'Vue.js framework',
                      icon: '💚',
                    },
                  ].map((framework) => (
                    <Link
                      key={framework.name}
                      href={framework.href}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{framework.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {framework.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {framework.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  ⚡ Deploy in Seconds
                </h2>
                <CodeBlock
                  language="bash"
                  filename="terminal"
                  showLineNumbers={false}
                >
                  {`# Install webduh CLI
npm i -g webduh

# Deploy your project
webduh deploy

# Your app is live!
https://your-app.webduh.app`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Navigation Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📚 Documentation Sections
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: 'Functions',
                    href: '/docs/functions',
                    description: 'Serverless functions',
                    emoji: '⚡',
                  },
                  {
                    title: 'Domains',
                    href: '/docs/domains',
                    description: 'Custom domains & DNS',
                    emoji: '🌐',
                  },
                  {
                    title: 'CLI',
                    href: '/docs/cli',
                    description: 'Command line tools',
                    emoji: '💻',
                  },
                  {
                    title: 'Analytics',
                    href: '/docs/analytics',
                    description: 'Web analytics',
                    emoji: '📊',
                  },
                  {
                    title: 'Environment Variables',
                    href: '/docs/environment-variables',
                    description: 'Config management',
                    emoji: '🔧',
                  },
                  {
                    title: 'Deployments',
                    href: '/docs/deployments',
                    description: 'Deploy & rollback',
                    emoji: '🚀',
                  },
                  {
                    title: 'Edge Network',
                    href: '/docs/edge-network',
                    description: 'Global CDN',
                    emoji: '🌍',
                  },
                  {
                    title: 'Security',
                    href: '/docs/security',
                    description: 'Enterprise security',
                    emoji: '🔒',
                  },
                ].map((section) => (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{section.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {section.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🤝 Need Help?
              </h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/webduh/webduh/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  💬 Community Discussions
                </a>
                <a
                  href="https://github.com/webduh/webduh/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  🐛 Report Issues
                </a>
                <Link
                  href="/docs/support"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  📧 Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  webduh
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                The platform for frontend developers. Deploy instantly, scale
                infinitely.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  { title: 'Features', href: '#' },
                  { title: 'Pricing', href: '#' },
                  { title: 'Templates', href: '#' },
                  { title: 'Integrations', href: '#' },
                ],
              },
              {
                title: 'Resources',
                links: [
                  { title: 'Documentation', href: '/docs' },
                  { title: 'Guides', href: '/docs/guides' },
                  { title: 'API Reference', href: '/docs/rest-api' },
                  { title: 'Examples', href: '#' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { title: 'About', href: '#' },
                  { title: 'Blog', href: '#' },
                  { title: 'Careers', href: '#' },
                  { title: 'Contact', href: '#' },
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 webduh. Built with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
