'use client';

// TODO: confirm version & license.
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';

/* ---- embedded utilities ---- */
// User and Team types (minimal, self-contained for demo; expand as needed)
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  [key: string]: any;
}

export interface Team {
  id: string;
  name: string;
  slug?: string;
  members?: User[];
  [key: string]: any;
}
/* ---- end embedded utilities ---- */

interface AuthState {
  user: User | null;
  currentTeam: Team | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  enableTwoFactor: () => Promise<{ qrCode: string; secret: string }>;
  disableTwoFactor: (code: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  teamName?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    currentTeam: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        updateState({ isLoading: true, error: null });

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const { user, team, token } = await response.json();

        // Store token in httpOnly cookie is handled by server
        localStorage.setItem('webduh:user', JSON.stringify(user));
        localStorage.setItem('webduh:team', JSON.stringify(team));

        updateState({
          user,
          currentTeam: team,
          isAuthenticated: true,
          isLoading: false,
        });

        // Show success toast
        (window as any).showToast?.({
          type: 'success',
          title: 'Welcome back!',
          message: `Logged in as ${user.name}`,
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Login failed',
          isLoading: false,
        });
        throw error;
      }
    },
    [updateState],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      try {
        updateState({ isLoading: true, error: null });

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const { user, team } = await response.json();

        localStorage.setItem('webduh:user', JSON.stringify(user));
        localStorage.setItem('webduh:team', JSON.stringify(team));

        updateState({
          user,
          currentTeam: team,
          isAuthenticated: true,
          isLoading: false,
        });
        (window as any).showToast?.({
          type: 'success',
          title: 'Account created!',
          message: 'Welcome to webduh',
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Registration failed',
          isLoading: false,
        });
        throw error;
      }
    },
    [updateState],
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('webduh:user');
      localStorage.removeItem('webduh:team');

      updateState({
        user: null,
        currentTeam: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      (window as any).showToast?.({
        type: 'info',
        title: 'Logged out',
        message: 'See you next time!',
      });
    }
  }, [updateState]);

  const switchTeam = useCallback(
    async (teamId: string) => {
      try {
        const response = await fetch('/api/auth/switch-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId }),
        });

        if (!response.ok) {
          throw new Error('Failed to switch team');
        }

        const { team } = await response.json();
        localStorage.setItem('webduh:team', JSON.stringify(team));

        updateState({ currentTeam: team });
        (window as any).showToast?.({
          type: 'success',
          title: 'Team switched',
          message: `Now working in ${team.name}`,
        });
      } catch (error) {
        (window as any).showToast?.({
          type: 'error',
          title: 'Switch failed',
          message: 'Failed to switch team',
        });
        throw error;
      }
    },
    [updateState],
  );

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        localStorage.setItem('webduh:user', JSON.stringify(updatedUser));

        updateState({ user: updatedUser });
        (window as any).showToast?.({
          type: 'success',
          title: 'Profile updated',
          message: 'Your changes have been saved',
        });
      } catch (error) {
        (window as any).showToast?.({
          type: 'error',
          title: 'Update failed',
          message: 'Failed to update profile',
        });
        throw error;
      }
    },
    [updateState],
  );

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me');

      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated
          updateState({
            user: null,
            currentTeam: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const { user, team } = await response.json();

      localStorage.setItem('webduh:user', JSON.stringify(user));
      if (team) localStorage.setItem('webduh:team', JSON.stringify(team));

      updateState({
        user,
        currentTeam: team,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      updateState({ isLoading: false });
    }
  }, [updateState]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      (window as any).showToast?.({
        type: 'success',
        title: 'Reset email sent',
        message: 'Check your inbox for reset instructions',
      });
    } catch (error) {
      (window as any).showToast?.({
        type: 'error',
        title: 'Reset failed',
        message: 'Failed to send reset email',
      });
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify email');
        }

        await refreshUser();
        (window as any).showToast?.({
          type: 'success',
          title: 'Email verified',
          message: 'Your email has been verified successfully',
        });
      } catch (error) {
        (window as any).showToast?.({
          type: 'error',
          title: 'Verification failed',
          message: 'Failed to verify email',
        });
        throw error;
      }
    },
    [refreshUser],
  );

  const enableTwoFactor = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to enable 2FA');
      }

      const { qrCode, secret } = await response.json();
      return { qrCode, secret };
    } catch (error) {
      (window as any).showToast?.({
        type: 'error',
        title: '2FA setup failed',
        message: 'Failed to enable two-factor authentication',
      });
      throw error;
    }
  }, []);

  const disableTwoFactor = useCallback(
    async (code: string) => {
      try {
        const response = await fetch('/api/auth/2fa/disable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to disable 2FA');
        }

        await refreshUser();
        (window as any).showToast?.({
          type: 'success',
          title: '2FA disabled',
          message: 'Two-factor authentication has been disabled',
        });
      } catch (error) {
        (window as any).showToast?.({
          type: 'error',
          title: '2FA disable failed',
          message: 'Failed to disable two-factor authentication',
        });
        throw error;
      }
    },
    [refreshUser],
  );

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for stored user data first (for immediate UI update)
      const storedUser = localStorage.getItem('webduh:user');
      const storedTeam = localStorage.getItem('webduh:team');

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const team = storedTeam ? JSON.parse(storedTeam) : null;

          updateState({
            user,
            currentTeam: team,
            isAuthenticated: true,
            isLoading: true, // Still loading while we verify with server
          });
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          localStorage.removeItem('webduh:user');
          localStorage.removeItem('webduh:team');
        }
      }

      // Always check with server for fresh data
      await refreshUser();
    };

    initAuth();
  }, [refreshUser, updateState]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    switchTeam,
    updateProfile,
    refreshUser,
    resetPassword,
    verifyEmail,
    enableTwoFactor,
    disableTwoFactor,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
