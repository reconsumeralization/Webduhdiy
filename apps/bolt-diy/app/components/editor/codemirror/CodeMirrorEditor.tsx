import { acceptCompletion, autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { Compartment, EditorSelection, EditorState, StateEffect, StateField, type Extension } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  scrollPastEnd,
  showTooltip,
  tooltips,
  type Tooltip,
} from '@codemirror/view';
import { memo, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { Theme } from '~/types/theme';
import { classNames } from '~/utils/classNames';
import { debounce } from '~/utils/debounce';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { isFileLocked, getCurrentChatId } from '~/utils/fileLocks';
import { BinaryContent } from './BinaryContent';
import { getTheme, reconfigureTheme } from './cm-theme';
import { indentKeyBinding } from './indent';
import { getLanguage } from './languages';
import * as prettier from 'prettier/standalone';
import * as babelParser from 'prettier/parser-babel';

const logger = createScopedLogger('CodeMirrorEditor');

// Create a module-level reference to the current document for use in tooltip functions
let currentDocRef: EditorDocument | undefined;

export interface EditorDocument {
  value: string;
  isBinary: boolean;
  filePath: string;
  scroll?: ScrollPosition;
}

export interface EditorSettings {
  fontSize?: string;
  gutterFontSize?: string;
  tabSize?: number;
  formatOnSave?: boolean;
}

type TextEditorDocument = EditorDocument & {
  value: string;
};

export interface ScrollPosition {
  top?: number;
  left?: number;
  line?: number;
  column?: number;
}

export interface EditorUpdate {
  selection: EditorSelection;
  content: string;
}

export type OnChangeCallback = (update: EditorUpdate) => void;
export type OnScrollCallback = (position: ScrollPosition) => void;
export type OnSaveCallback = () => void;

interface Props {
  theme: Theme;
  id?: unknown;
  doc?: EditorDocument;
  editable?: boolean;
  debounceChange?: number;
  debounceScroll?: number;
  autoFocusOnDocumentChange?: boolean;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  onSave?: OnSaveCallback;
  className?: string;
  settings?: EditorSettings;
  _id?: string;
}

type EditorStates = Map<string, EditorState>;

const readOnlyTooltipStateEffect = StateEffect.define<boolean>();

const editableTooltipField = StateField.define<readonly Tooltip[]>({
  create: () => [],
  update(_tooltips, transaction) {
    if (!transaction.state.readOnly) {
      return [];
    }

    for (const effect of transaction.effects) {
      if (effect.is(readOnlyTooltipStateEffect) && effect.value) {
        return getReadOnlyTooltip(transaction.state);
      }
    }

    return [];
  },
  provide: (field) => showTooltip.computeN([field], (state) => state.field(field)),
});

const editableStateEffect = StateEffect.define<boolean>();

const editableStateField = StateField.define<boolean>({
  create() {
    return true;
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(editableStateEffect)) {
        return effect.value;
      }
    }

    return value;
  },
});

async function formatCode(code: string): Promise<string> {
  try {
    return await prettier.format(code, {
      parser: 'babel',
      plugins: [babelParser],
    });
  } catch (error) {
    logger.error('Error formatting code:', error);
    return code;
  }
}

