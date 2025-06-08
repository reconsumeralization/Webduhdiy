import React, { useState } from 'react';
import { NavigationProps, NavigationItem } from './types';

// Default icons (you can replace with actual icon library)
const DefaultIcons = {
  Menu: ({ className = '' }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  X: ({ className = '' }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  ChevronDown: ({ className = '' }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  ExternalLink: ({ className = '' }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  ),
};

export const Navigation: React.FC<NavigationProps> = ({
  config,
  currentPath,
  onNavigate,
  className = '',
  theme = 'auto',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const handleNavigation = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(href);
    } else {
      // Fallback to window.location if no custom navigation handler
      window.location.href = href;
    }
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (itemId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(itemId)) {
      newOpenDropdowns.delete(itemId);
    } else {
      newOpenDropdowns.add(itemId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.has(item.id);
    const itemIsActive = isActive(item.href);

    const baseClasses = `
      flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
      ${isMobile ? 'w-full justify-between' : ''}
      ${
        itemIsActive
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
      }
    `;

    return (
      <div key={item.id} className={isMobile ? 'w-full' : 'relative'}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleDropdown(item.id);
            } else {
              handleNavigation(item.href, item.external);
            }
          }}
          className={baseClasses}
          title={item.label}
        >
          <div className="flex items-center space-x-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
            {item.badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {item.badge}
              </span>
            )}
            {item.external && (
              <DefaultIcons.ExternalLink className="h-3 w-3 opacity-50" />
            )}
          </div>
          {hasChildren && (
            <DefaultIcons.ChevronDown
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {hasChildren && isDropdownOpen && (
          <div
            className={`
            ${
              isMobile
                ? 'pl-6 space-y-1'
                : 'absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50'
            }
          `}
          >
            {item.children!.map((child) => (
              <button
                key={child.id}
                onClick={() => handleNavigation(child.href, child.external)}
                className={`
                  flex items-center w-full px-3 py-2 text-sm text-left transition-colors duration-200
                  ${
                    isActive(child.href)
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }
                  ${!isMobile ? 'rounded-md mx-1' : ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  {child.icon && <child.icon className="h-4 w-4" />}
                  <span>{child.label}</span>
                  {child.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {child.badge}
                    </span>
                  )}
                  {child.external && (
                    <DefaultIcons.ExternalLink className="h-3 w-3 opacity-50" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation(config.brand.href)}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {config.brand.logo && (
                <img
                  src={config.brand.logo}
                  alt={config.brand.name}
                  className="h-8 w-8"
                />
              )}
              <span>{config.brand.name}</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {config.items.map((item) => renderNavigationItem(item, false))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {config.user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {config.user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {config.user.email}
                  </div>
                </div>
                {config.user.avatar && (
                  <img
                    src={config.user.avatar}
                    alt={config.user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <DefaultIcons.X className="h-6 w-6" />
              ) : (
                <DefaultIcons.Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {config.items.map((item) => renderNavigationItem(item, true))}

            {config.user && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  {config.user.avatar && (
                    <img
                      src={config.user.avatar}
                      alt={config.user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {config.user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {config.user.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
