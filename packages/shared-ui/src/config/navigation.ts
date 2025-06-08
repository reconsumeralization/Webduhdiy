import { NavigationConfig } from '../components/Navigation/types';

// WebduhVercel Platform Navigation Configuration
export const webduhNavigationConfig: NavigationConfig = {
  brand: {
    name: 'WebduhVercel',
    href: '/',
  },
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      href: '/ai-builder',
      badge: 'New',
      children: [
        {
          id: 'ai-builder',
          label: 'AI Builder',
          href: '/ai-builder',
        },
        {
          id: 'bolt-diy',
          label: 'Bolt.DIY',
          href: 'http://localhost:5173',
          external: true,
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      children: [
        {
          id: 'all-projects',
          label: 'All Projects',
          href: '/projects',
        },
        {
          id: 'new-project',
          label: 'New Project',
          href: '/projects/new',
        },
        {
          id: 'deployments',
          label: 'Deployments',
          href: '/deployments',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
    },
    {
      id: 'resources',
      label: 'Resources',
      href: '/templates',
      children: [
        {
          id: 'templates',
          label: 'Templates',
          href: '/templates',
        },
        {
          id: 'docs',
          label: 'Documentation',
          href: '/docs',
        },
        {
          id: 'guides',
          label: 'Guides',
          href: '/guides',
        },
      ],
    },
    {
      id: 'system',
      label: 'System',
      href: '/status',
      children: [
        {
          id: 'status',
          label: 'Status',
          href: '/status',
        },
        {
          id: 'activity',
          label: 'Activity',
          href: '/activity',
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
        },
      ],
    },
  ],
  user: {
    name: 'WebduhVercel User',
    email: 'user@webduhvercel.com',
  },
};

// Environment-specific navigation configs
export const getDashboardNavigationConfig = (): NavigationConfig => ({
  ...webduhNavigationConfig,
  brand: {
    ...webduhNavigationConfig.brand,
    href: '/',
  },
});

export const getBoltDIYNavigationConfig = (): NavigationConfig => ({
  ...webduhNavigationConfig,
  brand: {
    ...webduhNavigationConfig.brand,
    href: 'http://localhost:3000',
  },
  items: [
    {
      id: 'bolt-diy-home',
      label: 'Bolt.DIY',
      href: '/',
    },
    {
      id: 'back-to-dashboard',
      label: 'Dashboard',
      href: 'http://localhost:3000',
      external: true,
    },
    ...webduhNavigationConfig.items.filter((item) => item.id !== 'dashboard'),
  ],
});

export const getAPINavigationConfig = (): NavigationConfig => ({
  ...webduhNavigationConfig,
  brand: {
    ...webduhNavigationConfig.brand,
    href: 'http://localhost:3000',
  },
  items: [
    {
      id: 'api-docs',
      label: 'API Docs',
      href: '/docs',
    },
    {
      id: 'back-to-dashboard',
      label: 'Dashboard',
      href: 'http://localhost:3000',
      external: true,
    },
  ],
});
