'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CogIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CpuChipIcon,
  BoltIcon,
  FireIcon,
  CommandLineIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Command {
  id: string;
  name: string;
  description: string;
  icon: any;
  shortcut?: string;
  category: 'navigation' | 'actions' | 'ai' | 'recent' | 'suggestions';
  action: () => void;
  keywords?: string[];
  priority?: number;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands: Command[] = [
  // Navigation Commands
  {
    id: 'nav-dashboard',
    name: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    icon: FireIcon,
    shortcut: '⌘H',
    category: 'navigation',
    action: () => (window.location.href = '/'),
    keywords: ['home', 'dashboard', 'overview'],
    priority: 10,
  },
  {
    id: 'nav-projects',
    name: 'View All Projects',
    description: 'See all your deployment projects',
    icon: RocketLaunchIcon,
    shortcut: '⌘P',
    category: 'navigation',
    action: () => (window.location.href = '/projects'),
    keywords: ['projects', 'deployments', 'apps'],
    priority: 9,
  },
  {
    id: 'nav-analytics',
    name: 'Analytics Dashboard',
    description: 'View performance analytics',
    icon: ChartBarIcon,
    shortcut: '⌘A',
    category: 'navigation',
    action: () => (window.location.href = '/analytics'),
    keywords: ['analytics', 'metrics', 'performance', 'stats'],
    priority: 8,
  },
  {
    id: 'nav-domains',
    name: 'Manage Domains',
    description: 'Configure custom domains',
    icon: GlobeAltIcon,
    shortcut: '⌘D',
    category: 'navigation',
    action: () => (window.location.href = '/domains'),
    keywords: ['domains', 'dns', 'ssl', 'custom domain'],
    priority: 7,
  },

  // Action Commands
  {
    id: 'action-new-project',
    name: 'Create New Project',
    description: 'Start a new deployment project',
    icon: RocketLaunchIcon,
    shortcut: '⌘N',
    category: 'actions',
    action: () => (window.location.href = '/projects/new'),
    keywords: ['new', 'create', 'deploy', 'project'],
    priority: 10,
  },
  {
    id: 'action-deploy',
    name: 'Quick Deploy',
    description: 'Deploy your latest changes',
    icon: BoltIcon,
    category: 'actions',
    action: () => console.log('Starting deployment...'),
    keywords: ['deploy', 'build', 'publish'],
    priority: 9,
  },
  {
    id: 'action-rollback',
    name: 'Instant Rollback',
    description: 'Rollback to previous deployment',
    icon: ClockIcon,
    category: 'actions',
    action: () => console.log('Rolling back...'),
    keywords: ['rollback', 'revert', 'previous'],
    priority: 8,
  },

  // AI Commands
  {
    id: 'ai-optimize',
    name: 'AI Performance Optimizer',
    description: 'Optimize your app with AI',
    icon: CpuChipIcon,
    category: 'ai',
    action: () => (window.location.href = '/ai/optimizer'),
    keywords: ['ai', 'optimize', 'performance', 'ml'],
    priority: 10,
  },
  {
    id: 'ai-scale',
    name: 'Predictive Auto-Scaling',
    description: 'Set up intelligent scaling',
    icon: ChartBarIcon,
    category: 'ai',
    action: () => (window.location.href = '/ai/scaling'),
    keywords: ['ai', 'scaling', 'auto-scale', 'prediction'],
    priority: 9,
  },
  {
    id: 'ai-analysis',
    name: 'AI Code Analysis',
    description: 'Analyze code with AI',
    icon: SparklesIcon,
    category: 'ai',
    action: () => (window.location.href = '/ai/analysis'),
    keywords: ['ai', 'code', 'analysis', 'review'],
    priority: 8,
  },

  // Recent/Suggestions
  {
    id: 'recent-my-app',
    name: 'my-next-app',
    description: 'Recently deployed project',
    icon: RocketLaunchIcon,
    category: 'recent',
    action: () => (window.location.href = '/projects/my-next-app'),
    keywords: ['recent', 'my-next-app'],
    priority: 5,
  },
  {
    id: 'suggestion-docs',
    name: 'Getting Started Guide',
    description: 'Learn webduh basics',
    icon: DocumentTextIcon,
    category: 'suggestions',
    action: () => (window.location.href = '/docs/getting-started-with-webduh'),
    keywords: ['docs', 'guide', 'help', 'tutorial'],
    priority: 3,
  },
];

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);

  // Filter commands based on search query
  useEffect(() => {
    if (!query.trim()) {
      // Show all commands grouped by category when no query
      const sortedCommands = commands
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 8); // Limit initial results
      setFilteredCommands(sortedCommands);
    } else {
      // AI-powered fuzzy search
      const filtered = commands
        .filter((command) => {
          const searchText = query.toLowerCase();
          const nameMatch = command.name.toLowerCase().includes(searchText);
          const descMatch = command.description
            .toLowerCase()
            .includes(searchText);
          const keywordMatch = command.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchText),
          );
          return nameMatch || descMatch || keywordMatch;
        })
        .sort((a, b) => {
          // Prioritize exact name matches
          const aNameMatch = a.name
            .toLowerCase()
            .startsWith(query.toLowerCase());
          const bNameMatch = b.name
            .toLowerCase()
            .startsWith(query.toLowerCase());
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;

          // Then by priority
          return (b.priority || 0) - (a.priority || 0);
        })
        .slice(0, 8);

      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    },
    [isOpen, onClose, filteredCommands, selectedIndex],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCategoryLabel = (category: Command['category']) => {
    switch (category) {
      case 'navigation':
        return '🧭 Navigation';
      case 'actions':
        return '⚡ Actions';
      case 'ai':
        return '🤖 AI Features';
      case 'recent':
        return '🕒 Recent';
      case 'suggestions':
        return '💡 Suggestions';
      default:
        return '';
    }
  };

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    },
    {} as Record<Command['category'], Command[]>,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed top-[10%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Search Input */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search webduh... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
              autoFocus
            />
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                ESC
              </kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <div className="px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                  {getCategoryLabel(category as Command['category'])}
                </div>
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      className={`w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
                          : ''
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <command.icon
                          className={`h-4 w-4 ${
                            isSelected
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            isSelected
                              ? 'text-primary-900 dark:text-primary-100'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {command.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {command.description}
                        </p>
                      </div>
                      {command.shortcut && (
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    ↑↓
                  </kbd>
                  <span>navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    ⏎
                  </kbd>
                  <span>select</span>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  webduh 10X
                </span>
                <span className="ml-1">AI-Powered Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global command palette hook
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
