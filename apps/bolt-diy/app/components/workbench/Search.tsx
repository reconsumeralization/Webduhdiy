import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { TextSearchOptions, TextSearchOnProgressCallback, WebContainer } from '@webcontainer/api';
import { workbenchStore } from '~/lib/stores/workbench';
import { webcontainer } from '~/lib/webcontainer';
import { WORK_DIR } from '~/utils/constants';
import { debounce } from '~/utils/debounce';
import { FileIcon } from '~/components/ui/FileIcon';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button } from '~/components/ui/Button';

interface DisplayMatch {
  path: string;
  lineNumber: number;
  previewText: string;
  matchCharStart: number;
  matchCharEnd: number;
}

async function performTextSearch(
  instance: WebContainer,
  query: string,
  options: Omit<TextSearchOptions, 'folders'>,
  onProgress: (results: DisplayMatch[]) => void,
): Promise<void> {
  if (!instance || typeof instance.internal?.textSearch !== 'function') {
    console.error('WebContainer instance not available or internal searchText method is missing/not a function.');

    return;
  }

  const searchOptions: TextSearchOptions = {
    ...options,
    folders: [WORK_DIR],
  };

  const progressCallback: TextSearchOnProgressCallback = (filePath: any, apiMatches: any[]) => {
    const displayMatches: DisplayMatch[] = [];

    apiMatches.forEach((apiMatch: { preview: { text: string; matches: string | any[] }; ranges: any[] }) => {
      const previewLines = apiMatch.preview.text.split('\n');

      apiMatch.ranges.forEach((range: { startLineNumber: number; startColumn: any; endColumn: any }) => {
        let previewLineText = '(Preview line not found)';
        let lineIndexInPreview = -1;

        if (apiMatch.preview.matches.length > 0) {
          const previewStartLine = apiMatch.preview.matches[0].startLineNumber;
          lineIndexInPreview = range.startLineNumber - previewStartLine;
        }

        if (lineIndexInPreview >= 0 && lineIndexInPreview < previewLines.length) {
          previewLineText = previewLines[lineIndexInPreview];
        } else {
          previewLineText = previewLines[0] ?? '(Preview unavailable)';
        }

        displayMatches.push({
          path: filePath,
          lineNumber: range.startLineNumber,
          previewText: previewLineText,
          matchCharStart: range.startColumn,
          matchCharEnd: range.endColumn,
        });
      });
    });

    if (displayMatches.length > 0) {
      onProgress(displayMatches);
    }
  };

  try {
    await instance.internal.textSearch(query, searchOptions, progressCallback);
  } catch (error) {
    console.error('Error during internal text search:', error);
  }
}

