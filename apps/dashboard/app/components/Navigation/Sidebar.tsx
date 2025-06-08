'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RocketLaunchIcon,
  FolderIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
  CreditCardIcon,
  BellIcon,
  CommandLineIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const navigationItems = [
  {
    name: 'Overview',
    href: '/',
    icon: HomeIcon,
    description: 'Dashboard overview',
  },
  {
    name: 'AI Builder',
    href: '/ai-builder',
    icon: SparklesIcon,
    description: 'AI-powered code generation',
    featured: true,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderIcon,
    description: 'Manage your projects',
    children: [
      { name: 'All Projects', href: '/projects' },
      { name: 'Create New', href: '/projects/new' },
      { name: 'Templates', href: '/templates' },
    ],
  },
  {
    name: 'Deployments',
    href: '/deployments',
    icon: RocketLaunchIcon,
    description: 'View deployment history',
  },
  {
    name: 'Domains',
    href: '/domains',
    icon: GlobeAltIcon,
    description: 'Manage custom domains',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Performance insights',
  },
  {
    name: 'Activity',
    href: '/activity',
    icon: ClockIcon,
    description: 'Recent activity logs',
  },
  {
    name: 'Team',
    href: '/team',
    icon: UserGroupIcon,
    description: 'Collaborate with team',
  },
  {
    name: 'Guides',
    href: '/guides',
    icon: BookOpenIcon,
    description: 'Documentation & tutorials',
  },
  {
    name: 'CLI',
    href: '/cli',
    icon: CommandLineIcon,
    description: 'Command line tools',
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCardIcon,
    description: 'Manage subscription',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    description: 'Account settings',
  },
];

const quickActions = [
  {
    name: 'New Project',
    href: '/projects/new',
    icon: PlusIcon,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Deploy',
    href: '/deploy',
    icon: RocketLaunchIcon,
    color: 'bg-green-600 hover:bg-green-700',
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedItems([]);
    }
  };

  const toggleExpanded = (itemName: string) => {
    if (isCollapsed) return;

    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    plan: 'Pro',
  };

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                webduh
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const isItemActive = isActive(item.href);

          return (
            <div key={item.name}>
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isItemActive
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => (hasChildren ? toggleExpanded(item.name) : null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 flex-1"
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isItemActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500'
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
                {hasChildren && !isCollapsed && (
                  <ChevronRightIcon
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </div>

              {/* Children */}
              {hasChildren && !isCollapsed && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(child.href)
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Notifications */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <BellIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                  New deployment ready
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  my-nextjs-app deployed successfully to production
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs font-medium rounded">
                {user.plan}
              </div>
            </div>

            <div className="flex space-x-1">
              <Link
                href="/settings"
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <Cog6ToothIcon className="h-3 w-3 mr-1" />
                Settings
              </Link>
              <button className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <ArrowRightOnRectangleIcon className="h-3 w-3 mr-1" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
