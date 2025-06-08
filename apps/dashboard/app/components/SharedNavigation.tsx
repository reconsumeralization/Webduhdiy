'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ThemeToggle, useTheme } from '@webduh/shared-ui/src/hooks/useTheme';
import {
  LayoutDashboard,
  Rocket,
  Settings,
  BarChart3,
  Zap,
  Globe,
  GitBranch,
  Activity,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

// Enhanced navigation configuration with icons
const navigationConfig = {
  brand: {
    name: 'WebduhVercel',
    href: '/',
    icon: Rocket,
  },
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      id: 'deployments',
      label: 'Deployments',
      href: '/deployments',
      icon: Rocket,
      badge: 'NEW',
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      href: '/ai-builder',
      icon: Sparkles,
      badge: 'BETA',
      children: [
        {
          id: 'ai-builder',
          label: 'AI Builder',
          href: '/ai-builder',
          icon: Sparkles,
        },
        {
          id: 'bolt-diy',
          label: 'Bolt DIY',
          href: 'http://localhost:5173',
          icon: Zap,
          external: true,
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      icon: GitBranch,
      children: [
        {
          id: 'all-projects',
          label: 'All Projects',
          href: '/projects',
          icon: GitBranch,
        },
        {
          id: 'new-project',
          label: 'New Project',
          href: '/projects/new',
          icon: Zap,
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      id: 'status',
      label: 'Status',
      href: '/status',
      icon: Activity,
    },
  ],
};

export function SharedNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdowns(new Set());
  }, [pathname]);

  const handleNavigate = (href: string, external?: boolean) => {
    if (external || href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
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
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'NEW':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'BETA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'HOT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg'
            : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavigate(navigationConfig.brand.href)}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {navigationConfig.brand.name}
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationConfig.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isDropdownOpen = openDropdowns.has(item.id);
                const itemIsActive = isActive(item.href);
                const Icon = item.icon;

                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleDropdown(item.id);
                        } else {
                          handleNavigate(item.href);
                        }
                      }}
                      className={`webduh-nav-link group ${itemIsActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(item.badge)}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {hasChildren && isDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 animate-fade-in-down">
                        <div className="webduh-card p-2 shadow-xl border-0">
                          {item.children!.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <button
                                key={child.id}
                                onClick={() =>
                                  handleNavigate(child.href, child.external)
                                }
                                className={`flex items-center w-full px-3 py-2.5 text-sm text-left transition-all duration-200 rounded-lg group ${
                                  isActive(child.href)
                                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                                }`}
                              >
                                {ChildIcon && (
                                  <ChildIcon className="w-4 h-4 mr-3" />
                                )}
                                <span className="flex-1">{child.label}</span>
                                {child.external && (
                                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-75" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle className="hidden md:flex" />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-fade-in-down">
            <div className="px-4 py-4 space-y-2">
              {navigationConfig.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isDropdownOpen = openDropdowns.has(item.id);
                const itemIsActive = isActive(item.href);
                const Icon = item.icon;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleDropdown(item.id);
                        } else {
                          handleNavigate(item.href);
                        }
                      }}
                      className={`flex items-center justify-between w-full px-3 py-3 text-left rounded-lg transition-colors ${
                        itemIsActive
                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(item.badge)}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {hasChildren && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {hasChildren && isDropdownOpen && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <button
                              key={child.id}
                              onClick={() =>
                                handleNavigate(child.href, child.external)
                              }
                              className={`flex items-center w-full px-3 py-2 text-sm text-left transition-colors rounded-lg ${
                                isActive(child.href)
                                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-400'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                              }`}
                            >
                              {ChildIcon && (
                                <ChildIcon className="w-4 h-4 mr-3" />
                              )}
                              <span className="flex-1">{child.label}</span>
                              {child.external && (
                                <ExternalLink className="w-3 h-3 opacity-50" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
}
