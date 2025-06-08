'use client';

// TODO: confirm version & license.
import React, { useState, useEffect } from 'react';

/* ---- embedded utilities ---- */
// No external utilities required; all DOM and React APIs are native.

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content?: React.ReactNode;
  className?: string;
}

export default function TableOfContents({
  className = '',
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the page
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TOCItem[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent || '';
      let id = (heading as HTMLElement).id;

      // If heading doesn't have an ID, create one
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        (heading as HTMLElement).id = id;
      }

      const level = parseInt(heading.tagName.charAt(1));
      items.push({ id, text, level });
    });

    setTocItems(items);
  }, []);

  useEffect(() => {
    // Intersection Observer to track which section is currently visible
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      },
    );

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className={`sticky top-8 ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
          On this page
        </h4>
        <ul className="space-y-1">
          {tocItems.map(({ id, text, level }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                  activeId === id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{ paddingLeft: `${(level - 1) * 12 + 8}px` }}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
