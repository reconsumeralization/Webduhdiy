'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ShieldExclamationIcon,
  BugAntIcon,
  UserIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CpuChipIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface SecurityEvent {
  id: string;
  type: 'threat' | 'vulnerability' | 'compliance' | 'access' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  source: string;
  resolved?: boolean;
  affectedAssets?: string[];
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  status: 'secure' | 'warning' | 'critical';
  icon: any;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated: number;
}

interface VulnerabilityReport {
  id: string;
  package: string;
  version: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cve: string;
  description: string;
  fixedIn?: string;
  exploitable: boolean;
}

interface ComplianceCheck {
  id: string;
  standard: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  lastChecked: number;
  details: string;
}

export default function SecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityReport[]>(
    [],
  );
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>(
    [],
  );
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'events' | 'vulnerabilities' | 'compliance'
  >('overview');

  useEffect(() => {
    // Initialize security data
    const mockEvents: SecurityEvent[] = [
      {
        id: 'evt-1',
        type: 'threat',
        severity: 'high',
        title: 'Suspicious Login Attempt',
        description: 'Multiple failed login attempts from IP 192.168.1.100',
        timestamp: Date.now() - 300000,
        source: 'Authentication System',
        affectedAssets: ['Auth Service', 'User Database'],
      },
      {
        id: 'evt-2',
        type: 'vulnerability',
        severity: 'critical',
        title: 'Critical Vulnerability Detected',
        description: 'High-severity vulnerability found in OpenSSL dependency',
        timestamp: Date.now() - 900000,
        source: 'Vulnerability Scanner',
        affectedAssets: ['API Gateway', 'Web Server'],
      },
      {
        id: 'evt-3',
        type: 'compliance',
        severity: 'medium',
        title: 'Compliance Check Failed',
        description: 'GDPR data retention policy violation detected',
        timestamp: Date.now() - 1800000,
        source: 'Compliance Monitor',
        affectedAssets: ['User Data Store'],
      },
      {
        id: 'evt-4',
        type: 'access',
        severity: 'low',
        title: 'Privileged Access Granted',
        description: 'Admin privileges granted to user john.doe@example.com',
        timestamp: Date.now() - 3600000,
        source: 'Access Control',
        resolved: true,
      },
      {
        id: 'evt-5',
        type: 'anomaly',
        severity: 'medium',
        title: 'Unusual Traffic Pattern',
        description: 'Abnormal spike in API requests detected',
        timestamp: Date.now() - 7200000,
        source: 'Traffic Monitor',
        affectedAssets: ['API Gateway'],
      },
    ];

    const mockMetrics: SecurityMetric[] = [
      {
        id: 'security-score',
        name: 'Security Score',
        value: 87,
        unit: '/100',
        status: 'warning',
        icon: ShieldCheckIcon,
        trend: 'up',
        lastUpdated: Date.now(),
      },
      {
        id: 'vulnerabilities',
        name: 'Active Vulnerabilities',
        value: 12,
        status: 'warning',
        icon: BugAntIcon,
        trend: 'down',
        lastUpdated: Date.now(),
      },
      {
        id: 'failed-logins',
        name: 'Failed Logins (24h)',
        value: 247,
        status: 'critical',
        icon: LockClosedIcon,
        trend: 'up',
        lastUpdated: Date.now(),
      },
      {
        id: 'ssl-certificates',
        name: 'SSL Certificates',
        value: '15/15',
        status: 'secure',
        icon: KeyIcon,
        trend: 'stable',
        lastUpdated: Date.now(),
      },
      {
        id: 'firewall-blocks',
        name: 'Firewall Blocks (24h)',
        value: 1543,
        status: 'secure',
        icon: ShieldExclamationIcon,
        trend: 'stable',
        lastUpdated: Date.now(),
      },
      {
        id: 'compliance-score',
        name: 'Compliance Score',
        value: 94,
        unit: '%',
        status: 'secure',
        icon: DocumentTextIcon,
        trend: 'up',
        lastUpdated: Date.now(),
      },
    ];

    const mockVulnerabilities: VulnerabilityReport[] = [
      {
        id: 'vuln-1',
        package: 'openssl',
        version: '1.1.1',
        severity: 'critical',
        cve: 'CVE-2023-0286',
        description: 'X.509 certificate verification bypass vulnerability',
        fixedIn: '1.1.1t',
        exploitable: true,
      },
      {
        id: 'vuln-2',
        package: 'lodash',
        version: '4.17.20',
        severity: 'high',
        cve: 'CVE-2021-23337',
        description: 'Command injection vulnerability in template function',
        fixedIn: '4.17.21',
        exploitable: false,
      },
      {
        id: 'vuln-3',
        package: 'express',
        version: '4.17.1',
        severity: 'medium',
        cve: 'CVE-2022-24999',
        description: 'Cross-site scripting vulnerability in error handler',
        fixedIn: '4.18.0',
        exploitable: false,
      },
      {
        id: 'vuln-4',
        package: 'jsonwebtoken',
        version: '8.5.1',
        severity: 'low',
        cve: 'CVE-2022-23529',
        description: 'Improper validation of algorithm type',
        fixedIn: '9.0.0',
        exploitable: false,
      },
    ];

    const mockCompliance: ComplianceCheck[] = [
      {
        id: 'comp-1',
        standard: 'GDPR',
        requirement: 'Article 17 - Right to erasure',
        status: 'compliant',
        lastChecked: Date.now(),
        details: 'User data deletion mechanism implemented and tested',
      },
      {
        id: 'comp-2',
        standard: 'SOC 2',
        requirement: 'Security - Access Controls',
        status: 'compliant',
        lastChecked: Date.now(),
        details: 'Multi-factor authentication enforced for all admin accounts',
      },
      {
        id: 'comp-3',
        standard: 'PCI DSS',
        requirement: 'Requirement 6 - Secure Development',
        status: 'partial',
        lastChecked: Date.now(),
        details:
          'Code review process in place, but automated security testing needed',
      },
      {
        id: 'comp-4',
        standard: 'ISO 27001',
        requirement: 'A.12.2 - Protection from malware',
        status: 'non-compliant',
        lastChecked: Date.now(),
        details: 'Anti-malware solution not deployed on all systems',
      },
    ];

    setSecurityEvents(mockEvents);
    setSecurityMetrics(mockMetrics);
    setVulnerabilities(mockVulnerabilities);
    setComplianceChecks(mockCompliance);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'compliant':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
      case 'partial':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical':
      case 'non-compliant':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat':
        return <ShieldExclamationIcon className="h-4 w-4" />;
      case 'vulnerability':
        return <BugAntIcon className="h-4 w-4" />;
      case 'compliance':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'access':
        return <UserIcon className="h-4 w-4" />;
      case 'anomaly':
        return <ChartBarIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'events', name: 'Security Events', icon: ExclamationTriangleIcon },
    { id: 'vulnerabilities', name: 'Vulnerabilities', icon: BugAntIcon },
    { id: 'compliance', name: 'Compliance', icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive security monitoring and threat detection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Security Monitoring Active
          </span>
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

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}
                  >
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                  >
                    <span className="capitalize">{metric.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {metric.name}
                  </p>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Security Events */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Security Events
            </h3>
            <div className="space-y-3">
              {securityEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}
                  >
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {event.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}
                    >
                      {event.severity}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Events Tab */}
      {selectedTab === 'events' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Events
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {securityEvents.length} events
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${getSeverityColor(event.severity)} flex-shrink-0`}
                  >
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}
                      >
                        {event.severity}
                      </div>
                      {event.resolved && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Resolved
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Source: {event.source}</span>
                      <span>{formatTimeAgo(event.timestamp)}</span>
                      {event.affectedAssets && (
                        <span>Assets: {event.affectedAssets.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vulnerabilities Tab */}
      {selectedTab === 'vulnerabilities' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vulnerability Report
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {vulnerabilities.length} vulnerabilities found
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CVE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fix Available
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {vulnerabilities.map((vuln) => (
                  <tr
                    key={vuln.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {vuln.package}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          v{vuln.version}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}
                      >
                        {vuln.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {vuln.cve}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {vuln.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vuln.fixedIn ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                          v{vuln.fixedIn}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          No fix
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {selectedTab === 'compliance' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Compliance Status
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {
                  complianceChecks.filter((c) => c.status === 'compliant')
                    .length
                }
                /{complianceChecks.length} compliant
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {complianceChecks.map((check) => (
              <div
                key={check.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {check.standard} - {check.requirement}
                      </h4>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}
                      >
                        {check.status === 'compliant' && (
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                        )}
                        {check.status === 'non-compliant' && (
                          <XCircleIcon className="h-3 w-3 mr-1" />
                        )}
                        {check.status === 'partial' && (
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        )}
                        <span className="capitalize">
                          {check.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {check.details}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last checked: {formatTimeAgo(check.lastChecked)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
