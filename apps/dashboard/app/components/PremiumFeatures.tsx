'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

// Drag and Drop File Upload
export function DragDropUpload({
  onUpload,
}: {
  onUpload: (files: File[]) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsUploading(true);

    const files = Array.from(e.dataTransfer.files);

    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    onUpload(files);
    setIsUploading(false);

    // Show success toast
    (window as any).showToast?.({
      type: 'success',
      title: 'Files Uploaded',
      message: `Successfully uploaded ${files.length} file(s)`,
    });
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        isDragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onUpload(Array.from(e.target.files || []))}
      />

      {isUploading ? (
        <div className="space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            Uploading files...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <CloudArrowUpIcon
            className={`h-12 w-12 mx-auto transition-colors ${
              isDragOver ? 'text-primary-500' : 'text-gray-400'
            }`}
          />
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop files here to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
              >
                browse files
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Auto-save functionality
export function AutoSave({
  data,
  onSave,
}: {
  data: any;
  onSave: (data: any) => Promise<void>;
}) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>(
    'saved',
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('saving');

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        setSaveStatus('saved');
        setLastSaved(new Date());
        (window as any).playSound?.('success');
      } catch (error) {
        setSaveStatus('error');
        (window as any).showToast?.({
          type: 'error',
          title: 'Auto-save Failed',
          message: 'Failed to save changes automatically',
        });
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave]);

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'saved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved';
      case 'error':
        return 'Save failed';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}

// Offline Support
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [offlineActions, setOfflineActions] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline actions
      if (offlineActions.length > 0) {
        (window as any).showToast?.({
          type: 'info',
          title: 'Back Online',
          message: `Syncing ${offlineActions.length} offline actions...`,
        });
        // Process offline actions here
        setOfflineActions([]);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      (window as any).showToast?.({
        type: 'warning',
        title: "You're Offline",
        message: 'Changes will be saved when you reconnect',
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [offlineActions]);

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg px-4 py-2 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          You're offline - changes will sync when reconnected
        </span>
      </div>
    </div>
  );
}

// Advanced Theme Switcher
export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem('theme') as 'light' | 'dark' | 'system') ||
      'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (newTheme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
    (window as any).playSound?.('click');
  };

  const getThemeIcon = (themeOption: 'light' | 'dark' | 'system') => {
    switch (themeOption) {
      case 'light':
        return <SunIcon className="h-4 w-4" />;
      case 'dark':
        return <MoonIcon className="h-4 w-4" />;
      case 'system':
        return <ComputerDesktopIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Change theme"
      >
        {getThemeIcon(theme)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
          {['light', 'dark', 'system'].map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => handleThemeChange(themeOption as any)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                theme === themeOption
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : ''
              }`}
            >
              {getThemeIcon(themeOption as any)}
              <span className="capitalize">{themeOption}</span>
              {theme === themeOption && (
                <CheckCircleIcon className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Smart Scroll Progress
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      if (typeof window === 'undefined') return;
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', updateScrollProgress);
      return () => window.removeEventListener('scroll', updateScrollProgress);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Micro-interactions for buttons
export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props
}: any) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;

    // Ripple effect
    const button = e.currentTarget as HTMLButtonElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
    (window as any).playSound?.('click');
    onClick?.(e);
  };

  return (
    <>
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

      <button
        className={`
          ${baseClasses}
          ${variants[variant]}
          ${sizes[size]}
          ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          overflow-hidden
        `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    </>
  );
}

// Live Activity Feed
export function LiveActivityFeed() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'deploy',
      message: 'Deployed my-next-app to production',
      time: new Date(),
      user: 'You',
    },
    {
      id: 2,
      type: 'build',
      message: 'Build completed successfully',
      time: new Date(Date.now() - 300000),
      user: 'System',
    },
    {
      id: 3,
      type: 'user',
      message: 'John joined the project',
      time: new Date(Date.now() - 600000),
      user: 'John Doe',
    },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['deploy', 'build', 'user'][Math.floor(Math.random() * 3)],
        message: 'New activity detected',
        time: new Date(),
        user: 'System',
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deploy':
        return '🚀';
      case 'build':
        return '🔨';
      case 'user':
        return '👤';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Live Activity
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-500 ${
              index === 0
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : ''
            }`}
          >
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.user} • {activity.time.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