function groupResultsByFile(results: DisplayMatch[]): Record<string, DisplayMatch[]> {
  return results.reduce(
    (acc, result) => {
      if (!acc[result.path]) {
        acc[result.path] = [];
      }

      acc[result.path].push(result);

      return acc;
    },
    {} as Record<string, DisplayMatch[]>,
  );
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DisplayMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    isRegex: false,
    caseSensitive: false,
    isWordMatch: false,
  });

  const groupedResults = useMemo(() => groupResultsByFile(searchResults), [searchResults]);

  useEffect(() => {
    if (searchResults.length > 0) {
      const allExpanded: Record<string, boolean> = {};
      Object.keys(groupedResults).forEach((file) => {
        allExpanded[file] = true;
      });
      setExpandedFiles(allExpanded);
    }
  }, [groupedResults, searchResults]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setExpandedFiles({});
      setHasSearched(false);

      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setExpandedFiles({});
    setHasSearched(true);

    const minLoaderTime = 300; // ms
    const start = Date.now();

    try {
      const instance = await webcontainer;
      const options: Omit<TextSearchOptions, 'folders'> = {
        homeDir: WORK_DIR, // Adjust this path as needed
        includes: ['**/*.*'],
        excludes: ['**/node_modules/**', '**/package-lock.json', '**/.git/**', '**/dist/**', '**/*.lock'],
        gitignore: true,
        requireGit: false,
        globalIgnoreFiles: true,
        ignoreSymlinks: false,
        resultLimit: 500,
        ...searchOptions,
      };

      const progressHandler = (batchResults: DisplayMatch[]) => {
        setSearchResults((prevResults) => [...prevResults, ...batchResults]);
      };

      await performTextSearch(instance, query, options, progressHandler);
    } catch (error) {
      console.error('Failed to initiate search:', error);
    } finally {
      const elapsed = Date.now() - start;

      if (elapsed < minLoaderTime) {
        setTimeout(() => setIsSearching(false), minLoaderTime - elapsed);
      } else {
        setIsSearching(false);
      }
    }
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleResultClick = (filePath: string, line?: number) => {
    workbenchStore.setSelectedFile(filePath);

    /*
     * Adjust line number to be 0-based if it's defined
     * The search results use 1-based line numbers, but CodeMirrorEditor expects 0-based
     */
    const adjustedLine = typeof line === 'number' ? Math.max(0, line - 1) : undefined;

    workbenchStore.setCurrentDocumentScrollPosition({ line: adjustedLine, column: 0 });
  };

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-2">
      {/* Search Bar */}
      <div className="flex items-center py-3 px-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full px-2 py-1 rounded-md bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => setSearchOptions((prev) => ({ ...prev, caseSensitive: !prev.caseSensitive }))}
            className={`p-1 rounded-md ${
              searchOptions.caseSensitive ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-bolt-elements-background-depth-3'
            }`}
            title="Match Case"
          >
            <div className="i-ph:text-aa-bold w-4 h-4" />
          </button>
          <button
            onClick={() => setSearchOptions((prev) => ({ ...prev, isWordMatch: !prev.isWordMatch }))}
            className={`p-1 rounded-md ${
              searchOptions.isWordMatch ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-bolt-elements-background-depth-3'
            }`}
            title="Match Whole Word"
          >
            <div className="i-ph:text-t-bold w-4 h-4" />
          </button>
          <button
            onClick={() => setSearchOptions((prev) => ({ ...prev, isRegex: !prev.isRegex }))}
            className={`p-1 rounded-md ${
              searchOptions.isRegex ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-bolt-elements-background-depth-3'
            }`}
            title="Use Regular Expression"
          >
            <div className="i-ph:regex-bold w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto py-2">
        {isSearching && (
          <div className="flex items-center justify-center h-32 text-bolt-elements-textTertiary">
            <div className="i-ph:circle-notch animate-spin mr-2" /> Searching...
          </div>
        )}
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <div className="text-center py-10 text-bolt-elements-textTertiary">No results found.</div>
        )}
        <div className="h-full">
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => {
              const items: (string | DisplayMatch)[] = [];
              Object.entries(groupedResults).forEach(([file, matches]) => {
                items.push(file);

                if (expandedFiles[file]) {
                  items.push(...matches);
                }
              });

              return (
                <List height={height} itemCount={items.length} itemSize={28} width={width} itemData={items}>
                  {({ index, style, data }) => {
                    const item = data[index];

                    if (typeof item === 'string') {
                      const file = item;
                      const matches = groupedResults[file];

                      return (
                        <div
                          style={style}
                          className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-bolt-elements-background-depth-3 rounded-md"
                          onClick={() => setExpandedFiles((prev) => ({ ...prev, [file]: !prev[file] }))}
                        >
                          <div className="flex items-center">
                            <FileIcon filename={file} className="mr-2" />
                            <span className="font-medium text-bolt-elements-textPrimary">
                              {file.replace(`${WORK_DIR}/`, '')}
                            </span>
                          </div>
                          <span className="text-xs bg-bolt-elements-background-depth-4 text-bolt-elements-textSecondary px-2 py-0.5 rounded-full">
                            {matches.length}
                          </span>
                        </div>
                      );
                    } else {
                      const match = item;
                      return (
                        <div
                          style={style}
                          className="flex items-start py-1 px-2 cursor-pointer hover:bg-bolt-elements-background-depth-3 rounded-md pl-6"
                          onClick={() => handleResultClick(match.path, match.lineNumber)}
                        >
                          <div className="w-12 text-right pr-4 text-bolt-elements-textTertiary">{match.lineNumber}</div>
                          <div
                            className="text-bolt-elements-textPrimary"
                            dangerouslySetInnerHTML={{
                              __html: match.previewText.replace(
                                searchQuery,
                                `<span class="bg-yellow-400/20 text-yellow-300">${searchQuery}</span>`,
                              ),
                            }}
                          />
                        </div>
                      );
                    }
                  }}
                </List>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
}
