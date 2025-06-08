'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  children,
  language = 'text',
  filename,
  showLineNumbers = false,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = children.split('\n');

  return (
    <div className={`relative group ${className}`}>
      {/* Header with filename and copy button */}
      {(filename || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
          {filename && (
            <span className="text-sm text-gray-300 font-mono">{filename}</span>
          )}
          <div className="flex items-center gap-2">
            {language && (
              <span className="text-xs text-gray-400 uppercase font-medium px-2 py-1 bg-gray-700 rounded">
                {language}
              </span>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="relative overflow-x-auto">
        <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 text-sm font-mono leading-relaxed">
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className="text-gray-500 text-right pr-4 select-none w-8">
                      {index + 1}
                    </td>
                    <td>
                      <code className={getLanguageClass(language)}>
                        {line || ' '}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code className={getLanguageClass(language)}>{children}</code>
          )}
        </pre>
      </div>
    </div>
  );
}

// Basic syntax highlighting classes (you can integrate with Prism.js or highlight.js for better highlighting)
function getLanguageClass(language: string): string {
  const baseClasses = 'block';

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return `${baseClasses} language-javascript`;
    case 'typescript':
    case 'ts':
      return `${baseClasses} language-typescript`;
    case 'jsx':
      return `${baseClasses} language-jsx`;
    case 'tsx':
      return `${baseClasses} language-tsx`;
    case 'css':
      return `${baseClasses} language-css`;
    case 'html':
      return `${baseClasses} language-html`;
    case 'json':
      return `${baseClasses} language-json`;
    case 'bash':
    case 'shell':
      return `${baseClasses} language-bash`;
    case 'python':
    case 'py':
      return `${baseClasses} language-python`;
    case 'yaml':
    case 'yml':
      return `${baseClasses} language-yaml`;
    case 'markdown':
    case 'md':
      return `${baseClasses} language-markdown`;
    default:
      return `${baseClasses} language-text`;
  }
}

// Helper component for inline code
export function InlineCode({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <code
      className={`px-1.5 py-0.5 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded ${className}`}
    >
      {children}
    </code>
  );
}
