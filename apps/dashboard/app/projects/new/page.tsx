'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  CloudIcon,
  BeakerIcon,
  CheckIcon,
  StarIcon,
  ClockIcon,
  CommandLineIcon,
  LinkIcon,
  PlayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

/* ---- embedded utilities ---- */
// DashboardLayout component stub for self-containment
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

// Template definitions
const templates = [
  {
    id: 'nextjs',
    name: 'Next.js',
    description:
      'Full-stack React framework with SSR, API routes, and built-in optimization',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '2-3 min',
    featured: true,
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    demoUrl: 'https://nextjs-template.webduh.app',
    githubUrl: 'https://github.com/webduh/nextjs-template',
    preview: '/templates/nextjs-preview.png',
  },
  {
    id: 'react',
    name: 'React App',
    description:
      'Modern React application with Vite, TypeScript, and essential tooling',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '1-2 min',
    featured: true,
    technologies: ['React', 'Vite', 'TypeScript', 'CSS Modules'],
    demoUrl: 'https://react-template.webduh.app',
    githubUrl: 'https://github.com/webduh/react-template',
    preview: '/templates/react-preview.png',
  },
  {
    id: 'nodejs-api',
    name: 'Node.js API',
    description:
      'Express.js REST API with authentication, database, and documentation',
    icon: CodeBracketIcon,
    category: 'Backend',
    difficulty: 'Intermediate',
    buildTime: '2-4 min',
    featured: true,
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    demoUrl: 'https://nodejs-api.webduh.app',
    githubUrl: 'https://github.com/webduh/nodejs-api-template',
    preview: '/templates/nodejs-preview.png',
  },
  {
    id: 'static-site',
    name: 'Static Website',
    description:
      'Clean, responsive static website with modern CSS and JavaScript',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Beginner',
    buildTime: '30s',
    featured: false,
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    demoUrl: 'https://static-template.webduh.app',
    githubUrl: 'https://github.com/webduh/static-template',
    preview: '/templates/static-preview.png',
  },
  {
    id: 'vue',
    name: 'Vue.js App',
    description:
      'Progressive Vue.js application with Composition API and Pinia state management',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Intermediate',
    buildTime: '2-3 min',
    featured: false,
    technologies: ['Vue.js', 'Pinia', 'Vue Router', 'TypeScript'],
    demoUrl: 'https://vue-template.webduh.app',
    githubUrl: 'https://github.com/webduh/vue-template',
    preview: '/templates/vue-preview.png',
  },
  {
    id: 'svelte',
    name: 'SvelteKit',
    description:
      'Fast, modern web app with SvelteKit and server-side rendering',
    icon: CodeBracketIcon,
    category: 'Frontend',
    difficulty: 'Intermediate',
    buildTime: '2-3 min',
    featured: false,
    technologies: ['Svelte', 'SvelteKit', 'TypeScript', 'Tailwind CSS'],
    demoUrl: 'https://svelte-template.webduh.app',
    githubUrl: 'https://github.com/webduh/svelte-template',
    preview: '/templates/svelte-preview.png',
  },
  {
    id: 'python-fastapi',
    name: 'Python FastAPI',
    description:
      'High-performance Python API with FastAPI, async support, and auto docs',
    icon: CodeBracketIcon,
    category: 'Backend',
    difficulty: 'Intermediate',
    buildTime: '3-5 min',
    featured: false,
    technologies: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy'],
    demoUrl: 'https://fastapi-template.webduh.app',
    githubUrl: 'https://github.com/webduh/fastapi-template',
    preview: '/templates/fastapi-preview.png',
  },
  {
    id: 'fullstack-trpc',
    name: 'Full-Stack T3',
    description:
      'Complete full-stack app with Next.js, tRPC, Prisma, and NextAuth',
    icon: CodeBracketIcon,
    category: 'Full-Stack',
    difficulty: 'Advanced',
    buildTime: '5-7 min',
    featured: true,
    technologies: ['Next.js', 'tRPC', 'Prisma', 'NextAuth', 'TypeScript'],
    demoUrl: 'https://t3-template.webduh.app',
    githubUrl: 'https://github.com/webduh/t3-template',
    preview: '/templates/t3-preview.png',
  },
];

