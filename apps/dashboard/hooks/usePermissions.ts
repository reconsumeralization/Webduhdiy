'use client';

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import React from 'react';

export type Permission =
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  | 'deployments:read'
  | 'deployments:write'
  | 'deployments:delete'
  | 'analytics:read'
  | 'domains:read'
  | 'domains:write'
  | 'domains:delete'
  | 'teams:read'
  | 'teams:write'
  | 'teams:delete'
  | 'billing:read'
  | 'billing:write'
  | 'settings:read'
  | 'settings:write';

export type Role = 'owner' | 'admin' | 'developer' | 'viewer';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'projects:read',
    'projects:write',
    'projects:delete',
    'deployments:read',
    'deployments:write',
    'deployments:delete',
    'analytics:read',
    'domains:read',
    'domains:write',
    'domains:delete',
    'teams:read',
    'teams:write',
    'teams:delete',
    'billing:read',
    'billing:write',
    'settings:read',
    'settings:write',
  ],
  admin: [
    'projects:read',
    'projects:write',
    'projects:delete',
    'deployments:read',
    'deployments:write',
    'deployments:delete',
    'analytics:read',
    'domains:read',
    'domains:write',
    'domains:delete',
    'teams:read',
    'teams:write',
    'settings:read',
    'settings:write',
  ],
  developer: [
    'projects:read',
    'projects:write',
    'deployments:read',
    'deployments:write',
    'analytics:read',
    'domains:read',
  ],
  viewer: [
    'projects:read',
    'deployments:read',
    'analytics:read',
    'domains:read',
  ],
};

export function usePermissions() {
  const { user, currentTeam } = useAuth();

  const userRole = useMemo(() => {
    if (!user || !currentTeam) return 'viewer';

    // Find user's role in current team
    const teamMember = currentTeam.members?.find(
      (member) => member.userId === user.id,
    );
    return teamMember?.role || 'viewer';
  }, [user, currentTeam]);

  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.viewer;
  }, [userRole]);

  const hasPermission = useMemo(
    () => (permission: Permission) => permissions.includes(permission),
    [permissions],
  );

  const hasAnyPermission = useMemo(
    () => (requiredPermissions: Permission[]) =>
      requiredPermissions.some((permission) =>
        permissions.includes(permission),
      ),
    [permissions],
  );

  const hasAllPermissions = useMemo(
    () => (requiredPermissions: Permission[]) =>
      requiredPermissions.every((permission) =>
        permissions.includes(permission),
      ),
    [permissions],
  );

  const canRead = useMemo(
    () => (resource: string) => hasPermission(`${resource}:read` as Permission),
    [hasPermission],
  );

  const canWrite = useMemo(
    () => (resource: string) =>
      hasPermission(`${resource}:write` as Permission),
    [hasPermission],
  );

  const canDelete = useMemo(
    () => (resource: string) =>
      hasPermission(`${resource}:delete` as Permission),
    [hasPermission],
  );

  // Resource-specific permission helpers
  const can = useMemo(
    () => ({
      // Projects
      viewProjects: hasPermission('projects:read'),
      createProjects: hasPermission('projects:write'),
      editProjects: hasPermission('projects:write'),
      deleteProjects: hasPermission('projects:delete'),

      // Deployments
      viewDeployments: hasPermission('deployments:read'),
      createDeployments: hasPermission('deployments:write'),
      cancelDeployments: hasPermission('deployments:write'),
      deleteDeployments: hasPermission('deployments:delete'),

      // Analytics
      viewAnalytics: hasPermission('analytics:read'),

      // Domains
      viewDomains: hasPermission('domains:read'),
      addDomains: hasPermission('domains:write'),
      editDomains: hasPermission('domains:write'),
      deleteDomains: hasPermission('domains:delete'),

      // Teams
      viewTeams: hasPermission('teams:read'),
      inviteMembers: hasPermission('teams:write'),
      editMembers: hasPermission('teams:write'),
      removeMembers: hasPermission('teams:delete'),

      // Billing
      viewBilling: hasPermission('billing:read'),
      editBilling: hasPermission('billing:write'),

      // Settings
      viewSettings: hasPermission('settings:read'),
      editSettings: hasPermission('settings:write'),
    }),
    [hasPermission],
  );

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canRead,
    canWrite,
    canDelete,
    can,
  };
}

// HOC for protecting components based on permissions
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  fallback?: React.ComponentType,
) {
  return function PermissionWrapper(props: P) {
    const { hasPermission, hasAnyPermission } = usePermissions();

    const hasAccess = Array.isArray(requiredPermission)
      ? hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission);

    if (!hasAccess) {
      if (fallback) {
        const FallbackComponent = fallback;
        return React.createElement(FallbackComponent);
      }
      return null;
    }

    return React.createElement(Component, props);
  };
}

// Hook for conditional rendering based on permissions
export function usePermissionGuard() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, can } =
    usePermissions();

  const guard = useMemo(
    () => ({
      can: (permission: Permission) => hasPermission(permission),
      canAny: (permissions: Permission[]) => hasAnyPermission(permissions),
      canAll: (permissions: Permission[]) => hasAllPermissions(permissions),
      ...can,
    }),
    [hasPermission, hasAnyPermission, hasAllPermissions, can],
  );

  return guard;
}
