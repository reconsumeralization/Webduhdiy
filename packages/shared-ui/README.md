# 🎨 @webduh/shared-ui

**System-wide shared UI components for the WebduhVercel platform**

## 🎯 Overview

This package provides consistent navigation and UI components across all WebduhVercel applications including the Dashboard, Bolt.DIY integration, and API services.

## 📦 Installation

```bash
npm install @webduh/shared-ui
```

## 🔧 Usage

### **Navigation Component**

```tsx
import { Navigation, getDashboardNavigationConfig } from '@webduh/shared-ui';
import { usePathname, useRouter } from 'next/navigation';

export function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  };

  const config = getDashboardNavigationConfig();

  return (
    <Navigation
      config={config}
      currentPath={pathname}
      onNavigate={handleNavigate}
      theme="auto"
    />
  );
}
```

### **Navigation Configuration**

```tsx
import { NavigationConfig } from '@webduh/shared-ui';

const customConfig: NavigationConfig = {
  brand: {
    name: 'My App',
    href: '/',
    logo: '/logo.png',
  },
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      badge: 'New',
    },
    {
      id: 'tools',
      label: 'Tools',
      href: '/tools',
      children: [
        {
          id: 'tool1',
          label: 'Tool 1',
          href: '/tools/tool1',
        },
      ],
    },
  ],
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  },
};
```

## 🎨 Features

### **Responsive Navigation**

- Mobile-first design with collapsible menu
- Touch-friendly interactions
- Smooth animations and transitions

### **Theme Support**

- Light, dark, and auto themes
- Consistent with system preferences
- Smooth theme transitions

### **Active State Management**

- Automatic highlighting of current page
- Breadcrumb-style navigation for nested routes
- Visual feedback for user interactions

### **External Link Handling**

- Automatic detection of external URLs
- Opens in new tab with proper security
- Visual indicators for external links

### **Dropdown Menus**

- Nested navigation support
- Keyboard accessibility
- Click-outside to close

## 🔧 API Reference

### **Navigation Props**

| Prop          | Type                          | Required | Description                        |
| ------------- | ----------------------------- | -------- | ---------------------------------- |
| `config`      | `NavigationConfig`            | ✅       | Navigation configuration object    |
| `currentPath` | `string`                      | ✅       | Current page path for active state |
| `onNavigate`  | `(href: string) => void`      | ❌       | Custom navigation handler          |
| `className`   | `string`                      | ❌       | Additional CSS classes             |
| `theme`       | `'light' \| 'dark' \| 'auto'` | ❌       | Theme preference                   |

### **NavigationConfig Interface**

```tsx
interface NavigationConfig {
  brand: {
    name: string;
    logo?: string;
    href: string;
  };
  items: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  settings?: NavigationItem[];
}
```

### **NavigationItem Interface**

```tsx
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  external?: boolean;
  requiresAuth?: boolean;
  children?: NavigationItem[];
}
```

## 🎯 Pre-configured Navigation

### **Dashboard Navigation**

```tsx
import { getDashboardNavigationConfig } from '@webduh/shared-ui';
const config = getDashboardNavigationConfig();
```

### **Bolt.DIY Navigation**

```tsx
import { getBoltDIYNavigationConfig } from '@webduh/shared-ui';
const config = getBoltDIYNavigationConfig();
```

### **API Navigation**

```tsx
import { getAPINavigationConfig } from '@webduh/shared-ui';
const config = getAPINavigationConfig();
```

## 🔧 Development

### **Building**

```bash
npm run build
```

### **Development Mode**

```bash
npm run dev
```

### **Type Checking**

```bash
npm run typecheck
```

## 🎨 Styling

The navigation component uses Tailwind CSS classes and is designed to work with your existing Tailwind configuration. Key classes used:

- `bg-white dark:bg-gray-900` - Background colors
- `text-gray-700 dark:text-gray-300` - Text colors
- `hover:bg-gray-100 dark:hover:bg-gray-800` - Hover states
- `border-gray-200 dark:border-gray-700` - Borders

## 🔄 Version History

### **v1.0.0** - Initial Release

- ✅ Navigation component with full feature set
- ✅ TypeScript support
- ✅ Pre-configured navigation for WebduhVercel apps
- ✅ Theme support and responsive design

## 📄 License

MIT License - see the main WebduhVercel repository for details.