export const CodeMirrorEditor = memo(
  ({
    _id,
    doc,
    debounceScroll = 100,
    debounceChange = 150,
    autoFocusOnDocumentChange = false,
    editable = true,
    onScroll,
    onChange,
    onSave,
    theme,
    settings,
    className = '',
  }: Props) => {
    renderLogger.trace('CodeMirrorEditor');

    const [languageCompartment] = useState(() => new Compartment());

    // Add a compartment for the env masking extension
    const [envMaskingCompartment] = useState(() => new Compartment());

    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView>();
    const themeRef = useRef<Theme>();
    const docRef = useRef<EditorDocument>();
    const editorStatesRef = useRef<EditorStates>();
    const onScrollRef = useRef(onScroll);
    const onChangeRef = useRef(onChange);
    const onSaveRef = useRef(onSave);
    const settingsRef = useRef(settings);

    /*
     * This effect is used to avoid side effects directly in the render function
     * and instead the refs are updated after each render.
     */
    useEffect(() => {
      onScrollRef.current = onScroll;
      onChangeRef.current = onChange;
      onSaveRef.current = onSave;
      docRef.current = doc;

      // Update the module-level reference for use in tooltip functions
      currentDocRef = doc;
      themeRef.current = theme;
      settingsRef.current = settings;
    });

    useEffect(() => {
      if (!viewRef.current || !doc || doc.isBinary) {
        return;
      }

      if (typeof doc.scroll?.line === 'number') {
        const line = doc.scroll.line;
        const column = doc.scroll.column ?? 0;

        try {
          // Check if the line number is valid for the current document
          const totalLines = viewRef.current.state.doc.lines;

          // Only proceed if the line number is within the document's range
          if (line < totalLines) {
            const linePos = viewRef.current.state.doc.line(line + 1).from + column;
            viewRef.current.dispatch({
              selection: { anchor: linePos },
              scrollIntoView: true,
            });
            viewRef.current.focus();
          } else {
            logger.warn(`Invalid line number ${line + 1} in ${totalLines}-line document`);
          }
        } catch (error) {
          logger.error('Error scrolling to line:', error);
        }
      } else if (typeof doc.scroll?.top === 'number' || typeof doc.scroll?.left === 'number') {
        viewRef.current.scrollDOM.scrollTo(doc.scroll.left ?? 0, doc.scroll.top ?? 0);
      }
    }, [doc?.scroll]);

    useEffect(() => {
      if (!containerRef.current || viewRef.current) {
        return;
      }

      const editorStates = new Map<string, EditorState>();
      editorStatesRef.current = editorStates;

      const extensions = [languageCompartment.of([]), envMaskingCompartment.of([])];

      const state = newEditorState(
        '',
        theme,
        settings,
        onScrollRef,
        debounceScroll,
        onSaveRef,
        extensions,
        viewRef,
        settingsRef,
      );

      const view = new EditorView({
        state,
        parent: containerRef.current,
        dispatchTransactions(transactions) {
          const previousSelection = view.state.selection;

          view.update(transactions);

          const newSelection = view.state.selection;

          const selectionChanged =
            newSelection !== previousSelection &&
            (newSelection === undefined || previousSelection === undefined || !newSelection.eq(previousSelection));

          if (docRef.current && (transactions.some((transaction) => transaction.docChanged) || selectionChanged)) {
            debouncedOnChange({
              selection: view.state.selection,
              content: view.state.doc.toString(),
            });

            editorStatesRef.current?.set(docRef.current.filePath, view.state);
          }
        },
      });

      viewRef.current = view;

      if (doc) {
        if (doc.isBinary) {
          setNoDocument(view);
        } else {
          setEditorDocument(
            view,
            theme,
            editable,
            languageCompartment,
            autoFocusOnDocumentChange,
            doc as TextEditorDocument,
          );
        }
      } else {
        setNoDocument(view);
      }
    }, [containerRef]);

    useEffect(() => {
      if (doc && !doc.isBinary) {
        const filePath = doc.filePath;
        const editorState = editorStatesRef.current?.get(filePath);

        if (viewRef.current && editorState && viewRef.current.state !== editorState) {
          viewRef.current.setState(editorState);
        } else if (viewRef.current && !editorState) {
          // This case handles new files that don't have a saved state yet
          setEditorDocument(
            viewRef.current,
            theme,
            editable,
            languageCompartment,
            autoFocusOnDocumentChange,
            doc as TextEditorDocument,
          );
        }
      }
    }, [doc?.filePath, theme, editable, autoFocusOnDocumentChange]);

    // This effect handles document content changes from external sources
    useEffect(() => {
      if (viewRef.current && doc && !doc.isBinary && doc.value !== viewRef.current.state.doc.toString()) {
        setEditorDocument(
          viewRef.current,
          theme,
          editable,
          languageCompartment,
          autoFocusOnDocumentChange,
          doc as TextEditorDocument,
        );
      }
    }, [doc?.value, theme, editable, languageCompartment, autoFocusOnDocumentChange]);

    useEffect(() => {
      if (!viewRef.current) {
        return;
      }

      viewRef.current.dispatch({
        effects: [reconfigureTheme(theme)],
      });
    }, [theme]);

    useEffect(() => {
      if (!viewRef.current) {
        return;
      }

      const { locked } = isFileLocked(doc?.filePath ?? '', getCurrentChatId());
      const isEditable = editable && !doc?.isBinary && !locked;

      if (viewRef.current.state.facet(EditorView.editable) !== isEditable) {
        viewRef.current.dispatch({
          effects: [editableStateEffect.of(isEditable)],
        });
      }
    }, [editable, doc?.isBinary, doc?.filePath]);

    useEffect(() => {
      const view = viewRef.current;

      return () => {
        view?.destroy();
      };
    }, []);

    // Add debounced change handler
    const debouncedOnChange = debounce((update: EditorUpdate) => {
      onChangeRef.current?.(update);
    }, debounceChange);

    if (doc?.isBinary) {
      return (
        <div ref={containerRef} className={classNames('cm-editor', className)}>
          <BinaryContent />
        </div>
      );
    }

    return <div ref={containerRef} className={classNames('cm-editor', className)} />;
  },
);

