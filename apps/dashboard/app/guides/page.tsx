'use client';

// TODO: confirm version & license.
import React, { useState } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import {
  BookOpenIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  CogIcon,
  ShieldCheckIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

/* ---- embedded utilities ---- */
type DashboardLayoutProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

function DashboardLayout({
  title,
  description,
  headerActions,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="mt-4 md:mt-0">{headerActions}</div>
            )}
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
/* ---- end embedded utilities ---- */

const guides = [
  {
    id: 'getting-started',
    title: 'Getting Started with Webduh',
    description: 'Learn the basics of deploying your first project',
    icon: RocketLaunchIcon,
    category: 'Quick Start',
    difficulty: 'Beginner',
    duration: '10 min',
    featured: true,
    steps: 5,
    href: '/docs/getting-started-with-webduh',
  },
  {
    id: 'nextjs-deployment',
    title: 'Deploy a Next.js App',
    description: 'Step-by-step guide to deploy your Next.js application',
    icon: CodeBracketIcon,
    category: 'Frameworks',
    difficulty: 'Beginner',
    duration: '15 min',
    featured: true,
    steps: 7,
    href: '/docs/frameworks/nextjs',
  },
  {
    id: 'custom-domains',
    title: 'Adding Custom Domains',
    description: 'Configure custom domains and SSL certificates',
    icon: GlobeAltIcon,
    category: 'Domains',
    difficulty: 'Intermediate',
    duration: '20 min',
    featured: false,
    steps: 8,
    href: '/docs/domains',
  },
  {
    id: 'environment-variables',
    title: 'Environment Variables',
    description: 'Manage environment variables across deployments',
    icon: CogIcon,
    category: 'Configuration',
    difficulty: 'Beginner',
    duration: '8 min',
    featured: false,
    steps: 4,
    href: '/docs/environment-variables',
  },
  {
    id: 'cli-setup',
    title: 'CLI Installation & Setup',
    description: 'Install and configure the Webduh CLI tool',
    icon: CommandLineIcon,
    category: 'CLI',
    difficulty: 'Beginner',
    duration: '12 min',
    featured: true,
    steps: 6,
    href: '/docs/cli',
  },
  {
    id: 'security-headers',
    title: 'Security Headers Configuration',
    description: 'Implement security best practices with headers',
    icon: ShieldCheckIcon,
    category: 'Security',
    difficulty: 'Advanced',
    duration: '25 min',
    featured: false,
    steps: 10,
    href: '/docs/headers/security-headers',
  },
  {
    id: 'edge-functions',
    title: 'Edge Functions Guide',
    description: 'Build and deploy serverless functions at the edge',
    icon: CodeBracketIcon,
    category: 'Functions',
    difficulty: 'Intermediate',
    duration: '30 min',
    featured: true,
    steps: 12,
    href: '/docs/functions',
  },
  {
    id: 'redirects-rewrites',
    title: 'Redirects & Rewrites',
    description: 'Configure URL redirects and rewrites',
    icon: ArrowRightIcon,
    category: 'Configuration',
    difficulty: 'Intermediate',
    duration: '18 min',
    featured: false,
    steps: 6,
    href: '/docs/redirects',
  },
];

const categories = [
  'All',
  'Quick Start',
  'Frameworks',
  'Domains',
  'Configuration',
  'CLI',
  'Security',
  'Functions',
];

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || guide.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredGuides = guides.filter((guide) => guide.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout
      title="Guides & Tutorials"
      description="Learn how to make the most of Webduh with our comprehensive guides"
      headerActions={
        <Link
          href="/docs"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <BookOpenIcon className="h-4 w-4 mr-2" />
          Browse Docs
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Featured Guides */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Featured Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link key={guide.id} href={guide.href} className="group">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Featured
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {guide.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{guide.duration}</span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}
                        >
                          {guide.difficulty}
                        </span>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Guides */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Guides
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredGuides.length} guide
              {filteredGuides.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-4">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link key={guide.id} href={guide.href} className="group">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
                        <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {guide.category}
                              </span>
                              {guide.featured && (
                                <StarIcon className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                              {guide.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {guide.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>{guide.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <PlayIcon className="h-4 w-4" />
                                <span>{guide.steps} steps</span>
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}
                              >
                                {guide.difficulty}
                              </span>
                            </div>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No guides found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
