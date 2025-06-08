'use client';

import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FireIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
  { id: 1, name: 'Connect Repository', icon: CodeBracketIcon },
  { id: 2, name: 'Configure Settings', icon: Cog6ToothIcon },
  { id: 3, name: 'Deploy', icon: RocketLaunchIcon },
];

// Mock repositories data
const mockRepositories = [
  {
    id: 1,
    name: 'portfolio-v2',
    fullName: 'john/portfolio-v2',
    description: 'Personal portfolio website',
    updatedAt: '2 hours ago',
    private: false,
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'e-commerce-app',
    fullName: 'john/e-commerce-app',
    description: 'Full-stack e-commerce application',
    updatedAt: '1 day ago',
    private: true,
    language: 'JavaScript',
  },
  {
    id: 3,
    name: 'blog-cms',
    fullName: 'john/blog-cms',
    description: 'Headless CMS for blog',
    updatedAt: '3 days ago',
    private: false,
    language: 'TypeScript',
  },
];

const frameworks = [
  { id: 'nextjs', name: 'Next.js', preset: 'nextjs' },
  { id: 'react', name: 'Create React App', preset: 'create-react-app' },
  { id: 'vue', name: 'Vue.js', preset: 'vue' },
  { id: 'nuxt', name: 'Nuxt.js', preset: 'nuxtjs' },
  { id: 'svelte', name: 'SvelteKit', preset: 'svelte-kit' },
  { id: 'astro', name: 'Astro', preset: 'astro' },
  { id: 'remix', name: 'Remix', preset: 'remix' },
  { id: 'vite', name: 'Vite', preset: 'vite' },
  { id: 'other', name: 'Other', preset: null },
];

export default function DeployPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [framework, setFramework] = useState('');
  const [buildCommand, setBuildCommand] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }]);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRepoSelect = (repo: any) => {
    setSelectedRepo(repo);
    setProjectName(repo.name);
  };

  const handleFrameworkSelect = (frameworkId: string) => {
    setFramework(frameworkId);
    const selectedFramework = frameworks.find((f) => f.id === frameworkId);

    // Set default build settings based on framework
    switch (frameworkId) {
      case 'nextjs':
        setBuildCommand('npm run build');
        setOutputDirectory('.next');
        break;
      case 'react':
        setBuildCommand('npm run build');
        setOutputDirectory('build');
        break;
      case 'vue':
        setBuildCommand('npm run build');
        setOutputDirectory('dist');
        break;
      case 'nuxt':
        setBuildCommand('npm run build');
        setOutputDirectory('.output');
        break;
      case 'svelte':
        setBuildCommand('npm run build');
        setOutputDirectory('build');
        break;
      case 'astro':
        setBuildCommand('npm run build');
        setOutputDirectory('dist');
        break;
      case 'remix':
        setBuildCommand('npm run build');
        setOutputDirectory('build');
        break;
      case 'vite':
        setBuildCommand('npm run build');
        setOutputDirectory('dist');
        break;
      default:
        setBuildCommand('');
        setOutputDirectory('');
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const updated = envVars.map((env, i) =>
      i === index ? { ...env, [field]: value } : env,
    );
    setEnvVars(updated);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsDeploying(false);
    // In real app, redirect to project page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FireIcon className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  webduh
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  U
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Deploy New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your Git repository and deploy to webduh in minutes.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-center">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative">
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className={`absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-20 ${
                        currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}

                  <div className="relative flex items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        currentStep > step.id
                          ? 'bg-primary-600'
                          : currentStep === step.id
                            ? 'bg-primary-600'
                            : 'bg-gray-300'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckIcon className="h-4 w-4 text-white" />
                      ) : (
                        <step.icon className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        currentStep >= step.id
                          ? 'text-primary-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="card">
          <div className="card-content">
            {/* Step 1: Connect Repository */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Select Repository
                </h2>

                <div className="space-y-4">
                  {mockRepositories.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => handleRepoSelect(repo)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRepo?.id === repo.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <CodeBracketIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {repo.fullName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {repo.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{repo.language}</span>
                          <span>{repo.updatedAt}</span>
                          {repo.private && (
                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded text-xs">
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Configure Settings */}
            {currentStep === 2 && selectedRepo && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Configure Project
                </h2>

                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="input w-full"
                      placeholder="my-awesome-project"
                    />
                  </div>

                  {/* Framework */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Framework Preset
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {frameworks.map((fw) => (
                        <button
                          key={fw.id}
                          onClick={() => handleFrameworkSelect(fw.id)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                            framework === fw.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          {fw.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Build Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Build Command
                      </label>
                      <input
                        type="text"
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        className="input w-full"
                        placeholder="npm run build"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Directory
                      </label>
                      <input
                        type="text"
                        value={outputDirectory}
                        onChange={(e) => setOutputDirectory(e.target.value)}
                        className="input w-full"
                        placeholder="dist"
                      />
                    </div>
                  </div>

                  {/* Environment Variables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Environment Variables
                    </label>
                    <div className="space-y-2">
                      {envVars.map((env, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={env.key}
                            onChange={(e) =>
                              updateEnvVar(index, 'key', e.target.value)
                            }
                            placeholder="KEY"
                            className="input flex-1"
                          />
                          <input
                            type="text"
                            value={env.value}
                            onChange={(e) =>
                              updateEnvVar(index, 'value', e.target.value)
                            }
                            placeholder="value"
                            className="input flex-1"
                          />
                          {envVars.length > 1 && (
                            <button
                              onClick={() => removeEnvVar(index)}
                              className="btn btn-outline btn-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addEnvVar}
                        className="btn btn-ghost btn-sm"
                      >
                        Add Variable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Deploy */}
            {currentStep === 3 && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Ready to Deploy
                </h2>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Repository:
                      </span>
                      <span className="font-medium">
                        {selectedRepo?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Project Name:
                      </span>
                      <span className="font-medium">{projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Framework:
                      </span>
                      <span className="font-medium">
                        {frameworks.find((f) => f.id === framework)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Build Command:
                      </span>
                      <span className="font-medium">{buildCommand}</span>
                    </div>
                  </div>
                </div>

                {isDeploying ? (
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 spinner border-4 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Deploying your project...
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleDeploy}
                    className="btn btn-primary btn-lg"
                  >
                    <RocketLaunchIcon className="h-5 w-5 mr-2" />
                    Deploy Project
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="card-footer">
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-outline btn-md"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>

              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedRepo}
                  className="btn btn-primary btn-md"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