function newEditorState(
  content: string,
  theme: Theme,
  settings: EditorSettings | undefined,
  onScrollRef: MutableRefObject<OnScrollCallback | undefined>,
  debounceScroll: number,
  onSaveRef: MutableRefObject<OnSaveCallback | undefined>,
  extensions: Extension[],
  viewRef: MutableRefObject<EditorView | undefined>,
  settingsRef: MutableRefObject<EditorSettings | undefined>,
) {
  const onFileSave = () => {
    const view = viewRef.current;

    if (view && settingsRef.current?.formatOnSave) {
      formatCode(view.state.doc.toString()).then((formatted) => {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: formatted },
        });
        onSaveRef.current?.();
      });
    } else {
      onSaveRef.current?.();
    }

    return true;
  };

  return EditorState.create({
    doc: content,
    extensions: [
      EditorView.domEventHandlers({
        scroll: debounce((event, view) => {
          if (event.target !== view.scrollDOM) {
            return;
          }

          onScrollRef.current?.({
            left: view.scrollDOM.scrollLeft,
            top: view.scrollDOM.scrollTop,
          });
        }, debounceScroll),
        keydown: (event, view) => {
          if (view.state.readOnly) {
            view.dispatch({
              effects: [readOnlyTooltipStateEffect.of(event.key !== 'Escape')],
            });

            return true;
          }

          return false;
        },
      }),
      getTheme(theme, settings),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        { key: 'Tab', run: acceptCompletion },
        {
          key: 'Mod-s',
          preventDefault: true,
          run: onFileSave,
        },
        indentKeyBinding,
      ]),
      autocompletion({
        closeOnBlur: false,
      }),
      tooltips({
        position: 'absolute',
        parent: document.body,
        tooltipSpace: (view) => {
          const rect = view.dom.getBoundingClientRect();

          return {
            top: rect.top - 50,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right + 10,
          };
        },
      }),
      closeBrackets(),
      lineNumbers(),
      scrollPastEnd(),
      dropCursor(),
      drawSelection(),
      bracketMatching(),
      indentOnInput(),
      editableTooltipField,
      editableStateField,
      EditorState.readOnly.from(editableStateField, (editable) => !editable),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      indentUnit.of(' '.repeat(settings?.tabSize ?? 2)),
      ...extensions,
    ],
  });
}

function setNoDocument(view: EditorView) {
  view.dispatch({
    selection: { anchor: 0 },
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: '',
    },
  });

  view.scrollDOM.scrollTo(0, 0);
}

function setEditorDocument(
  view: EditorView,
  theme: Theme,
  editable: boolean,
  languageCompartment: Compartment,
  autoFocus: boolean,
  doc: TextEditorDocument,
) {
  if (doc.value !== view.state.doc.toString()) {
    view.dispatch({
      selection: { anchor: 0 },
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: doc.value,
      },
    });
  }

  // Check if the file is locked
  const currentChatId = getCurrentChatId();
  const { locked } = isFileLocked(doc.filePath, currentChatId);

  // Set editable state based on both the editable prop and the file's lock state
  view.dispatch({
    effects: [editableStateEffect.of(editable && !doc.isBinary && !locked)],
  });

  getLanguage(doc.filePath).then((languageSupport) => {
    if (!languageSupport) {
      return;
    }

    view.dispatch({
      effects: [languageCompartment.reconfigure([languageSupport]), reconfigureTheme(theme)],
    });

    requestAnimationFrame(() => {
      const currentLeft = view.scrollDOM.scrollLeft;
      const currentTop = view.scrollDOM.scrollTop;
      const newLeft = doc.scroll?.left ?? 0;
      const newTop = doc.scroll?.top ?? 0;

      if (typeof doc.scroll?.line === 'number') {
        const line = doc.scroll.line;
        const column = doc.scroll.column ?? 0;

        try {
          // Check if the line number is valid for the current document
          const totalLines = view.state.doc.lines;

          // Only proceed if the line number is within the document's range
          if (line < totalLines) {
            const linePos = view.state.doc.line(line + 1).from + column;
            view.dispatch({
              selection: { anchor: linePos },
              scrollIntoView: true,
            });
            view.focus();
          } else {
            logger.warn(`Invalid line number ${line + 1} in ${totalLines}-line document`);
          }
        } catch (error) {
          logger.error('Error scrolling to line:', error);
        }

        return;
      }

      const needsScrolling = currentLeft !== newLeft || currentTop !== newTop;

      if (autoFocus && editable) {
        if (needsScrolling) {
          view.scrollDOM.addEventListener(
            'scroll',
            () => {
              view.focus();
            },
            { once: true },
          );
        } else {
          view.focus();
        }
      }

      view.scrollDOM.scrollTo(newLeft, newTop);
    });
  });
}

function getReadOnlyTooltip(state: EditorState) {
  if (!state.readOnly) {
    return [];
  }

  // Get the current document from the module-level reference
  const currentDoc = currentDocRef;
  let tooltipMessage = 'Cannot edit file while AI response is being generated';

  // If we have a current document, check if it's locked
  if (currentDoc?.filePath) {
    const currentChatId = getCurrentChatId();
    const { locked } = isFileLocked(currentDoc.filePath, currentChatId);

    if (locked) {
      tooltipMessage = 'This file is locked and cannot be edited';
    }
  }

  return state.selection.ranges
    .filter((range) => range.empty)
    .map((range) => ({
      pos: range.head,
      above: true,
      strictSide: true,
      arrow: true,
      create: () => {
        const divElement = document.createElement('div');
        divElement.className = 'cm-readonly-tooltip';
        divElement.textContent = tooltipMessage;

        return { dom: divElement };
      },
    }));
}
