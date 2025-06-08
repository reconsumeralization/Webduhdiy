// TODO: confirm version & license.
import './globals.css';
// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import { Inter, JetBrains_Mono } from 'next/font/google';
// TODO: confirm version & license.
import { Toaster } from 'react-hot-toast';
import { SharedNavigation } from './components/SharedNavigation';
import type { Metadata } from 'next';
import { ThemeProvider } from '@webduh/shared-ui/src/hooks/useTheme';

/* ---- embedded utilities ---- */
// Embedded Providers component stub (replace with actual implementation as needed)
type ProvidersProps = {
  children: React.ReactNode;
};
function Providers({ children }: ProvidersProps) {
  // You may add context providers here as needed
  return <>{children}</>;
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WebduhVercel - Enterprise Deployment Platform',
  description:
    'Deploy your applications instantly with our enterprise-grade platform. Scale globally, secure by default, powered by AI.',
  keywords: [
    'deployment',
    'hosting',
    'vercel-alternative',
    'serverless',
    'edge-computing',
  ],
  authors: [{ name: 'WebduhVercel Team' }],
  creator: 'WebduhVercel',
  publisher: 'WebduhVercel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dashboard.webduhvercel.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WebduhVercel Dashboard',
    description:
      'Enterprise-grade deployment platform with AI-powered development tools',
    url: 'https://dashboard.webduhvercel.com',
    siteName: 'WebduhVercel',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WebduhVercel Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebduhVercel Dashboard',
    description:
      'Enterprise-grade deployment platform with AI-powered development tools',
    images: ['/og-image.png'],
    creator: '@webduhvercel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0284c7' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#a855f7" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />

        {/* Critical CSS for theme variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --color-primary-50: #faf5ff;
              --color-primary-100: #f3e8ff;
              --color-primary-200: #e9d5ff;
              --color-primary-300: #d8b4fe;
              --color-primary-400: #c084fc;
              --color-primary-500: #a855f7;
              --color-primary-600: #9333ea;
              --color-primary-700: #7c3aed;
              --color-primary-800: #6b21a8;
              --color-primary-900: #581c87;
              --color-primary-950: #3b0764;
              
              --color-background: #ffffff;
              --color-foreground: #171717;
              --color-muted: #f5f5f5;
              --color-muted-foreground: #737373;
              --color-border: #e5e5e5;
              --color-input: #f5f5f5;
              --color-card: #ffffff;
              --color-card-foreground: #171717;
              --color-popover: #ffffff;
              --color-popover-foreground: #171717;
              --color-primary: #9333ea;
              --color-primary-foreground: #ffffff;
              --color-secondary: #f5f5f5;
              --color-secondary-foreground: #171717;
              --color-accent: #f5f5f5;
              --color-accent-foreground: #171717;
              --color-destructive: #ef4444;
              --color-destructive-foreground: #ffffff;
              --color-ring: #9333ea;
            }
            
            .dark {
              --color-background: #0a0a0a;
              --color-foreground: #fafafa;
              --color-muted: #262626;
              --color-muted-foreground: #a3a3a3;
              --color-border: #262626;
              --color-input: #262626;
              --color-card: #171717;
              --color-card-foreground: #fafafa;
              --color-popover: #171717;
              --color-popover-foreground: #fafafa;
              --color-primary: #a855f7;
              --color-primary-foreground: #171717;
              --color-secondary: #262626;
              --color-secondary-foreground: #fafafa;
              --color-accent: #262626;
              --color-accent-foreground: #fafafa;
              --color-destructive: #ef4444;
              --color-destructive-foreground: #fafafa;
              --color-ring: #a855f7;
            }
            
            * {
              border-color: var(--color-border);
            }
            
            body {
              background-color: var(--color-background);
              color: var(--color-foreground);
              font-feature-settings: "rlig" 1, "calt" 1;
            }
            
            /* Loading animation */
            .loading-shimmer {
              background: linear-gradient(110deg, var(--color-muted) 8%, var(--color-background) 18%, var(--color-muted) 33%);
              background-size: 200% 100%;
              animation: shimmer 1.5s ease-in-out infinite;
            }
            
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            
            /* Smooth transitions */
            * {
              transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }
          `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="webduh-theme">
          <Providers>
            {/* Shared Navigation */}
            <SharedNavigation />

            {/* Main Content */}
            <main className="min-h-screen">{children}</main>

            <Toaster position="top-right" />
          </Providers>
        </ThemeProvider>

        {/* Development indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-mono">
            DEV
          </div>
        )}

        {/* Analytics and tracking scripts would go here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC (Flash of Unstyled Content)
              (function() {
                const theme = localStorage.getItem('webduh-theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('dark', isDark);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
