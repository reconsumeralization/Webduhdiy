'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  CommandLineIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

// Global keyboard shortcuts
export function KeyboardShortcuts() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }

      // Quick shortcuts
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            // Toggle dark mode
            document.documentElement.classList.toggle('dark');
            break;
          case 'N':
            e.preventDefault();
            // New project shortcut
            window.location.href = '/projects/new';
            break;
          case 'S':
            e.preventDefault();
            // Settings shortcut
            window.location.href = '/settings';
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandPalette
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
    />
  );
}

// Command Palette
function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      name: 'New Project',
      action: () => (window.location.href = '/projects/new'),
      icon: '🚀',
    },
    { name: 'Deploy Latest', action: () => console.log('Deploy'), icon: '📦' },
    {
      name: 'View Analytics',
      action: () => (window.location.href = '/analytics'),
      icon: '📊',
    },
    {
      name: 'Settings',
      action: () => (window.location.href = '/settings'),
      icon: '⚙️',
    },
    {
      name: 'Documentation',
      action: () => (window.location.href = '/docs'),
      icon: '📚',
    },
    {
      name: 'Toggle Dark Mode',
      action: () => document.documentElement.classList.toggle('dark'),
      icon: '🌙',
    },
    {
      name: 'Support',
      action: () => window.open('mailto:support@webduh.com'),
      icon: '💬',
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedIndex, filteredCommands]);

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-start justify-center p-4 text-center sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <div className="relative mt-20 w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
            <div className="p-4">
              <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                <CommandLineIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none text-gray-900 dark:text-white placeholder-gray-500"
                  autoFocus
                />
                <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ⌘K
                </div>
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto">
                {filteredCommands.map((command, index) => (
                  <div
                    key={command.name}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                  >
                    <span className="text-xl">{command.icon}</span>
                    <span className="flex-1">{command.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

// Enhanced Toast System
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Global toast function
  useEffect(() => {
    (window as any).showToast = addToast;
  }, [addToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XMarkIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Transition
          key={toast.id}
          show={true}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${getColors(toast.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">{getIcon(toast.type)}</div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {toast.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {toast.message}
                </p>
                {toast.action && (
                  <div className="mt-3">
                    <button
                      onClick={toast.action.onClick}
                      className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
}

// Smart Search with Instant Results
export function SmartSearch({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchData = useMemo(
    () => [
      {
        type: 'project',
        title: 'My Next App',
        url: '/projects/my-next-app',
        description: 'React application with SSR',
      },
      {
        type: 'deployment',
        title: 'Latest Deployment',
        url: '/deployments/abc123',
        description: 'Deployed 2 hours ago',
      },
      {
        type: 'docs',
        title: 'Getting Started',
        url: '/docs/getting-started',
        description: 'Learn how to deploy your first app',
      },
      {
        type: 'settings',
        title: 'Environment Variables',
        url: '/settings/env-vars',
        description: 'Manage your app configuration',
      },
    ],
    [],
  );

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API search with debouncing
      const timer = setTimeout(() => {
        const filtered = searchData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, searchData]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects, deployments, docs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
          ⌘K
        </div>
      </div>

      {isOpen && (query.length > 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        result.type === 'project'
                          ? 'bg-blue-500'
                          : result.type === 'deployment'
                            ? 'bg-green-500'
                            : result.type === 'docs'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {result.type}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Contextual Help System
export function ContextualHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      title: 'Quick Deploy',
      content: 'Press Cmd+Shift+D to quickly deploy your latest changes.',
      action: {
        label: 'Try it',
        onClick: () => console.log('Deploy shortcut'),
      },
    },
    {
      title: 'Environment Variables',
      content:
        'Set up environment variables in Settings to configure your deployments.',
      action: {
        label: 'Go to Settings',
        onClick: () => (window.location.href = '/settings'),
      },
    },
    {
      title: 'Custom Domains',
      content: 'Add custom domains to your projects for professional URLs.',
      action: {
        label: 'Learn More',
        onClick: () => (window.location.href = '/docs/domains'),
      },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);

    // Show first tip after 3 seconds
    setTimeout(() => setIsVisible(true), 3000);

    return () => clearInterval(timer);
  }, [tips.length]);

  if (!isVisible) return null;

  const tip = tips[currentTip];

  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-40">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              💡 {tip.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {tip.content}
            </p>
            {tip.action && (
              <button
                onClick={tip.action.onClick}
                className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
              >
                {tip.action.label} →
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center mt-3 space-x-1">
        {tips.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentTip
                ? 'bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Sound Effects System
export function SoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playSound = (type: string) => {
    if (!soundEnabled || typeof window === 'undefined') return;

    // Create audio context for better performance
    const audioContext = new ((window as any).AudioContext ||
      (window as any).webkitAudioContext)();

    const frequencies: { [key: string]: number } = {
      success: 800,
      error: 200,
      notification: 600,
      click: 1000,
      deploy: 400,
    };

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequencies[type] || 500,
      audioContext.currentTime,
    );
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  useEffect(() => {
    // Global sound function
    if (typeof window !== 'undefined') {
      (window as any).playSound = playSound;
    }
  }, [soundEnabled]);

  return (
    <button
      onClick={() => setSoundEnabled(!soundEnabled)}
      className={`fixed bottom-20 left-4 p-2 rounded-full transition-colors ${
        soundEnabled
          ? 'bg-primary-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}
      title={`Sound effects ${soundEnabled ? 'enabled' : 'disabled'}`}
    >
      {soundEnabled ? (
        <SpeakerWaveIcon className="h-4 w-4" />
      ) : (
        <SpeakerXMarkIcon className="h-4 w-4" />
      )}
    </button>
  );
}

// Performance Monitor
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateMetrics = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory,
          loadTime: Math.round(performance.now()),
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(updateMetrics);
    };

    requestAnimationFrame(updateMetrics);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-20 p-1 text-xs bg-gray-800 text-green-400 rounded font-mono opacity-50 hover:opacity-100"
      >
        PERF
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono space-y-1 min-w-[120px]">
      <div className="flex justify-between">
        <span>FPS:</span>
        <span
          className={
            metrics.fps < 30
              ? 'text-red-400'
              : metrics.fps < 50
                ? 'text-yellow-400'
                : 'text-green-400'
          }
        >
          {metrics.fps}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Memory:</span>
        <span>{metrics.memory}MB</span>
      </div>
      <div className="flex justify-between">
        <span>Load:</span>
        <span>{metrics.loadTime}ms</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-500 hover:text-gray-300 text-center w-full"
      >
        ×
      </button>
    </div>
  );
}

// Main UX Enhancements Provider
export default function UXEnhancements({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <KeyboardShortcuts />
      <ToastContainer />
      <ContextualHelp />
      <SoundEffects />
      <PerformanceMonitor />
    </>
  );
}
