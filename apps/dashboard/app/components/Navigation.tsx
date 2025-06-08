'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FireIcon,
  PlusIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ThemeSwitcher } from './PremiumFeatures';
import { SmartSearch } from './UXEnhancements';

const navigationItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/settings', label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <FireIcon className="h-8 w-8 text-primary-600 group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                webduh
              </span>
            </Link>
            <nav className="ml-10 flex space-x-6">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-2 py-1 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <SmartSearch className="hidden md:block" />
            <ThemeSwitcher className="hidden md:block" />
            <Link
              href="/deploy"
              className="inline-flex items-center px-3 py-2 rounded-md bg-primary-600 text-white font-semibold text-sm shadow hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </Link>
            <Link
              href="/settings/profile"
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:ring-2 hover:ring-primary-500 transition"
              aria-label="User Profile"
            >
              <UserCircleIcon className="h-7 w-7 text-gray-500 dark:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
