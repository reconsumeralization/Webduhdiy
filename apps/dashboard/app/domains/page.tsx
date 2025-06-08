'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GlobeAltIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CogIcon,
  LinkIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
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

// Mock domains data
const domains = [
  {
    id: 'domain_1',
    domain: 'myapp.com',
    type: 'custom',
    status: 'active',
    sslStatus: 'valid',
    projectId: 'proj_1',
    projectName: 'My Next.js App',
    createdAt: '2024-02-15T10:30:00Z',
    verifiedAt: '2024-02-15T10:45:00Z',
    sslExpiresAt: '2025-02-15T10:50:00Z',
  },
  {
    id: 'domain_2',
    domain: 'api.myapp.com',
    type: 'custom',
    status: 'pending',
    sslStatus: 'pending',
    projectId: 'proj_2',
    projectName: 'API Service',
    createdAt: '2024-03-01T09:20:00Z',
    verifiedAt: null,
    sslExpiresAt: null,
  },
  {
    id: 'domain_3',
    domain: 'staging.myapp.com',
    type: 'subdomain',
    status: 'active',
    sslStatus: 'valid',
    projectId: 'proj_1',
    projectName: 'My Next.js App',
    createdAt: '2024-01-20T14:15:00Z',
    verifiedAt: '2024-01-20T14:16:00Z',
    sslExpiresAt: '2025-01-20T14:16:00Z',
  },
  {
    id: 'domain_4',
    domain: 'blog.myapp.com',
    type: 'custom',
    status: 'failed',
    sslStatus: 'failed',
    projectId: 'proj_3',
    projectName: 'Blog Platform',
    createdAt: '2024-03-05T11:30:00Z',
    verifiedAt: null,
    sslExpiresAt: null,
  },
];

const statusConfig = {
  active: {
    icon: CheckCircleIcon,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    label: 'Active',
  },
  pending: {
    icon: ClockIcon,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    label: 'Pending',
  },
  failed: {
    icon: XCircleIcon,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20',
    label: 'Failed',
  },
  inactive: {
    icon: ExclamationTriangleIcon,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-900/20',
    label: 'Inactive',
  },
};

export default function DomainsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDomains = domains.filter((domain) => {
    const matchesStatus =
      statusFilter === 'all' || domain.status === statusFilter;
    const matchesType = typeFilter === 'all' || domain.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    const Icon = config.icon;
    return <Icon className={`h-5 w-5 ${config.color}`} />;
  };

  const getStatusBadge = (status: string) => {
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getSslBadge = (sslStatus: string) => {
    if (sslStatus === 'valid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <ShieldCheckIcon className="h-3 w-3 mr-1" />
          Valid SSL
        </span>
      );
    } else if (sslStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
          <ClockIcon className="h-3 w-3 mr-1" />
          SSL Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          <XCircleIcon className="h-3 w-3 mr-1" />
          SSL Failed
        </span>
      );
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          type === 'custom'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
        }`}
      >
        {type === 'custom' ? 'Custom' : 'Subdomain'}
      </span>
    );
  };

  return (
    <DashboardLayout
      title="Domains"
      description="Manage custom domains and subdomains for your projects"
      headerActions={
        <Link
          href="/domains/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Domain
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="custom">Custom Domains</option>
                  <option value="subdomain">Subdomains</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDomains.length} domain
              {filteredDomains.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Domains List */}
        <div className="space-y-4">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {domain.domain}
                        </h3>
                        {getTypeBadge(domain.type)}
                        {getStatusBadge(domain.status)}
                        {getSslBadge(domain.sslStatus)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <LinkIcon className="h-4 w-4" />
                          <Link
                            href={`/projects/${domain.projectId}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {domain.projectName}
                          </Link>
                        </div>
                        <span>•</span>
                        <span>
                          Created{' '}
                          {new Date(domain.createdAt).toLocaleDateString()}
                        </span>
                        {domain.verifiedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Verified{' '}
                              {new Date(domain.verifiedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {domain.status === 'pending' && (
                    <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Verification Pending:</strong> Please add the
                        DNS records below to verify domain ownership.
                      </p>
                    </div>
                  )}

                  {domain.status === 'failed' && (
                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>Verification Failed:</strong> Unable to verify
                        domain ownership. Please check your DNS configuration.
                      </p>
                    </div>
                  )}

                  {domain.sslExpiresAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      SSL expires:{' '}
                      {new Date(domain.sslExpiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/domains/${domain.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CogIcon className="h-4 w-4 mr-1" />
                    Configure
                  </Link>
                  {domain.status === 'active' && (
                    <a
                      href={`https://${domain.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDomains.length === 0 && (
          <div className="text-center py-12">
            <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No domains found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No domains match your current filters.
            </p>
            <Link
              href="/domains/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
