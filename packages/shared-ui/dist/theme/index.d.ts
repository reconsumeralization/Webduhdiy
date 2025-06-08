export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}
export interface ThemeConfig {
  colors: ThemeColors;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  fontFamily: Record<string, string[]>;
  fontSize: Record<
    string,
    [
      string,
      {
        lineHeight: string;
        letterSpacing?: string;
      },
    ]
  >;
  fontWeight: Record<string, string>;
  boxShadow: Record<string, string>;
  animation: Record<string, string>;
  transitionDuration: Record<string, string>;
}
export declare const brandColors: ThemeColors;
export declare const themeConfig: ThemeConfig;
export type ThemeMode = 'light' | 'dark' | 'system';
export declare const getCSSVariables: (mode: 'light' | 'dark') => {
  '--color-background': string;
  '--color-foreground': string;
  '--color-muted': string;
  '--color-muted-foreground': string;
  '--color-border': string;
  '--color-input': string;
  '--color-card': string;
  '--color-card-foreground': string;
  '--color-popover': string;
  '--color-popover-foreground': string;
  '--color-primary': string;
  '--color-primary-foreground': string;
  '--color-secondary': string;
  '--color-secondary-foreground': string;
  '--color-accent': string;
  '--color-accent-foreground': string;
  '--color-destructive': string;
  '--color-destructive-foreground': string;
  '--color-ring': string;
  '--color-primary-50': string;
  '--color-primary-100': string;
  '--color-primary-200': string;
  '--color-primary-300': string;
  '--color-primary-400': string;
  '--color-primary-500': string;
  '--color-primary-600': string;
  '--color-primary-700': string;
  '--color-primary-800': string;
  '--color-primary-900': string;
  '--color-primary-950': string;
};
export default themeConfig;
