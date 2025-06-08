'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface TopBarProps {
  onToggleSidebar?: () => void;
  className?: string;
}

interface Notification {
  id: string;
  type: 'deployment' | 'domain' | 'team' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  plan: string;
  role: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deployment',
    title: 'Deployment Successful',
    message: 'my-nextjs-app deployed to production',
    timestamp: '2024-03-10T15:30:00Z',
    read: false,
    actionUrl: '/deployments/dep_123',
  },
  {
    id: '2',
    type: 'domain',
    title: 'SSL Certificate Renewed',
    message: 'Certificate for myapp.com renewed successfully',
    timestamp: '2024-03-10T12:00:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'team',
    title: 'New Team Member',
    message: 'Sarah Wilson joined your team',
    timestamp: '2024-03-09T18:45:00Z',
    read: true,
  },
];

const mockTeams: Team[] = [
  {
    id: 'team_1',
    name: 'Personal',
    slug: 'personal',
    plan: 'Pro',
    role: 'Owner',
  },
  {
    id: 'team_2',
    name: 'Acme Corp',
    slug: 'acme-corp',
    plan: 'Enterprise',
    role: 'Admin',
  },
  {
    id: 'team_3',
    name: 'Startup Inc',
    slug: 'startup-inc',
    plan: 'Team',
    role: 'Member',
  },
];

export default function TopBar({
  onToggleSidebar,
  className = '',
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [currentTeam, setCurrentTeam] = useState(mockTeams[0]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const teamSwitcherRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        teamSwitcherRef.current &&
        !teamSwitcherRef.current.contains(event.target as Node)
      ) {
        setShowTeamSwitcher(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return '🚀';
      case 'domain':
        return '🌐';
      case 'team':
        return '👥';
      case 'system':
        return '⚙️';
      default:
        return '📄';
    }
  };

  const searchResults = [
    { type: 'project', name: 'my-nextjs-app', url: '/projects/proj_1' },
    {
      type: 'deployment',
      name: 'Production deployment #123',
      url: '/deployments/dep_123',
    },
    { type: 'domain', name: 'myapp.com', url: '/domains/dom_1' },
  ].filter(
    (item) =>
      searchQuery &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <header
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Team Switcher */}
          <div className="relative" ref={teamSwitcherRef}>
            <button
              onClick={() => setShowTeamSwitcher(!showTeamSwitcher)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {currentTeam.name.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTeam.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentTeam.plan} • {currentTeam.role}
                </div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {showTeamSwitcher && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Switch Team
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => {
                        setCurrentTeam(team);
                        setShowTeamSwitcher(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {team.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {team.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {team.plan} • {team.role}
                        </div>
                      </div>
                      {currentTeam.id === team.id && (
                        <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <Link
                    href="/team/new"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowTeamSwitcher(false)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Create new team</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-lg mx-4" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects, deployments, domains..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
            />

            {showSearch && (searchQuery || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        href={result.url}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                          {result.type}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {result.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Start typing to search...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
            >
              <SunIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
            >
              <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
            >
              <ComputerDesktopIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                          !notification.read
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatTimeAgo(notification.timestamp)}
                                </p>
                              </div>
                              <div className="flex space-x-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                  >
                                    <CheckIcon className="h-3 w-3 text-gray-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                  <XMarkIcon className="h-3 w-3 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <BellIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    john@example.com
                  </p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <CogIcon className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/cli"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <CommandLineIcon className="h-4 w-4" />
                  <span>CLI Documentation</span>
                </Link>
                <Link
                  href="/guides"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  <span>Help & Guides</span>
                </Link>
                <hr className="border-gray-200 dark:border-gray-700 my-2" />
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
