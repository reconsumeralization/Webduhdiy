// Navigation exports for webduh 10X Platform

export { default as MainNavigation } from './MainNavigation';
export { default as MobileNavigation } from './MobileNavigation';
export { default as Breadcrumbs } from './Breadcrumbs';
export { EnhancedBreadcrumbs } from './Breadcrumbs';
export {
  default as PageLayout,
  DashboardLayout,
  FullWidthLayout,
  DocsLayout,
} from './PageLayout';

// Navigation types

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  iconSolid?: React.ComponentType<any>;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
