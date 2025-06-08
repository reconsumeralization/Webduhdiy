'use client';

// TODO: confirm version & license.
import React, { useState } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import {
  ClockIcon,
  UserIcon,
  CogIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  KeyIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
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

// Mock activity data
const activities = [
  {
    id: 'act_001',
    type: 'deployment.created',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
    },
    resource: {
      type: 'deployment',
      name: 'my-nextjs-app',
      id: 'dep_123',
    },
    description: 'Deployed to production',
    metadata: {
      branch: 'main',
      commit: 'a1b2c3d',
      environment: 'production',
    },
    timestamp: '2024-03-10T15:30:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'act_002',
    type: 'team.member_added',
    user: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: null,
    },
    resource: {
      type: 'user',
      name: 'Mike Chen',
      id: 'user_456',
    },
    description: 'Added team member',
    metadata: {
      role: 'Developer',
      permissions: ['read', 'write'],
    },
    timestamp: '2024-03-10T14:20:00Z',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'act_003',
    type: 'project.created',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
    },
    resource: {
      type: 'project',
      name: 'new-api-service',
      id: 'proj_789',
    },
    description: 'Created new project',
    metadata: {
      template: 'express',
      repository: 'github.com/user/new-api-service',
    },
    timestamp: '2024-03-10T13:10:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'act_004',
    type: 'domain.added',
    user: {
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: null,
    },
    resource: {
      type: 'domain',
      name: 'myapp.com',
      id: 'domain_101',
    },
    description: 'Added custom domain',
    metadata: {
      sslEnabled: true,
      verified: true,
    },
    timestamp: '2024-03-10T12:00:00Z',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'act_005',
    type: 'settings.updated',
    user: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: null,
    },
    resource: {
      type: 'project',
      name: 'my-nextjs-app',
      id: 'proj_123',
    },
    description: 'Updated environment variables',
    metadata: {
      variablesCount: 5,
      environment: 'production',
    },
    timestamp: '2024-03-10T11:45:00Z',
    ipAddress: '192.168.1.101',
  },
];

const activityTypes = {
  'deployment.created': {
    icon: RocketLaunchIcon,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    label: 'Deployment',
  },
  'deployment.failed': {
    icon: XCircleIcon,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    label: 'Failed Deployment',
  },
  'project.created': {
    icon: PlusIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Project Created',
  },
  'project.deleted': {
    icon: TrashIcon,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    label: 'Project Deleted',
  },
  'team.member_added': {
    icon: UserGroupIcon,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    label: 'Team Member Added',
  },
  'team.member_removed': {
    icon: UserGroupIcon,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    label: 'Team Member Removed',
  },
  'domain.added': {
    icon: GlobeAltIcon,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    label: 'Domain Added',
  },
  'domain.verified': {
    icon: CheckCircleIcon,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    label: 'Domain Verified',
  },
  'settings.updated': {
    icon: CogIcon,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-900/20',
    label: 'Settings Updated',
  },
  'auth.login': {
    icon: KeyIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'User Login',
  },
};

export default function ActivityPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const filteredActivities = activities.filter((activity) => {
    const matchesType =
      filterType === 'all' || activity.type.startsWith(filterType);
    const matchesUser =
      filterUser === 'all' || activity.user.email === filterUser;
    return matchesType && matchesUser;
  });

  const getActivityIcon = (type: string) => {
    const config =
      activityTypes[type as keyof typeof activityTypes] ||
      activityTypes['settings.updated'];
    const Icon = config.icon;
    return (
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <Icon className={`h-5 w-5 ${config.color}`} />
      </div>
    );
  };

  const getActivityLabel = (type: string) => {
    const config =
      activityTypes[type as keyof typeof activityTypes] ||
      activityTypes['settings.updated'];
    return config.label;
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const uniqueUsers = Array.from(new Set(activities.map((a) => a.user.email)));

  return (
    <DashboardLayout
      title="Activity Log"
      description="Monitor all activities and changes across your projects"
      headerActions={
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <EyeIcon className="h-4 w-4 mr-2" />
          Export Log
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="deployment">Deployments</option>
                  <option value="project">Projects</option>
                  <option value="team">Team</option>
                  <option value="domain">Domains</option>
                  <option value="settings">Settings</option>
                  <option value="auth">Authentication</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User
                </label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredActivities.length} activit
              {filteredActivities.length !== 1 ? 'ies' : 'y'}
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {getActivityIcon(activity.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {getInitials(activity.user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.user.email}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {getActivityLabel(activity.type)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {activity.ipAddress}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}{' '}
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {activity.resource.name}
                        </span>
                      </p>

                      {Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(activity.metadata).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                <span className="font-medium mr-1">{key}:</span>
                                <span>{String(value)}</span>
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No activities match your current filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
