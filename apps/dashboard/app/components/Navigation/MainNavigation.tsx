'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CogIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CommandLineIcon,
  BeakerIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BoltIcon,
  FireIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SparklesIcon,
  CloudIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  RocketLaunchIcon as RocketIconSolid,
  ChartBarIcon as ChartIconSolid,
} from '@heroicons/react/24/solid';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  iconSolid?: any;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    description: 'Overview and quick actions',
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: RocketLaunchIcon,
    iconSolid: RocketIconSolid,
    description: 'Manage your deployments',
    badge: 'New',
    children: [
      {
        name: 'All Projects',
        href: '/projects',
        icon: RocketLaunchIcon,
        description: 'View all projects',
      },
      {
        name: 'Create New',
        href: '/projects/new',
        icon: BeakerIcon,
        description: 'Start a new project',
      },
      {
        name: 'Templates',
        href: '/projects/templates',
        icon: CodeBracketIcon,
        description: 'Pre-built templates',
      },
      {
        name: 'Import from Git',
        href: '/projects/import',
        icon: CloudIcon,
        description: 'Import existing repo',
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    iconSolid: ChartIconSolid,
    description: 'Performance insights',
    children: [
      {
        name: 'Overview',
        href: '/analytics',
        icon: ChartBarIcon,
        description: 'Traffic overview',
      },
      {
        name: 'Performance',
        href: '/analytics/performance',
        icon: BoltIcon,
        description: 'Speed metrics',
      },
      {
        name: 'Real-time',
        href: '/analytics/realtime',
        icon: SparklesIcon,
        description: 'Live visitor data',
      },
      {
        name: 'Reports',
        href: '/analytics/reports',
        icon: DocumentTextIcon,
        description: 'Custom reports',
      },
    ],
  },
  {
    name: 'Domains',
    href: '/domains',
    icon: GlobeAltIcon,
    description: 'Custom domains & DNS',
    children: [
      {
        name: 'All Domains',
        href: '/domains',
        icon: GlobeAltIcon,
        description: 'Manage domains',
      },
      {
        name: 'Add Domain',
        href: '/domains/add',
        icon: BeakerIcon,
        description: 'Connect new domain',
      },
      {
        name: 'DNS Records',
        href: '/domains/dns',
        icon: CogIcon,
        description: 'DNS configuration',
      },
      {
        name: 'SSL Certificates',
        href: '/domains/ssl',
        icon: ShieldCheckIcon,
        description: 'Security settings',
      },
    ],
  },
  {
    name: '10X AI Features',
    href: '/ai',
    icon: CpuChipIcon,
    description: 'Revolutionary AI tools',
    badge: 'AI',
    children: [
      {
        name: 'Performance Optimizer',
        href: '/ai/optimizer',
        icon: BoltIcon,
        description: 'AI-powered optimization',
      },
      {
        name: 'Predictive Scaling',
        href: '/ai/scaling',
        icon: ChartBarIcon,
        description: 'Auto-scaling with ML',
      },
      {
        name: 'Smart Deployment',
        href: '/ai/deployment',
        icon: RocketLaunchIcon,
        description: 'Intelligent deploys',
      },
      {
        name: 'Code Analysis',
        href: '/ai/analysis',
        icon: CodeBracketIcon,
        description: 'AI code review',
      },
    ],
  },
  {
    name: 'Team',
    href: '/team',
    icon: UserGroupIcon,
    description: 'Collaboration tools',
    children: [
      {
        name: 'Members',
        href: '/team',
        icon: UserGroupIcon,
        description: 'Team members',
      },
      {
        name: 'Permissions',
        href: '/team/permissions',
        icon: ShieldCheckIcon,
        description: 'Access control',
      },
      {
        name: 'Activity',
        href: '/team/activity',
        icon: ChartBarIcon,
        description: 'Team activity log',
      },
    ],
  },
  {
    name: 'Documentation',
    href: '/docs',
    icon: DocumentTextIcon,
    description: 'Guides and API docs',
    children: [
      {
        name: 'Getting Started',
        href: '/docs/getting-started-with-webduh',
        icon: RocketLaunchIcon,
      },
      { name: 'Deployments', href: '/docs/deployments', icon: CloudIcon },
      { name: 'Domains', href: '/docs/domains', icon: GlobeAltIcon },
      { name: 'Functions', href: '/docs/functions', icon: CommandLineIcon },
      { name: 'CLI', href: '/docs/cli', icon: CommandLineIcon },
      { name: 'API Reference', href: '/docs/rest-api', icon: CodeBracketIcon },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    description: 'Account preferences',
    children: [
      {
        name: 'General',
        href: '/settings',
        icon: CogIcon,
        description: 'Basic settings',
      },
      {
        name: 'Security',
        href: '/settings/security',
        icon: ShieldCheckIcon,
        description: 'Security options',
      },
      {
        name: 'Billing',
        href: '/settings/billing',
        icon: BuildingOfficeIcon,
        description: 'Subscription & usage',
      },
      {
        name: 'Integrations',
        href: '/settings/integrations',
        icon: BeakerIcon,
        description: 'Third-party apps',
      },
    ],
  },
];

interface MainNavigationProps {
  className?: string;
  isMobile?: boolean;
}

export default function MainNavigation({
  className = '',
  isMobile = false,
}: MainNavigationProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-expand current section
    const currentItem = navigation.find(
      (item) => pathname.startsWith(item.href) && item.href !== '/',
    );
    if (currentItem && currentItem.children) {
      setExpandedItems([currentItem.name]);
    }
  }, [pathname]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (item: NavigationItem) => {
    return item.children?.some((child) => pathname.startsWith(child.href));
  };

  if (!mounted) {
    return (
      <nav className={`animate-pulse ${className}`}>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${className}`}>
      <div className="space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const childActive = isChildActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const showAsActive = active || childActive;

          return (
            <div key={item.name}>
              {/* Main Navigation Item */}
              <div className="group">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      showAsActive
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${isMobile ? 'text-base py-3' : ''}`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          showAsActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            item.badge === 'AI'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      } ${showAsActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${isMobile ? 'text-base py-3' : ''}`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        active
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badge === 'AI'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Submenu */}
              {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center pl-11 pr-3 py-2 text-sm rounded-lg transition-all duration-200 group ${
                        isActive(child.href)
                          ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      } ${isMobile ? 'text-base py-3' : ''}`}
                    >
                      <child.icon className="mr-3 h-4 w-4" />
                      <span className="truncate">{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 10X Platform Badge */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white">
        <div className="flex items-center space-x-2 mb-2">
          <FireIcon className="h-5 w-5" />
          <span className="font-semibold">webduh 10X</span>
        </div>
        <p className="text-xs text-purple-100 mb-3">
          Revolutionary deployment platform - 10x better than competitors!
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/10 rounded p-1 text-center">
            <div className="font-bold">1000%</div>
            <div>Performance</div>
          </div>
          <div className="bg-white/10 rounded p-1 text-center">
            <div className="font-bold">90%</div>
            <div>Cost Savings</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
