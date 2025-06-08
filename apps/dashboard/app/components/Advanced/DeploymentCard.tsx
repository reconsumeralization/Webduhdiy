'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
  ArrowPathIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  CommandLineIcon,
  DocumentTextIcon,
  StopIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  status: 'queued' | 'building' | 'deployed' | 'failed' | 'cancelled';
  environment: string;
  branch: string;
  commitSha: string;
  commitMessage: string;
  commitAuthor: string;
  url?: string;
  previewUrl?: string;
  buildDuration?: number;
  size?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface DeploymentCardProps {
  deployment: Deployment;
  showProject?: boolean;
  compact?: boolean;
  onRedeploy?: (deploymentId: string) => void;
  onCancel?: (deploymentId: string) => void;
  onRollback?: (deploymentId: string) => void;
}

export default function DeploymentCard({
  deployment,
  showProject = false,
  compact = false,
  onRedeploy,
  onCancel,
  onRollback,
}: DeploymentCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'deployed':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300',
          label: 'Deployed',
        };
      case 'building':
        return {
          icon: ArrowPathIcon,
          color: 'text-blue-600 dark:text-blue-400 animate-spin',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-300',
          label: 'Building',
        };
      case 'queued':
        return {
          icon: ClockIcon,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          label: 'Queued',
        };
      case 'failed':
        return {
          icon: XCircleIcon,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-300',
          label: 'Failed',
        };
      case 'cancelled':
        return {
          icon: StopIcon,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          textColor: 'text-gray-800 dark:text-gray-300',
          label: 'Cancelled',
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          textColor: 'text-gray-800 dark:text-gray-300',
          label: 'Unknown',
        };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const statusConfig = getStatusConfig(deployment.status);

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel = ['queued', 'building'].includes(deployment.status);
  const canRedeploy = ['deployed', 'failed', 'cancelled'].includes(
    deployment.status,
  );
  const canRollback =
    deployment.status === 'deployed' && deployment.environment === 'production';

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 flex-1">
          <statusConfig.icon className={`h-5 w-5 ${statusConfig.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {showProject
                  ? deployment.projectName
                  : `#${deployment.id.slice(-6)}`}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {deployment.branch} • {formatTimeAgo(deployment.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {deployment.url && (
            <Link
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <GlobeAltIcon className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/deployments/${deployment.id}`}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <statusConfig.icon className={`h-6 w-6 ${statusConfig.color}`} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {showProject
                    ? deployment.projectName
                    : `Deployment #${deployment.id.slice(-6)}`}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{deployment.environment}</span>
                <span>•</span>
                <span>{deployment.branch}</span>
                <span>•</span>
                <span>{formatTimeAgo(deployment.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {deployment.url && (
              <Link
                href={deployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <GlobeAltIcon className="h-4 w-4 mr-1.5" />
                Visit
              </Link>
            )}

            {deployment.previewUrl && (
              <Link
                href={deployment.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1.5" />
                Preview
              </Link>
            )}

            <div className="flex items-center space-x-1">
              {canCancel && onCancel && (
                <button
                  onClick={() => handleAction(() => onCancel(deployment.id))}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  <StopIcon className="h-4 w-4 mr-1.5" />
                  Cancel
                </button>
              )}

              {canRedeploy && onRedeploy && (
                <button
                  onClick={() => handleAction(() => onRedeploy(deployment.id))}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-300 dark:border-blue-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                >
                  <PlayIcon className="h-4 w-4 mr-1.5" />
                  Redeploy
                </button>
              )}

              {canRollback && onRollback && (
                <button
                  onClick={() => handleAction(() => onRollback(deployment.id))}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                  Rollback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Commit Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {deployment.commitAuthor.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {deployment.commitMessage}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {deployment.commitSha.slice(0, 7)} by {deployment.commitAuthor}
            </div>
          </div>
        </div>

        {/* Metrics */}
        {(deployment.buildDuration ||
          deployment.size ||
          deployment.completedAt) && (
          <div className="grid grid-cols-3 gap-4">
            {deployment.buildDuration && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDuration(deployment.buildDuration)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Build time
                </div>
              </div>
            )}
            {deployment.size && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatSize(deployment.size)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Bundle size
                </div>
              </div>
            )}
            {deployment.completedAt && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatTimeAgo(deployment.completedAt)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Completed
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {deployment.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-900 dark:text-red-300">
                  Deployment failed
                </div>
                <div className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {deployment.error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Link
              href={`/deployments/${deployment.id}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View details
            </Link>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <CommandLineIcon className="h-4 w-4" />
              <span>Logs</span>
              <ArrowDownIcon
                className={`h-3 w-3 transition-transform ${showLogs ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            ID: {deployment.id}
          </div>
        </div>

        {/* Logs */}
        {showLogs && (
          <div className="p-3 bg-gray-900 dark:bg-gray-800 rounded-lg">
            <div className="font-mono text-xs text-green-400 space-y-1">
              <div>→ Building...</div>
              <div>→ Installing dependencies...</div>
              <div>→ Running build command...</div>
              {deployment.status === 'deployed' && (
                <div>✓ Deployment completed successfully</div>
              )}
              {deployment.status === 'failed' && (
                <div className="text-red-400">
                  ✗ Build failed: {deployment.error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
