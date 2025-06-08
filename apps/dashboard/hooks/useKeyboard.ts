'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

export function useKeyboard(
  shortcuts: Record<
    string,
    { shortcut: KeyboardShortcut; handler: () => void }
  >,
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const [id, { shortcut, handler }] of Object.entries(shortcuts)) {
        const {
          key,
          ctrl = false,
          shift = false,
          alt = false,
          meta = false,
          preventDefault = true,
        } = shortcut;

        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatches = event.ctrlKey === ctrl;
        const shiftMatches = event.shiftKey === shift;
        const altMatches = event.altKey === alt;
        const metaMatches = event.metaKey === meta;

        if (
          keyMatches &&
          ctrlMatches &&
          shiftMatches &&
          altMatches &&
          metaMatches
        ) {
          if (preventDefault) {
            event.preventDefault();
          }
          handler();
          break;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useCommandPalette() {
  return useKeyboard({
    openCommandPalette: {
      shortcut: { key: 'k', ctrl: true, preventDefault: true },
      handler: () => {
        (window as any).openCommandPalette?.();
      },
    },
  });
}
