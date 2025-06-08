export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{
    className?: string;
  }>;
  badge?: string | number;
  external?: boolean;
  requiresAuth?: boolean;
  children?: NavigationItem[];
}
export interface NavigationConfig {
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
export interface NavigationProps {
  config: NavigationConfig;
  currentPath: string;
  onNavigate?: (href: string) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}
