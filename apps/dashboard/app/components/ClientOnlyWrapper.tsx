'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnlyWrapper({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Helper for dynamic time content
export function ClientOnlyTime({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnlyWrapper
      fallback={<span className="text-gray-500">--:--:--</span>}
    >
      {children}
    </ClientOnlyWrapper>
  );
}

// Helper for interactive features
export function ClientOnlyInteractive({
  children,
  staticFallback,
}: {
  children: React.ReactNode;
  staticFallback?: React.ReactNode;
}) {
  return (
    <ClientOnlyWrapper
      fallback={
        staticFallback || (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8"></div>
        )
      }
    >
      {children}
    </ClientOnlyWrapper>
  );
}
