'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  LockClosedIcon,
  IdentificationIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc' | 'ldap';
  status: 'active' | 'inactive' | 'pending' | 'error';
  domains: string[];
  userCount: number;
  lastSync: number;
  config: Record<string, any>;
  testConnection?: boolean;
}

interface SSOUser {
  id: string;
  email: string;
  name: string;
  provider: string;
  lastLogin: number;
  roles: string[];
  attributes: Record<string, string>;
}

interface SSOConfiguration {
  enforceSSO: boolean;
  allowLocalAuth: boolean;
  autoProvision: boolean;
  defaultRole: string;
  sessionTimeout: number;
  mfaRequired: boolean;
}

export default function EnterpriseSSO() {
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [users, setUsers] = useState<SSOUser[]>([]);
  const [config, setConfig] = useState<SSOConfiguration>({
    enforceSSO: true,
    allowLocalAuth: false,
    autoProvision: true,
    defaultRole: 'developer',
    sessionTimeout: 8,
    mfaRequired: true,
  });
  const [selectedTab, setSelectedTab] = useState<
    'providers' | 'users' | 'configuration' | 'audit'
  >('providers');
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize SSO data
    const mockProviders: SSOProvider[] = [
      {
        id: 'okta-primary',
        name: 'Okta Enterprise',
        type: 'saml',
        status: 'active',
        domains: ['company.com', 'company.org'],
        userCount: 247,
        lastSync: Date.now() - 300000,
        config: {
          entityId: 'https://company.okta.com',
          ssoUrl: 'https://company.okta.com/app/webduh/sso/saml',
          certificate: '-----BEGIN CERTIFICATE-----\nMIIC...',
          signRequests: true,
          nameIdFormat:
            'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        },
        testConnection: true,
      },
      {
        id: 'azure-ad',
        name: 'Azure Active Directory',
        type: 'oidc',
        status: 'active',
        domains: ['azurecorp.com'],
        userCount: 89,
        lastSync: Date.now() - 600000,
        config: {
          clientId: '12345678-1234-1234-1234-123456789012',
          clientSecret: '••••••••••••••••',
          tenantId: '87654321-4321-4321-4321-210987654321',
          authority: 'https://login.microsoftonline.com/',
          scopes: ['openid', 'profile', 'email'],
        },
        testConnection: true,
      },
      {
        id: 'google-workspace',
        name: 'Google Workspace',
        type: 'oauth',
        status: 'pending',
        domains: ['example.com'],
        userCount: 0,
        lastSync: Date.now() - 3600000,
        config: {
          clientId:
            '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
          clientSecret: '••••••••••••••••',
          domain: 'example.com',
          adminEmail: 'admin@example.com',
        },
        testConnection: false,
      },
      {
        id: 'ldap-corp',
        name: 'Corporate LDAP',
        type: 'ldap',
        status: 'error',
        domains: ['corp.local'],
        userCount: 156,
        lastSync: Date.now() - 7200000,
        config: {
          server: 'ldap://ldap.corp.local:389',
          baseDn: 'ou=users,dc=corp,dc=local',
          bindDn: 'cn=webduh,ou=service,dc=corp,dc=local',
          bindPassword: '••••••••••••••••',
          userFilter: '(objectClass=person)',
          emailAttribute: 'mail',
          nameAttribute: 'displayName',
        },
        testConnection: false,
      },
    ];

    const mockUsers: SSOUser[] = [
      {
        id: 'user-1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        provider: 'okta-primary',
        lastLogin: Date.now() - 1800000,
        roles: ['admin', 'developer'],
        attributes: {
          department: 'Engineering',
          title: 'Senior Developer',
          location: 'San Francisco',
        },
      },
      {
        id: 'user-2',
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        provider: 'okta-primary',
        lastLogin: Date.now() - 3600000,
        roles: ['viewer'],
        attributes: {
          department: 'Marketing',
          title: 'Marketing Manager',
          location: 'New York',
        },
      },
      {
        id: 'user-3',
        email: 'bob.wilson@azurecorp.com',
        name: 'Bob Wilson',
        provider: 'azure-ad',
        lastLogin: Date.now() - 7200000,
        roles: ['developer'],
        attributes: {
          department: 'DevOps',
          title: 'DevOps Engineer',
          location: 'Seattle',
        },
      },
    ];

    setProviders(mockProviders);
    setUsers(mockUsers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'saml':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'oauth':
        return <KeyIcon className="h-5 w-5" />;
      case 'oidc':
        return <IdentificationIcon className="h-5 w-5" />;
      case 'ldap':
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <LockClosedIcon className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

  const testConnection = async (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, testConnection: undefined } : p,
      ),
    );

    // Simulate connection test
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? {
                ...p,
                testConnection: Math.random() > 0.3,
                status: Math.random() > 0.3 ? 'active' : 'error',
              }
            : p,
        ),
      );
    }, 2000);
  };

  const syncUsers = async (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, lastSync: Date.now() } : p,
      ),
    );
  };

  const tabs = [
    { id: 'providers', name: 'SSO Providers', icon: ShieldCheckIcon },
    { id: 'users', name: 'Federated Users', icon: UserGroupIcon },
    { id: 'configuration', name: 'Configuration', icon: CogIcon },
    { id: 'audit', name: 'Audit Logs', icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enterprise SSO
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Single Sign-On providers and user authentication
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {providers.filter((p) => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active Providers
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Federated Users
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* SSO Providers Tab */}
      {selectedTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              SSO Providers
            </h3>
            <button
              onClick={() => setShowAddProvider(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Provider</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {getProviderIcon(provider.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {provider.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {provider.type} Provider
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}
                  >
                    <span className="capitalize">{provider.status}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Domains:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {provider.domains.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Users:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {provider.userCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Sync:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatTimeAgo(provider.lastSync)}
                    </span>
                  </div>
                  {provider.testConnection !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Connection:
                      </span>
                      <div className="flex items-center space-x-1">
                        {provider.testConnection ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Healthy</span>
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => testConnection(provider.id)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={() => syncUsers(provider.id)}
                    className="flex-1 px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    Sync Users
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Federated Users Tab */}
      {selectedTab === 'users' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Federated Users
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {users.length} users
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {providers.find((p) => p.id === user.provider)?.name ||
                          user.provider}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.attributes.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(user.lastLogin)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {selectedTab === 'configuration' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Global SSO Configuration
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Enforce SSO
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Require users to authenticate via SSO providers
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enforceSSO}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      enforceSSO: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Allow Local Authentication
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow fallback to username/password authentication
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.allowLocalAuth}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      allowLocalAuth: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-Provision Users
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically create accounts for new SSO users
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoProvision}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      autoProvision: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Require MFA
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Require multi-factor authentication for all users
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.mfaRequired}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      mfaRequired: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Default Role for New Users
                </label>
                <select
                  value={config.defaultRole}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      defaultRole: e.target.value,
                    }))
                  }
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Session Timeout (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={config.sessionTimeout}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      sessionTimeout: parseInt(e.target.value),
                    }))
                  }
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {selectedTab === 'audit' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            SSO Audit Logs
          </h3>
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Audit logs coming soon. Track all SSO authentication events and
              configuration changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
