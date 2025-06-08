'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
exports.ThemeToggle = ThemeToggle;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const theme_1 = require("../theme");
const ThemeContext = (0, react_1.createContext)(undefined);
function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'webduh-theme', }) {
    const [theme, setThemeState] = (0, react_1.useState)(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = (0, react_1.useState)('light');
    // Get system preference
    const getSystemTheme = () => {
        if (typeof window === 'undefined')
            return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };
    // Resolve theme based on current theme setting
    const resolveTheme = (currentTheme) => {
        if (currentTheme === 'system') {
            return getSystemTheme();
        }
        return currentTheme;
    };
    // Apply theme to document
    const applyTheme = (themeMode) => {
        if (typeof window === 'undefined')
            return;
        const root = document.documentElement;
        const cssVars = (0, theme_1.getCSSVariables)(themeMode);
        // Apply CSS variables
        Object.entries(cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        // Add/remove dark class
        root.classList.remove('light', 'dark');
        root.classList.add(themeMode);
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', themeMode === 'dark' ? '#0a0a0a' : '#ffffff');
        }
    };
    // Set theme with persistence
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, newTheme);
        }
        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
    };
    // Toggle between light and dark
    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };
    // Initialize theme on mount
    (0, react_1.useEffect)(() => {
        // Get stored theme or use default
        let initialTheme = defaultTheme;
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(storageKey);
            if (stored && ['light', 'dark', 'system'].includes(stored)) {
                initialTheme = stored;
            }
        }
        const resolved = resolveTheme(initialTheme);
        setThemeState(initialTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, [defaultTheme, storageKey]);
    // Listen for system theme changes
    (0, react_1.useEffect)(() => {
        if (typeof window === 'undefined')
            return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const resolved = getSystemTheme();
                setResolvedTheme(resolved);
                applyTheme(resolved);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
        resolvedTheme,
    };
    return ((0, jsx_runtime_1.jsx)(ThemeContext.Provider, { value: value, children: children }));
}
function useTheme() {
    const context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
// Theme toggle component
function ThemeToggle({ className = '' }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-center space-x-2 ${className}`, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setTheme('light'), className: `p-2 rounded-md transition-colors ${theme === 'light'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'}`, "aria-label": "Light mode", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z", clipRule: "evenodd" }) }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTheme('dark'), className: `p-2 rounded-md transition-colors ${theme === 'dark'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'}`, "aria-label": "Dark mode", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" }) }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTheme('system'), className: `p-2 rounded-md transition-colors ${theme === 'system'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'}`, "aria-label": "System mode", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z", clipRule: "evenodd" }) }) })] }));
}
