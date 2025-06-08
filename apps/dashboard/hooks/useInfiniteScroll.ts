'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function useInfiniteScroll(
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {},
) {
  const { threshold = 100, hasMore = true, isLoading = false } = options;
  const [isFetching, setIsFetching] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
        setIsFetching(true);
        Promise.resolve(fetchMore()).finally(() => {
          setIsFetching(false);
        });
      }
    },
    [fetchMore, hasMore, isLoading, isFetching],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: `${threshold}px`,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver, threshold]);

  return { observerTarget, isFetching };
}
