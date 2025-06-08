'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DocumentIcon,
  FolderIcon,
  CodeBracketIcon,
  CloudArrowUpIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  LinkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

// Types
interface ProjectFile {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  content?: string;
  file_size: number;
  mime_type: string;
  parent_directory: string;
  ai_generated: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

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
  repository_url?: string;
  ai_builder_session_id?: string;
  build_command?: string;
  output_directory?: string;
  install_command?: string;
  dev_command?: string;
  created_at: string;
  updated_at: string;
  files?: ProjectFile[];
}

interface Deployment {
  id: string;
  name: string;
  url?: string;
  status: string;
  type: string;
  source: string;
  creator_username?: string;
  created_at: string;
  ready_at?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [activeTab, setActiveTab] = useState<
    'files' | 'deployments' | 'settings'
  >('files');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [showFileEditor, setShowFileEditor] = useState(false);
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);

  // Load project data
  useEffect(() => {
    loadProject();
    loadFiles();
    loadDeployments();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/files?include_content=false`,
      );
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const loadDeployments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/deployments`);
      if (response.ok) {
        const data = await response.json();
        setDeployments(data.deployments || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading deployments:', error);
      setIsLoading(false);
    }
  };

  const loadFileContent = async (fileId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/files/${fileId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedFile(data.file);
        setNewFileContent(data.file.content || '');
        setShowFileEditor(true);
      }
    } catch (error) {
      console.error('Error loading file content:', error);
    }
  };

  const saveFile = async (fileId?: string) => {
    try {
      if (fileId) {
        // Update existing file
        const response = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: [
              {
                file_path: selectedFile?.file_path,
                content: newFileContent,
                operation: 'update',
              },
            ],
          }),
        });

        if (response.ok) {
          setShowFileEditor(false);
          loadFiles();
        }
      } else {
        // Create new file
        const response = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: [
              {
                file_path: newFileName,
                content: newFileContent,
                operation: 'create',
              },
            ],
          }),
        });

        if (response.ok) {
          setShowNewFileModal(false);
          setNewFileName('');
          setNewFileContent('');
          loadFiles();
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/files/${fileId}`,
          {
            method: 'DELETE',
          },
        );

        if (response.ok) {
          loadFiles();
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const deployProject = async (type: 'preview' | 'production' = 'preview') => {
    setIsDeploying(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          environment_variables: {},
        }),
      });

      if (response.ok) {
        loadDeployments();
      }
    } catch (error) {
      console.error('Error deploying project:', error);
    }
    setIsDeploying(false);
  };

  const syncFromAIBuilder = async () => {
    if (!project?.ai_builder_session_id) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/sync-from-ai-builder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: project.ai_builder_session_id,
            files: {}, // This would come from the AI Builder session
            overwrite: true,
          }),
        },
      );

      if (response.ok) {
        loadFiles();
        loadProject();
      }
    } catch (error) {
      console.error('Error syncing from AI Builder:', error);
    }
  };

  const openInAIBuilder = () => {
    window.open('http://localhost:5173', '_blank');
  };

  // Filter files based on search and type
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.file_path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      fileTypeFilter === 'all' || file.file_type === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  // Get unique file types for filter
  const fileTypes = Array.from(new Set(files.map((f) => f.file_type)));

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      javascript: <CodeBracketIcon className="h-4 w-4 text-yellow-500" />,
      typescript: <CodeBracketIcon className="h-4 w-4 text-blue-500" />,
      css: <DocumentIcon className="h-4 w-4 text-pink-500" />,
      html: <DocumentIcon className="h-4 w-4 text-orange-500" />,
      json: <DocumentIcon className="h-4 w-4 text-gray-500" />,
      markdown: <DocumentIcon className="h-4 w-4 text-gray-600" />,
    };
    return (
      iconMap[fileType] || <DocumentIcon className="h-4 w-4 text-gray-400" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'building':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="btn btn-primary"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/projects')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to Projects
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.framework} • {project.team_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {project.ai_builder_session_id && (
                <button
                  onClick={syncFromAIBuilder}
                  className="btn btn-secondary btn-sm"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Sync from AI Builder
                </button>
              )}

              <button
                onClick={openInAIBuilder}
                className="btn btn-secondary btn-sm"
              >
                <CodeBracketIcon className="h-4 w-4 mr-2" />
                Open in AI Builder
              </button>

              <button
                onClick={() => deployProject('preview')}
                disabled={isDeploying}
                className="btn btn-primary btn-sm"
              >
                {isDeploying ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RocketLaunchIcon className="h-4 w-4 mr-2" />
                )}
                Deploy
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {project.description || 'No description provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Source Type
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                {project.source_type.replace('-', ' ')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Last Updated
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(project.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: 'files',
                label: `Files (${files.length})`,
                icon: DocumentIcon,
              },
              {
                id: 'deployments',
                label: `Deployments (${deployments.length})`,
                icon: RocketLaunchIcon,
              },
              { id: 'settings', label: 'Settings', icon: PencilIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Files Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-sm"
                />
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="input input-sm"
                >
                  <option value="all">All Types</option>
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowNewFileModal(true)}
                className="btn btn-primary btn-sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New File
              </button>
            </div>

            {/* Files List */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No files found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Get started by creating your first file or syncing from AI
                    Builder.
                  </p>
                  <button
                    onClick={() => setShowNewFileModal(true)}
                    className="btn btn-primary"
                  >
                    Create File
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.file_type)}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.file_name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {file.file_path} •{' '}
                              {formatFileSize(file.file_size)}
                              {file.ai_generated && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  AI Generated
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => loadFileContent(file.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            title="View/Edit"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div className="space-y-6">
            {/* Deployments Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Deployment History
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => deployProject('preview')}
                  disabled={isDeploying}
                  className="btn btn-secondary btn-sm"
                >
                  Deploy Preview
                </button>
                <button
                  onClick={() => deployProject('production')}
                  disabled={isDeploying}
                  className="btn btn-primary btn-sm"
                >
                  Deploy to Production
                </button>
              </div>
            </div>

            {/* Deployments List */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
              {deployments.length === 0 ? (
                <div className="text-center py-12">
                  <RocketLaunchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No deployments yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Deploy your project to make it available to the world.
                  </p>
                  <button
                    onClick={() => deployProject('preview')}
                    className="btn btn-primary"
                  >
                    Deploy Now
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(deployment.status)}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {deployment.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {deployment.type} •{' '}
                              {formatDate(deployment.created_at)}
                              {deployment.creator_username &&
                                ` • by ${deployment.creator_username}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {deployment.url && (
                            <a
                              href={deployment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Visit
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Project Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Build Command
                  </label>
                  <input
                    type="text"
                    value={project.build_command || ''}
                    className="input"
                    placeholder="npm run build"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Directory
                  </label>
                  <input
                    type="text"
                    value={project.output_directory || ''}
                    className="input"
                    placeholder="dist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Install Command
                  </label>
                  <input
                    type="text"
                    value={project.install_command || ''}
                    className="input"
                    placeholder="npm install"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dev Command
                  </label>
                  <input
                    type="text"
                    value={project.dev_command || ''}
                    className="input"
                    placeholder="npm run dev"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="btn btn-primary">Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* File Editor Modal */}
      {showFileEditor && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedFile.file_name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => saveFile(selectedFile.id)}
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowFileEditor(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <textarea
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
                className="w-full h-96 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="File content..."
              />
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Create New File
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Path
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="input"
                  placeholder="src/components/NewComponent.tsx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full h-64 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="File content..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => saveFile()}
                className="btn btn-primary"
                disabled={!newFileName || !newFileContent}
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
