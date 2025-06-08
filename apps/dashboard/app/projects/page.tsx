'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  FolderIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Types
interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  framework: string;
  status: string;
  source_type: string;
  team_name: string;
  creator_username: string;
  file_count: number;
  deployment_count: number;
  last_deployment_at: string | null;
  ai_builder_session_id?: string;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: string;
  name: string;
  role: string;
}

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSourceType, setSelectedSourceType] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    framework: 'nextjs',
    team_id: '',
    source_type: 'manual',
  });

  useEffect(() => {
    loadProjects();
    loadTeams();
  }, [selectedTeam, selectedFramework, selectedStatus, selectedSourceType]);

  const loadProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTeam !== 'all') params.append('team_id', selectedTeam);
      if (selectedFramework !== 'all')
        params.append('framework', selectedFramework);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedSourceType !== 'all')
        params.append('source_type', selectedSourceType);

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const createProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setShowNewProjectModal(false);
        setNewProject({
          name: '',
          description: '',
          framework: 'nextjs',
          team_id: '',
          source_type: 'manual',
        });
        loadProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const openInAIBuilder = (projectId?: string) => {
    let url = 'http://localhost:5173';
    if (projectId) {
      url += `?project_id=${projectId}`;
    }
    window.open(url, '_blank');
  };

  const createFromAIBuilder = () => {
    openInAIBuilder();
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.framework.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get unique frameworks for filter
  const frameworks = Array.from(new Set(projects.map((p) => p.framework)));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'building':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getFrameworkIcon = (framework: string) => {
    const iconMap: { [key: string]: string } = {
      nextjs: '⚡',
      react: '⚛️',
      vue: '💚',
      svelte: '🧡',
      angular: '🔴',
      static: '📄',
    };
    return iconMap[framework] || '📦';
  };

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'ai-builder':
        return <SparklesIcon className="h-4 w-4 text-blue-500" />;
      case 'github':
        return <CodeBracketIcon className="h-4 w-4 text-gray-700" />;
      case 'template':
        return <FolderIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <PencilIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Projects
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your projects and deployments
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={createFromAIBuilder}
                className="btn btn-secondary"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Create with AI Builder
              </button>

              <button
                onClick={() => setShowNewProjectModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="input"
              >
                <option value="all">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Framework
              </label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="input"
              >
                <option value="all">All Frameworks</option>
                {frameworks.map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="building">Building</option>
                <option value="error">Error</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <select
                value={selectedSourceType}
                onChange={(e) => setSelectedSourceType(e.target.value)}
                className="input"
              >
                <option value="all">All Sources</option>
                <option value="manual">Manual</option>
                <option value="ai-builder">AI Builder</option>
                <option value="github">GitHub</option>
                <option value="template">Template</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {projects.length === 0
                ? 'No projects yet'
                : 'No projects match your filters'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {projects.length === 0
                ? 'Get started by creating your first project with AI Builder or manually.'
                : 'Try adjusting your search criteria or filters.'}
            </p>
            <div className="flex justify-center space-x-3">
              <button onClick={createFromAIBuilder} className="btn btn-primary">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Create with AI Builder
              </button>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="btn btn-secondary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Manually
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getFrameworkIcon(project.framework)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.team_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getSourceTypeIcon(project.source_type)}
                      {getStatusIcon(project.status)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{project.file_count} files</span>
                    <span>{project.deployment_count} deployments</span>
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>

                      {project.ai_builder_session_id && (
                        <button
                          onClick={() => openInAIBuilder(project.id)}
                          className="btn btn-secondary btn-sm"
                          title="Open in AI Builder"
                        >
                          <SparklesIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          router.push(`/projects/${project.id}?tab=settings`)
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Create New Project
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="input"
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="input h-20 resize-none"
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Framework
                </label>
                <select
                  value={newProject.framework}
                  onChange={(e) =>
                    setNewProject({ ...newProject, framework: e.target.value })
                  }
                  className="input"
                >
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="vue">Vue.js</option>
                  <option value="svelte">Svelte</option>
                  <option value="angular">Angular</option>
                  <option value="static">Static HTML</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team
                </label>
                <select
                  value={newProject.team_id}
                  onChange={(e) =>
                    setNewProject({ ...newProject, team_id: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="btn btn-primary"
                disabled={!newProject.name || !newProject.team_id}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
