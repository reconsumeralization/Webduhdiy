'use client';

// TODO: confirm version & license.
import React, { useState } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import {
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
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

// Template data with complete information
const templates = [
  {
    id: 'nextjs',
    name: 'Next.js App',
    description:
      'Modern React framework with SSR, API routes, and built-in optimization for production-ready applications',
    detailedDescription:
      'A complete Next.js application template featuring TypeScript, Tailwind CSS, ESLint configuration, and optimized build settings. Includes example pages, components, and API routes to get you started quickly.',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '2-3 min',
    featured: true,
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'ESLint',
      'Prettier',
    ],
    demoUrl: 'https://nextjs-template.webduh.app',
    githubUrl: 'https://github.com/webduh/nextjs-template',
    preview: '/templates/nextjs-preview.png',
    features: [
      'Server-side rendering',
      'API routes',
      'TypeScript support',
      'Tailwind CSS styling',
      'SEO optimized',
      'Performance optimized',
    ],
    useCase:
      'Perfect for modern web applications requiring SSR, e-commerce sites, blogs, and marketing websites.',
    stats: {
      downloads: 15420,
      stars: 892,
      deployments: 3240,
    },
  },
  {
    id: 'react-vite',
    name: 'React + Vite',
    description:
      'Lightning-fast React development with Vite bundler, TypeScript, and modern tooling',
    detailedDescription:
      'A modern React application template powered by Vite for ultra-fast development experience. Includes TypeScript, CSS Modules, and essential development tools configured out of the box.',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '1-2 min',
    featured: true,
    technologies: ['React', 'Vite', 'TypeScript', 'CSS Modules', 'ESLint'],
    demoUrl: 'https://react-vite-template.webduh.app',
    githubUrl: 'https://github.com/webduh/react-vite-template',
    preview: '/templates/react-preview.png',
    features: [
      'Lightning-fast HMR',
      'TypeScript support',
      'CSS Modules',
      'ESLint configuration',
      'Vite bundler',
      'Modern React patterns',
    ],
    useCase:
      'Ideal for SPAs, admin dashboards, and applications requiring fast development iteration.',
    stats: {
      downloads: 12850,
      stars: 654,
      deployments: 2890,
    },
  },
  {
    id: 'nodejs-express',
    name: 'Node.js Express API',
    description:
      'Robust REST API with Express.js, authentication, database integration, and comprehensive documentation',
    detailedDescription:
      'A production-ready Node.js API template with Express.js framework, JWT authentication, MongoDB integration, request validation, error handling, and Swagger documentation.',
    icon: CommandLineIcon,
    category: 'Backend',
    difficulty: 'Intermediate',
    buildTime: '3-4 min',
    featured: true,
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Swagger', 'Joi'],
    demoUrl: 'https://nodejs-api-template.webduh.app',
    githubUrl: 'https://github.com/webduh/nodejs-api-template',
    preview: '/templates/nodejs-preview.png',
    features: [
      'JWT Authentication',
      'MongoDB integration',
      'Request validation',
      'Error handling',
      'Swagger documentation',
      'CORS configuration',
    ],
    useCase:
      'Perfect for microservices, mobile app backends, and web application APIs.',
    stats: {
      downloads: 8940,
      stars: 421,
      deployments: 1650,
    },
  },
  {
    id: 'static-html',
    name: 'Static Website',
    description:
      'Clean, responsive static website with modern CSS, JavaScript, and optimized performance',
    detailedDescription:
      'A beautifully designed static website template with responsive design, modern CSS Grid and Flexbox, vanilla JavaScript for interactions, and optimized assets for fast loading.',
    icon: GlobeAltIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '30s',
    featured: false,
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Font Awesome'],
    demoUrl: 'https://static-template.webduh.app',
    githubUrl: 'https://github.com/webduh/static-template',
    preview: '/templates/static-preview.png',
    features: [
      'Responsive design',
      'Modern CSS Grid',
      'Smooth animations',
      'SEO optimized',
      'Fast loading',
      'Cross-browser compatible',
    ],
    useCase:
      'Great for landing pages, portfolios, documentation sites, and company websites.',
    stats: {
      downloads: 6780,
      stars: 234,
      deployments: 4120,
    },
  },
  {
    id: 'vue-nuxt',
    name: 'Vue.js Nuxt',
    description:
      'Modern Vue.js application with Nuxt.js framework, TypeScript, and server-side rendering',
    detailedDescription:
      'A complete Vue.js application template using Nuxt.js framework with TypeScript, Pinia state management, Vue Router, and server-side rendering capabilities.',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Intermediate',
    buildTime: '2-3 min',
    featured: false,
    technologies: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Pinia', 'Vue Router'],
    demoUrl: 'https://vue-nuxt-template.webduh.app',
    githubUrl: 'https://github.com/webduh/vue-nuxt-template',
    preview: '/templates/vue-preview.png',
    features: [
      'Vue 3 Composition API',
      'Server-side rendering',
      'TypeScript support',
      'Pinia state management',
      'Auto-imports',
      'SEO optimized',
    ],
    useCase:
      'Excellent for Vue.js applications requiring SSR, e-commerce sites, and content-heavy websites.',
    stats: {
      downloads: 4520,
      stars: 198,
      deployments: 890,
    },
  },
  {
    id: 'svelte-kit',
    name: 'SvelteKit',
    description:
      'Fast, modern web application with SvelteKit framework and server-side rendering',
    detailedDescription:
      'A SvelteKit application template with TypeScript, Tailwind CSS, and server-side rendering. Includes example routes, components, and optimized build configuration.',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Intermediate',
    buildTime: '2-3 min',
    featured: false,
    technologies: ['Svelte', 'SvelteKit', 'TypeScript', 'Tailwind CSS'],
    demoUrl: 'https://sveltekit-template.webduh.app',
    githubUrl: 'https://github.com/webduh/sveltekit-template',
    preview: '/templates/svelte-preview.png',
    features: [
      'Svelte components',
      'Server-side rendering',
      'TypeScript support',
      'Tailwind CSS',
      'File-based routing',
      'Optimized builds',
    ],
    useCase:
      'Perfect for high-performance web applications with minimal bundle sizes.',
    stats: {
      downloads: 3240,
      stars: 167,
      deployments: 650,
    },
  },
  {
    id: 'python-fastapi',
    name: 'Python FastAPI',
    description:
      'High-performance Python API with FastAPI, async support, and automatic documentation',
    detailedDescription:
      'A modern Python API template using FastAPI framework with async support, Pydantic models, SQLAlchemy ORM, automatic OpenAPI documentation, and comprehensive testing setup.',
    icon: CommandLineIcon,
    category: 'Backend',
    difficulty: 'Intermediate',
    buildTime: '3-5 min',
    featured: false,
    technologies: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'PostgreSQL'],
    demoUrl: 'https://fastapi-template.webduh.app',
    githubUrl: 'https://github.com/webduh/fastapi-template',
    preview: '/templates/fastapi-preview.png',
    features: [
      'Async/await support',
      'Automatic documentation',
      'Type hints',
      'SQLAlchemy ORM',
      'Pydantic validation',
      'High performance',
    ],
    useCase:
      'Ideal for high-performance APIs, machine learning services, and data processing applications.',
    stats: {
      downloads: 2890,
      stars: 143,
      deployments: 520,
    },
  },
  {
    id: 'fullstack-t3',
    name: 'Full-Stack T3',
    description:
      'Complete full-stack application with Next.js, tRPC, Prisma, and NextAuth authentication',
    detailedDescription:
      'The complete T3 stack template with Next.js, TypeScript, tRPC for type-safe APIs, Prisma for database management, NextAuth for authentication, and Tailwind CSS for styling.',
    icon: CodeBracketIcon,
    category: 'Full-Stack',
    difficulty: 'Advanced',
    buildTime: '5-7 min',
    featured: true,
    technologies: [
      'Next.js',
      'tRPC',
      'Prisma',
      'NextAuth',
      'TypeScript',
      'Tailwind CSS',
    ],
    demoUrl: 'https://t3-template.webduh.app',
    githubUrl: 'https://github.com/webduh/t3-template',
    preview: '/templates/t3-preview.png',
    features: [
      'Type-safe APIs',
      'Database ORM',
      'Authentication',
      'Server-side rendering',
      'End-to-end type safety',
      'Modern full-stack architecture',
    ],
    useCase:
      'Perfect for complex web applications requiring type safety, authentication, and database integration.',
    stats: {
      downloads: 1850,
      stars: 389,
      deployments: 420,
    },
  },
];

