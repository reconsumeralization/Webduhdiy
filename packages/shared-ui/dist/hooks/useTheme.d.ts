import React from 'react';
import { ThemeMode } from '../theme';
interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    isDark: boolean;
    isLight: boolean;
    resolvedTheme: 'light' | 'dark';
}
interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ThemeMode;
    storageKey?: string;
}
export declare function ThemeProvider({ children, defaultTheme, storageKey, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextType;
export declare function ThemeToggle({ className }: {
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
