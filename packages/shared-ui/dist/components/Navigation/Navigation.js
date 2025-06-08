'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Navigation = void 0;
const jsx_runtime_1 = require('react/jsx-runtime');
const react_1 = require('react');
// Default icons (you can replace with actual icon library)
const DefaultIcons = {
  Menu: ({ className = '' }) =>
    (0, jsx_runtime_1.jsx)('svg', {
      className: className,
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      children: (0, jsx_runtime_1.jsx)('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M4 6h16M4 12h16M4 18h16',
      }),
    }),
  X: ({ className = '' }) =>
    (0, jsx_runtime_1.jsx)('svg', {
      className: className,
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      children: (0, jsx_runtime_1.jsx)('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M6 18L18 6M6 6l12 12',
      }),
    }),
  ChevronDown: ({ className = '' }) =>
    (0, jsx_runtime_1.jsx)('svg', {
      className: className,
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      children: (0, jsx_runtime_1.jsx)('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M19 9l-7 7-7-7',
      }),
    }),
  ExternalLink: ({ className = '' }) =>
    (0, jsx_runtime_1.jsx)('svg', {
      className: className,
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      children: (0, jsx_runtime_1.jsx)('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
      }),
    }),
};
const Navigation = ({
  config,
  currentPath,
  onNavigate,
  className = '',
  theme = 'auto',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
  const [openDropdowns, setOpenDropdowns] = (0, react_1.useState)(new Set());
  const handleNavigation = (href, external) => {
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
  const toggleDropdown = (itemId) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(itemId)) {
      newOpenDropdowns.delete(itemId);
    } else {
      newOpenDropdowns.add(itemId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };
  const isActive = (href) => {
    if (href === '/') {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };
  const renderNavigationItem = (item, isMobile = false) => {
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
    return (0, jsx_runtime_1.jsxs)(
      'div',
      {
        className: isMobile ? 'w-full' : 'relative',
        children: [
          (0, jsx_runtime_1.jsxs)('button', {
            onClick: () => {
              if (hasChildren) {
                toggleDropdown(item.id);
              } else {
                handleNavigation(item.href, item.external);
              }
            },
            className: baseClasses,
            title: item.label,
            children: [
              (0, jsx_runtime_1.jsxs)('div', {
                className: 'flex items-center space-x-2',
                children: [
                  item.icon &&
                    (0, jsx_runtime_1.jsx)(item.icon, { className: 'h-4 w-4' }),
                  (0, jsx_runtime_1.jsx)('span', { children: item.label }),
                  item.badge &&
                    (0, jsx_runtime_1.jsx)('span', {
                      className:
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                      children: item.badge,
                    }),
                  item.external &&
                    (0, jsx_runtime_1.jsx)(DefaultIcons.ExternalLink, {
                      className: 'h-3 w-3 opacity-50',
                    }),
                ],
              }),
              hasChildren &&
                (0, jsx_runtime_1.jsx)(DefaultIcons.ChevronDown, {
                  className: `h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`,
                }),
            ],
          }),
          hasChildren &&
            isDropdownOpen &&
            (0, jsx_runtime_1.jsx)('div', {
              className: `
            ${
              isMobile
                ? 'pl-6 space-y-1'
                : 'absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50'
            }
          `,
              children: item.children.map((child) =>
                (0, jsx_runtime_1.jsx)(
                  'button',
                  {
                    onClick: () => handleNavigation(child.href, child.external),
                    className: `
                  flex items-center w-full px-3 py-2 text-sm text-left transition-colors duration-200
                  ${
                    isActive(child.href)
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }
                  ${!isMobile ? 'rounded-md mx-1' : ''}
                `,
                    children: (0, jsx_runtime_1.jsxs)('div', {
                      className: 'flex items-center space-x-2',
                      children: [
                        child.icon &&
                          (0, jsx_runtime_1.jsx)(child.icon, {
                            className: 'h-4 w-4',
                          }),
                        (0, jsx_runtime_1.jsx)('span', {
                          children: child.label,
                        }),
                        child.badge &&
                          (0, jsx_runtime_1.jsx)('span', {
                            className:
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                            children: child.badge,
                          }),
                        child.external &&
                          (0, jsx_runtime_1.jsx)(DefaultIcons.ExternalLink, {
                            className: 'h-3 w-3 opacity-50',
                          }),
                      ],
                    }),
                  },
                  child.id,
                ),
              ),
            }),
        ],
      },
      item.id,
    );
  };
  return (0, jsx_runtime_1.jsxs)('nav', {
    className: `bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`,
    children: [
      (0, jsx_runtime_1.jsx)('div', {
        className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        children: (0, jsx_runtime_1.jsxs)('div', {
          className: 'flex justify-between h-16',
          children: [
            (0, jsx_runtime_1.jsx)('div', {
              className: 'flex items-center',
              children: (0, jsx_runtime_1.jsxs)('button', {
                onClick: () => handleNavigation(config.brand.href),
                className:
                  'flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
                children: [
                  config.brand.logo &&
                    (0, jsx_runtime_1.jsx)('img', {
                      src: config.brand.logo,
                      alt: config.brand.name,
                      className: 'h-8 w-8',
                    }),
                  (0, jsx_runtime_1.jsx)('span', {
                    children: config.brand.name,
                  }),
                ],
              }),
            }),
            (0, jsx_runtime_1.jsx)('div', {
              className: 'hidden md:flex items-center space-x-4',
              children: config.items.map((item) =>
                renderNavigationItem(item, false),
              ),
            }),
            (0, jsx_runtime_1.jsxs)('div', {
              className: 'flex items-center space-x-4',
              children: [
                config.user &&
                  (0, jsx_runtime_1.jsxs)('div', {
                    className: 'hidden md:flex items-center space-x-3',
                    children: [
                      (0, jsx_runtime_1.jsxs)('div', {
                        className: 'text-right',
                        children: [
                          (0, jsx_runtime_1.jsx)('div', {
                            className:
                              'text-sm font-medium text-gray-900 dark:text-white',
                            children: config.user.name,
                          }),
                          (0, jsx_runtime_1.jsx)('div', {
                            className:
                              'text-xs text-gray-500 dark:text-gray-400',
                            children: config.user.email,
                          }),
                        ],
                      }),
                      config.user.avatar &&
                        (0, jsx_runtime_1.jsx)('img', {
                          src: config.user.avatar,
                          alt: config.user.name,
                          className: 'h-8 w-8 rounded-full',
                        }),
                    ],
                  }),
                (0, jsx_runtime_1.jsx)('button', {
                  onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
                  className:
                    'md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
                  children: isMobileMenuOpen
                    ? (0, jsx_runtime_1.jsx)(DefaultIcons.X, {
                        className: 'h-6 w-6',
                      })
                    : (0, jsx_runtime_1.jsx)(DefaultIcons.Menu, {
                        className: 'h-6 w-6',
                      }),
                }),
              ],
            }),
          ],
        }),
      }),
      isMobileMenuOpen &&
        (0, jsx_runtime_1.jsx)('div', {
          className: 'md:hidden border-t border-gray-200 dark:border-gray-700',
          children: (0, jsx_runtime_1.jsxs)('div', {
            className: 'px-2 pt-2 pb-3 space-y-1',
            children: [
              config.items.map((item) => renderNavigationItem(item, true)),
              config.user &&
                (0, jsx_runtime_1.jsx)('div', {
                  className:
                    'pt-4 border-t border-gray-200 dark:border-gray-700 mt-4',
                  children: (0, jsx_runtime_1.jsxs)('div', {
                    className: 'flex items-center space-x-3 px-3 py-2',
                    children: [
                      config.user.avatar &&
                        (0, jsx_runtime_1.jsx)('img', {
                          src: config.user.avatar,
                          alt: config.user.name,
                          className: 'h-8 w-8 rounded-full',
                        }),
                      (0, jsx_runtime_1.jsxs)('div', {
                        children: [
                          (0, jsx_runtime_1.jsx)('div', {
                            className:
                              'text-sm font-medium text-gray-900 dark:text-white',
                            children: config.user.name,
                          }),
                          (0, jsx_runtime_1.jsx)('div', {
                            className:
                              'text-xs text-gray-500 dark:text-gray-400',
                            children: config.user.email,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
            ],
          }),
        }),
    ],
  });
};
exports.Navigation = Navigation;
