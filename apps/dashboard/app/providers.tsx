'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// TODO: confirm version & license.
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// TODO: confirm version & license.
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

/* --- embedded utilities --- */
// Minimal AuthProvider and useAuth implementation for self-containment.
// Replace with your actual authentication logic as needed.

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Example: load user from localStorage/session on mount
  useEffect(() => {
    // Replace with real auth logic
    const stored =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('user')
        : null;
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (user: User) => {
    setUser(user);
    if (typeof window !== 'undefined' && user)
      window.localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') window.localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
/* --- end embedded utilities --- */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
