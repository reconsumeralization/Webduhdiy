'use client';

import React, { useState, useEffect } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  FireIcon,
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import MainNavigation from './MainNavigation';
import { ThemeSwitcher } from '../PremiumFeatures';
import { SmartSearch } from '../UXEnhancements';

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({
  className = '',
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (!mounted) {
    return (
      <div className={`lg:hidden ${className}`}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FireIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              webduh
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full">
              10X
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-full overflow-y-auto bg-white dark:bg-gray-900 shadow-xl animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <FireIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  webduh
                </span>
                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full">
                  10X
                </span>
              </div>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search webduh..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    john@example.com
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 pb-20">
              <MainNavigation isMobile={true} />
            </div>

            {/* Quick Stats */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    12
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Projects
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">99.9%</div>
                  <div className="text-gray-500 dark:text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">2.4K</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Deploys
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
