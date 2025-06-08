'use client';

import React, { useState, useEffect } from 'react';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';
import Breadcrumbs, { EnhancedBreadcrumbs } from './Breadcrumbs';
import {
  ScrollProgress,
  OfflineIndicator,
  ThemeSwitcher,
} from '../PremiumFeatures';
import { SmartSearch } from '../UXEnhancements';
import {
  FireIcon,
  BellIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export default function PageLayout({
  children,
  title,
  description,
  breadcrumbs,
  showSidebar = true,
  sidebarContent,
  headerActions,
  className = '',
}: PageLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for saved sidebar state
    const savedState = localStorage.getItem('webduh-sidebar-collapsed');
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('webduh-sidebar-collapsed', JSON.stringify(newState));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
        <div className="flex">
          <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen"></div>
          <div className="flex-1">
            <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${className}`}>
      <ScrollProgress />
      <OfflineIndicator />

      {/* Mobile Navigation */}
      <MobileNavigation />

      <div className="flex">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div
            className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${
              sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
            } transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <div
                className={`flex items-center space-x-2 transition-opacity duration-300 ${
                  sidebarCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <FireIcon className="h-8 w-8 text-primary-600 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      webduh
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full">
                      10X
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={
                  sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                }
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <MainNavigation />
            </div>

            {/* Keyboard Shortcut Hint */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <CommandLineIcon className="h-4 w-4" />
                  <span>Press ⌘K for command palette</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 ${showSidebar ? (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''} transition-all duration-300 ease-in-out`}
        >
          {/* Desktop Header */}
          <header className="hidden lg:flex lg:items-center lg:justify-between lg:h-16 lg:px-6 lg:border-b lg:border-gray-200 lg:dark:border-gray-800 lg:bg-white lg:dark:bg-gray-900 lg:sticky lg:top-0 lg:z-30 lg:backdrop-blur-sm lg:bg-opacity-95 lg:dark:bg-opacity-95">
            <div className="flex items-center space-x-4">
              {/* Breadcrumbs */}
              <EnhancedBreadcrumbs items={breadcrumbs} />
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="w-96">
                <SmartSearch />
              </div>

              {/* Header Actions */}
              {headerActions}

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  John Doe
                </span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {/* Page Header */}
            {(title || description) && (
              <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex items-center justify-between">
                    <div>
                      {title && (
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {title}
                        </h1>
                      )}
                      {description && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      )}
                    </div>
                    {headerActions && (
                      <div className="lg:hidden">{headerActions}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
          </main>
        </div>

        {/* Right Sidebar (Optional) */}
        {sidebarContent && (
          <div className="hidden xl:block xl:w-80 xl:border-l xl:border-gray-200 xl:dark:border-gray-800 xl:bg-white xl:dark:bg-gray-900">
            <div className="p-6">{sidebarContent}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Layout Variants
export function DashboardLayout({
  children,
  ...props
}: Omit<PageLayoutProps, 'showSidebar'>) {
  return (
    <PageLayout showSidebar={true} {...props}>
      {children}
    </PageLayout>
  );
}

export function FullWidthLayout({
  children,
  ...props
}: Omit<PageLayoutProps, 'showSidebar'>) {
  return (
    <PageLayout showSidebar={false} {...props}>
      {children}
    </PageLayout>
  );
}

export function DocsLayout({ children, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      showSidebar={true}
      sidebarContent={
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Documentation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick access to guides and API references.
          </p>
        </div>
      }
      {...props}
    >
      {children}
    </PageLayout>
  );
}
