'use client';

// TODO: confirm version & license.
import { useState, useCallback } from 'react';

/* ---- embedded utilities ---- */
// No additional small utilities required.
/* ---- end embedded utilities ---- */

export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);

        // Optionally show a toast if available in the global window
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast({
            type: 'success',
            title: 'Copied!',
            message: 'Text copied to clipboard',
          });
        }

        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setIsCopied(false);
        return false;
      }
    },
    [timeout],
  );

  const paste = useCallback(async (): Promise<string> => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard not supported');
      return '';
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to paste text:', error);
      return '';
    }
  }, []);

  return { copy, paste, isCopied };
}