const categories = ['All', 'Frontend', 'Backend', 'Full-Stack'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [deploymentMethod, setDeploymentMethod] = useState<
    'template' | 'github' | 'git'
  >('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentVars, setEnvironmentVars] = useState<
    { key: string; value: string }[]
  >([]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || template.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      template.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
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

  const addEnvironmentVar = () => {
    setEnvironmentVars([...environmentVars, { key: '', value: '' }]);
  };

  const updateEnvironmentVar = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const updated = [...environmentVars];
    updated[index][field] = value;
    setEnvironmentVars(updated);
  };

  const removeEnvironmentVar = (index: number) => {
    setEnvironmentVars(environmentVars.filter((_, i) => i !== index));
  };

  const handleDeploy = () => {
    // Simulate deployment
    const selectedTemplateData = templates.find(
      (t) => t.id === selectedTemplate,
    );
    console.log('Deploying project:', {
      method: deploymentMethod,
      template: selectedTemplateData,
      projectName,
      gitUrl,
      environmentVars,
    });

    // Redirect to project page (simulation)
    alert(
      `Successfully created project "${projectName}"!\n\nDeployment started...`,
    );
  };

  return (
    <DashboardLayout
      title="Create New Project"
      description="Deploy your application in minutes with our templates or connect your repository"
      headerActions={
        <Link
          href="/projects"
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      }
    >
      <div className="max-w-6xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        step > stepNumber
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 3
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1 && 'Choose deployment method'}
            {step === 2 && 'Select template or configure repository'}
            {step === 3 && 'Configure and deploy'}
          </div>
        </div>

        {/* Step 1: Deployment Method */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setDeploymentMethod('template')}
                className={`p-6 border-2 rounded-xl text-left transition-all ${
                  deploymentMethod === 'template'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      deploymentMethod === 'template'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <CodeBracketIcon
                      className={`h-6 w-6 ${
                        deploymentMethod === 'template'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Start with Template
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose from our curated templates with best practices built-in
                </p>
              </button>

              <button
                onClick={() => setDeploymentMethod('github')}
                className={`p-6 border-2 rounded-xl text-left transition-all ${
                  deploymentMethod === 'github'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      deploymentMethod === 'github'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <CommandLineIcon
                      className={`h-6 w-6 ${
                        deploymentMethod === 'github'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Import from GitHub
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Connect your GitHub repository for automatic deployments
                </p>
              </button>

              <button
                onClick={() => setDeploymentMethod('git')}
                className={`p-6 border-2 rounded-xl text-left transition-all ${
                  deploymentMethod === 'git'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      deploymentMethod === 'git'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <LinkIcon
                      className={`h-6 w-6 ${
                        deploymentMethod === 'git'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Import from Git
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Deploy from any Git repository URL (GitLab, Bitbucket, etc.)
                </p>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue
                <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection or Repository Configuration */}
        {step === 2 && (
          <div className="space-y-6">
            {deploymentMethod === 'template' && (
              <div className="space-y-8">
                {/* Featured Templates */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    ⭐ Featured Templates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedTemplate === template.id
                                    ? 'bg-blue-100 dark:bg-blue-900/20'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}
                              >
                                <Icon
                                  className={`h-6 w-6 ${
                                    selectedTemplate === template.id
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {template.name}
                                </h3>
                              </div>
                            </div>
                            <StarIcon className="h-5 w-5 text-yellow-500" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
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
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {template.buildTime} build time
                          </div>
                          <div className="flex flex-wrap gap-1">
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
                                +{template.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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

                {/* All Templates */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    All Templates ({filteredTemplates.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedTemplate === template.id
                                    ? 'bg-blue-100 dark:bg-blue-900/20'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}
                              >
                                <Icon
                                  className={`h-6 w-6 ${
                                    selectedTemplate === template.id
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {template.name}
                                </h3>
                              </div>
                            </div>
                            {template.featured && (
                              <StarIcon className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
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
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {template.buildTime} build time
                          </div>
                          <div className="flex flex-wrap gap-1">
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
                                +{template.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {(deploymentMethod === 'github' || deploymentMethod === 'git') && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {deploymentMethod === 'github'
                      ? 'Import from GitHub'
                      : 'Import from Git Repository'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Repository URL
                      </label>
                      <input
                        type="url"
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        placeholder={
                          deploymentMethod === 'github'
                            ? 'https://github.com/username/repository'
                            : 'https://gitlab.com/username/repository'
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {deploymentMethod === 'github' && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>GitHub Integration:</strong> Connect your
                          GitHub account for automatic deployments on every
                          push.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={
                  deploymentMethod === 'template' ? !selectedTemplate : !gitUrl
                }
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Configuration and Deploy */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {deploymentMethod === 'template' && selectedTemplate && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Selected Template
                    </h4>
                    {(() => {
                      const template = templates.find(
                        (t) => t.id === selectedTemplate,
                      );
                      if (template) {
                        const Icon = template.icon;
                        return (
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                              <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {template.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {(deploymentMethod === 'github' ||
                  deploymentMethod === 'git') &&
                  gitUrl && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Repository
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                          <CommandLineIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {gitUrl}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Auto-deploy on push
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Environment Variables
                </h3>
                <button
                  onClick={addEnvironmentVar}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Variable
                </button>
              </div>
              {environmentVars.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No environment variables configured. Add variables that your
                  application needs.
                </p>
              ) : (
                <div className="space-y-3">
                  {environmentVars.map((envVar, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="KEY"
                        value={envVar.key}
                        onChange={(e) =>
                          updateEnvironmentVar(index, 'key', e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="VALUE"
                        value={envVar.value}
                        onChange={(e) =>
                          updateEnvironmentVar(index, 'value', e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={() => removeEnvironmentVar(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleDeploy}
                disabled={!projectName}
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Deploy Project
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