const categories = ['All', 'Frontend', 'Backend', 'Full-Stack'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Popular', 'Name', 'Recently Added', 'Build Time'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === 'All' || template.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        template.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Popular':
          return b.stats.downloads - a.stats.downloads;
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Build Time':
          return a.buildTime.localeCompare(b.buildTime);
        default:
          return 0;
      }
    });

  const featuredTemplates = templates.filter((t) => t.featured);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Backend':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Full-Stack':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <DashboardLayout
      title="Templates"
      description="Browse our collection of production-ready templates to jumpstart your next project"
      headerActions={
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <RocketLaunchIcon className="h-4 w-4 mr-2" />
          Create Project
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Featured Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(template.category)}`}
                          >
                            {template.category}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}
                          >
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{template.buildTime}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>
                        {formatNumber(template.stats.downloads)} downloads
                      </span>
                      <span>⭐ {template.stats.stars}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {template.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        +{template.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/projects/new?template=${template.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <RocketLaunchIcon className="h-4 w-4 mr-2" />
                      Deploy
                    </Link>
                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={template.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
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
                  placeholder="Search templates..."
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Templates ({filteredTemplates.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(template.category)}`}
                          >
                            {template.category}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}
                          >
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    {template.featured && (
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{template.buildTime}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>
                        {formatNumber(template.stats.downloads)} downloads
                      </span>
                      <span>⭐ {template.stats.stars}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {template.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        +{template.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/projects/new?template=${template.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <RocketLaunchIcon className="h-4 w-4 mr-2" />
                      Deploy
                    </Link>
                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={template.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No templates found
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
      </div>
    </DashboardLayout>
  );
}
