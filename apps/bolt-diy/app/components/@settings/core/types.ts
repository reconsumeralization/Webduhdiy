import type { ReactNode } from 'react';

export type SettingCategory =
  | 'general'
  | 'ai'
  | 'developer'
  | 'data'
  | 'ui'
  | 'profile'
  | 'file_sharing'
  | 'connectivity'
  | 'system'
  | 'services'
  | 'preferences';

export type TabType =
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'features'
  | 'data'
  | 'cloud-providers'
  | 'local-providers'
  | 'service-status'
  | 'connection'
  | 'debug'
  | 'event-logs'
  | 'update'
  | 'task-manager'
  | 'tab-management'
  | 'editor';

export type WindowType = 'user' | 'developer';

export interface UserProfile {
  nickname: string;
  name: string;
  email: string;
  avatar?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  password?: string;
  bio?: string;
  language: string;
  timezone: string;
}

export interface SettingItem {
  id: TabType;
  label: string;
  icon: string;
  category: SettingCategory;
  description?: string;
  component: () => ReactNode;
  badge?: string;
  keywords?: string[];
}

export interface TabVisibilityConfig {
  id: TabType;
  visible: boolean;
  window: WindowType;
  order: number;
  isExtraDevTab?: boolean;
  locked?: boolean;
}

export interface DevTabConfig extends TabVisibilityConfig {
  window: 'developer';
}

export interface UserTabConfig extends TabVisibilityConfig {
  window: 'user';
}

export interface TabWindowConfig {
  userTabs: UserTabConfig[];
  developerTabs: DevTabConfig[];
}

export const TAB_LABELS: Record<TabType, string> = {
  profile: 'Profile',
  settings: 'Settings',
  notifications: 'Notifications',
  features: 'Features',
  data: 'Data Management',
  'cloud-providers': 'Cloud Providers',
  'local-providers': 'Local Providers',
  'service-status': 'Service Status',
  connection: 'Connections',
  debug: 'Debug',
  'event-logs': 'Event Logs',
  update: 'Updates',
  'task-manager': 'Task Manager',
  'tab-management': 'Tab Management',
  editor: 'Editor',
};

export const categoryLabels: Record<SettingCategory, string> = {
  general: 'General',
  ai: 'AI',
  developer: 'Developer',
  data: 'Data',
  ui: 'UI',
  profile: 'Profile & Account',
  file_sharing: 'File Sharing',
  connectivity: 'Connectivity',
  system: 'System',
  services: 'Services',
  preferences: 'Preferences',
};

export const categoryIcons: Record<SettingCategory, string> = {
  general: 'i-ph:gear',
  ai: 'i-ph:brain',
  developer: 'i-ph:code',
  data: 'i-ph:database',
  ui: 'i-ph:paint-brush',
  profile: 'i-ph:user-circle',
  file_sharing: 'i-ph:folder-simple',
  connectivity: 'i-ph:wifi-high',
  system: 'i-ph:gear',
  services: 'i-ph:cube',
  preferences: 'i-ph:sliders',
};

export interface Profile {
  username?: string;
  bio?: string;
  avatar?: string;
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
  };
}
