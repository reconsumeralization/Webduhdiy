import { autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { EditorState, StateField, StateEffect, type Extension } from '@codemirror/state';
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { linter, type Diagnostic } from '@codemirror/lint';
import { debounce } from '~/utils/debounce';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('CodeIntelligence');

interface IntelligenceConfig {
  enableSemanticAnalysis: boolean;
  enableErrorDetection: boolean;
  enableAutoImports: boolean;
  enableTypeInference: boolean;
  debounceMs: number;
}

const defaultConfig: IntelligenceConfig = {
  enableSemanticAnalysis: true,
  enableErrorDetection: true,
  enableAutoImports: true,
  enableTypeInference: true,
  debounceMs: 300,
};

// AI-powered completions using the workbench context
const aiCompletionSource = async (context: CompletionContext): Promise<CompletionResult | null> => {
  const { state, pos, explicit } = context;
  const line = state.doc.lineAt(pos);
  const lineText = line.text;
  const beforeCursor = lineText.slice(0, pos - line.from);
  const afterCursor = lineText.slice(pos - line.from);

  // Don't trigger completions in comments or strings unless explicit
  if (!explicit && (isInComment(state, pos) || isInString(state, pos))) {
    return null;
  }

  // Get context from the current file and project structure
  const documentContext = getDocumentContext(state);
  const projectContext = await getProjectContext();

  // Generate intelligent completions based on context
  const completions = await generateCompletions({
    beforeCursor,
    afterCursor,
    documentContext,
    projectContext,
    language: getLanguageFromState(state),
    explicitRequest: explicit,
  });

  if (completions.length === 0) {
    return null;
  }

  return {
    from: pos - beforeCursor.length,
    options: completions.map((completion) => ({
      label: completion.label,

      // Only include properties that exist on the completion object and are valid for Completion
      type: completion.type,
      apply: completion.insertText,
      boost: completion.priority,
    })),
  };
};

// Enhanced error detection and linting
const intelligentLinter = (config: IntelligenceConfig) =>
  linter(async (view: EditorView): Promise<Diagnostic[]> => {
    const diagnostics: Diagnostic[] = [];
    const { state } = view;
    const text = state.doc.toString();
    const language = getLanguageFromState(state);

    if (!config.enableErrorDetection) {
      return diagnostics;
    }

    try {
      // Syntax errors
      const syntaxErrors = await detectSyntaxErrors(text, language);
      diagnostics.push(...syntaxErrors);

      // Semantic errors (type checking, undefined variables, etc.)
      if (config.enableSemanticAnalysis) {
        const semanticErrors = await detectSemanticErrors(text, language, state);
        diagnostics.push(...semanticErrors);
      }

      // Code quality issues
      const qualityIssues = await detectQualityIssues(text, language);
      diagnostics.push(...qualityIssues);

      // Security vulnerabilities
      const securityIssues = await detectSecurityIssues(text, language);
      diagnostics.push(...securityIssues);
    } catch (error) {
      logger.error('Error in intelligent linter:', error);
    }

    return diagnostics;
  });

// Auto-import functionality
const autoImportExtension = (config: IntelligenceConfig): Extension => {
  if (!config.enableAutoImports) {
    return [];
  }

  const autoImportField = StateField.define<string[]>({
    create: () => [],
    update(imports, tr) {
      // Track imports in the document
      const newImports = extractImports(tr.state.doc.toString());
      return newImports;
    },
  });

  const autoImportEffect = StateEffect.define<{
    from: number;
    to: number;
    insert: string;
  }>();

  return [
    autoImportField,
    EditorView.updateListener.of(
      debounce(async (update: ViewUpdate) => {
        if (update.docChanged) {
          const suggestions = await suggestAutoImports(update.state);

          if (suggestions.length > 0) {
            // Apply auto-imports
            const effects = suggestions.map((suggestion) =>
              autoImportEffect.of({
                from: suggestion.from,
                to: suggestion.to,
                insert: suggestion.importStatement,
              }),
            );

            update.view.dispatch({ effects });
          }
        }
      }, config.debounceMs),
    ),
  ];
};

// Type inference and hover information
const typeInferenceExtension = (config: IntelligenceConfig): Extension => {
  if (!config.enableTypeInference) {
    return [];
  }

  return EditorView.domEventHandlers({
    mousemove: debounce(async (event: MouseEvent, view: EditorView) => {
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });

      if (pos !== null) {
        const typeInfo = await inferTypeAtPosition(view.state, pos);

        if (typeInfo) {
          // Show type information in tooltip
          showTypeTooltip(view, pos, typeInfo);
        }
      }
    }, 200),
  });
};

// Helper functions
function isInComment(state: EditorState, pos: number): boolean {
  const tree = syntaxTree(state);
  const node = tree.resolveInner(pos);

  return node.type.name.includes('comment') || node.type.name.includes('Comment');
}

function isInString(state: EditorState, pos: number): boolean {
  const tree = syntaxTree(state);
  const node = tree.resolveInner(pos);

  return node.type.name.includes('string') || node.type.name.includes('String');
}

function getLanguageFromState(state: EditorState): string {
  // Extract language from the editor state
  const languageData = state.facet(EditorState.languageData);

  return languageData[0]?.name || 'javascript';
}

function getDocumentContext(state: EditorState) {
  const doc = state.doc.toString();
  const tree = syntaxTree(state);

  return {
    content: doc,
    tree,
    imports: extractImports(doc),
    exports: extractExports(doc),
    functions: extractFunctions(doc),
    variables: extractVariables(doc),
    classes: extractClasses(doc),
  };
}

async function getProjectContext() {
  /*
   * In a real scenario, this would involve reading package.json, tsconfig.json, etc.
   * to understand the project structure and dependencies.
   */
  try {
    // This is a simplified stand-in for a real implementation
    const packageJson = JSON.parse(localStorage.getItem('package.json') || '{}');
    const framework = detectFramework({ 'package.json': packageJson });

    return { framework };
  } catch (error) {
    console.error('Failed to get project context:', error);
    return { framework: 'unknown' };
  }
}

interface ProjectContext {
  framework?: string;
}

async function generateCompletions(context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: ProjectContext;
  language: string;
  explicitRequest: boolean;
}) {
  // AI-powered completion generation logic
  const completions: Array<{
    label: string;
    type: string;
    insertText: string;
    priority: number;
  }> = [];

  // JavaScript/TypeScript completions
  if (['javascript', 'typescript', 'jsx', 'tsx'].includes(context.language)) {
    completions.push(...generateJSCompletions(context));
  }

  // CSS completions
  if (['css', 'scss', 'less'].includes(context.language)) {
    completions.push(...generateCSSCompletions(context));
  }

  // HTML completions
  if (context.language === 'html') {
    completions.push(...generateHTMLCompletions(context));
  }

  /*
   * Framework-specific completions
   */
  if (context.projectContext.framework === 'react') {
    completions.push(...generateReactCompletions(context));
  } else if (context.projectContext.framework === 'vue') {
    completions.push(...generateVueCompletions(context));
  }

  return completions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

function generateJSCompletions(context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: unknown;
  language: string;
  explicitRequest: boolean;
}) {
  const completions: Array<{
    label: string;
    type: string;
    insertText: string;
    priority: number;
  }> = [];
  const { beforeCursor } = context;

  // Console methods
  if (beforeCursor.endsWith('console.')) {
    completions.push(
      { label: 'log', type: 'method', insertText: 'log(${})', priority: 90 },
      { label: 'error', type: 'method', insertText: 'error(${})', priority: 80 },
      { label: 'warn', type: 'method', insertText: 'warn(${})', priority: 80 },
      { label: 'info', type: 'method', insertText: 'info(${})', priority: 70 },
    );
  }

  // Common patterns
  if (beforeCursor.includes('function') || beforeCursor.includes('=>')) {
    completions.push(
      { label: 'async function', type: 'keyword', insertText: 'async function ${}() {\n  \n}', priority: 85 },
      {
        label: 'try-catch',
        type: 'snippet',
        insertText: 'try {\n  ${}\n} catch (error) {\n  console.error(error);\n}',
        priority: 80,
      },
    );
  }

  return completions;
}

function generateCSSCompletions(context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: unknown;
  language: string;
  explicitRequest: boolean;
}) {
  const completions: Array<{
    label: string;
    type: string;
    insertText: string;
    priority: number;
  }> = [];
  const { beforeCursor } = context;

  // CSS properties
  if (beforeCursor.includes('{') || beforeCursor.includes(';')) {
    completions.push(
      { label: 'display', type: 'property', insertText: 'display: ${}', priority: 90 },
      { label: 'flex-direction', type: 'property', insertText: 'flex-direction: ${}', priority: 85 },
      { label: 'justify-content', type: 'property', insertText: 'justify-content: ${}', priority: 85 },
      { label: 'align-items', type: 'property', insertText: 'align-items: ${}', priority: 85 },
    );
  }

  return completions;
}

function generateHTMLCompletions(context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: unknown;
  language: string;
  explicitRequest: boolean;
}) {
  const completions: Array<{
    label: string;
    type: string;
    insertText: string;
    priority: number;
  }> = [];
  const { beforeCursor } = context;

  if (beforeCursor.includes('<')) {
    completions.push(
      { label: 'div', type: 'element', insertText: 'div className="${}">', priority: 90 },
      { label: 'span', type: 'element', insertText: 'span className="${}">', priority: 80 },
      { label: 'button', type: 'element', insertText: 'button onClick="${}" className="${}">', priority: 85 },
    );
  }

  return completions;
}

function generateReactCompletions(context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: unknown;
  language: string;
  explicitRequest: boolean;
}) {
  const completions: Array<{
    label: string;
    type: string;
    insertText: string;
    priority: number;
  }> = [];
  const { beforeCursor } = context;

  // React hooks
  if (beforeCursor.includes('use') || beforeCursor.includes('React.')) {
    completions.push(
      { label: 'useState', type: 'hook', insertText: 'useState(${})', priority: 95 },
      { label: 'useEffect', type: 'hook', insertText: 'useEffect(() => {\n  ${}\n}, [])', priority: 95 },
      { label: 'useCallback', type: 'hook', insertText: 'useCallback(() => {\n  ${}\n}, [])', priority: 90 },
      { label: 'useMemo', type: 'hook', insertText: 'useMemo(() => {\n  return ${}\n}, [])', priority: 90 },
    );
  }

  return completions;
}

function generateVueCompletions(_context: {
  beforeCursor: string;
  afterCursor: string;
  documentContext: unknown;
  projectContext: unknown;
  language: string;
  explicitRequest: boolean;
}) {
  // Vue-specific completions
  return [];
}

async function detectSyntaxErrors(text: string, language: string): Promise<Diagnostic[]> {
  // Implement syntax error detection based on language
  const diagnostics: Diagnostic[] = [];

  if (['javascript', 'typescript'].includes(language)) {
    // Use a lightweight JS parser to detect syntax errors
    try {
      /*
       * This would use a real parser like @babel/parser or typescript.
       * For now, basic regex-based detection.
       */
      const unclosedBrackets = findUnclosedBrackets(text);
      diagnostics.push(...unclosedBrackets);
    } catch {
      // Parser error indicates syntax issue
    }
  }

  return diagnostics;
}

async function detectSemanticErrors(text: string, language: string, _state: EditorState): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  // Detect undefined variables
  const undefinedVars = findUndefinedVariables(text, language);

  diagnostics.push(...undefinedVars);

  // Detect unused imports
  const unusedImports = findUnusedImports(text, language);

  diagnostics.push(...unusedImports);

  return diagnostics;
}

async function detectQualityIssues(text: string, language: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  // Detect code smells
  const codeSmells = findCodeSmells(text, language);

  diagnostics.push(...codeSmells);

  return diagnostics;
}

async function detectSecurityIssues(text: string, language: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  // Detect potential security vulnerabilities
  const securityIssues = findSecurityIssues(text, language);

  diagnostics.push(...securityIssues);

  return diagnostics;
}

// Utility functions for extracting code elements
function extractImports(code: string): string[] {
  const importRegex = /import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g;
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function extractExports(code: string): string[] {
  const exportRegex = /export\s+(?:default\s+)?(?:const\s+|let\s+|var\s+|function\s+|class\s+)?(\w+)/g;
  const exports: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = exportRegex.exec(code)) !== null) {
    exports.push(match[1]);
  }

  return exports;
}

function extractFunctions(code: string): string[] {
  const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function))/g;
  const functions: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = functionRegex.exec(code)) !== null) {
    functions.push(match[1] || match[2]);
  }

  return functions;
}

function extractVariables(code: string): string[] {
  const varRegex = /(?:const|let|var)\s+(\w+)/g;
  const variables: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = varRegex.exec(code)) !== null) {
    variables.push(match[1]);
  }

  return variables;
}

function extractClasses(code: string): string[] {
  const classRegex = /class\s+([A-Za-z0-9_]+)/g;
  return (code.match(classRegex) || []).map((c) => c.replace('class ', ''));
}

function detectFramework(files: Record<string, string>): string {
  const fileNames = Object.keys(files);

  if (fileNames.some((f) => f.includes('next.config') || f.includes('pages/'))) {
    return 'nextjs';
  }

  if (fileNames.some((f) => f.includes('vue.config') || f.includes('.vue'))) {
    return 'vue';
  }

  if (fileNames.some((f) => f.includes('angular.json') || f.includes('.component.ts'))) {
    return 'angular';
  }

  if (files['package.json']) {
    try {
      const packageJson = JSON.parse(files['package.json']);

      if (packageJson.dependencies?.react || packageJson.dependencies?.['react-dom']) {
        return 'react';
      }
    } catch {
      // Ignore parse errors
    }
  }

  return 'vanilla';
}

async function suggestAutoImports(state: EditorState): Promise<
  Array<{
    from: number;
    to: number;
    importStatement: string;
  }>
> {
  // Analyze code for missing imports and suggest auto-imports
  const suggestions: Array<{ from: number; to: number; importStatement: string }> = [];
  const code = state.doc.toString();

  // Find undefined identifiers that could be auto-imported
  const undefinedIdentifiers = findUndefinedIdentifiers(code);

  for (const identifier of undefinedIdentifiers) {
    const importStatement = await findImportForIdentifier(identifier);

    if (importStatement) {
      suggestions.push({
        from: 0,
        to: 0,
        importStatement: importStatement + '\n',
      });
    }
  }

  return suggestions;
}

async function inferTypeAtPosition(state: EditorState, pos: number): Promise<string | null> {
  // Type inference logic - would integrate with TypeScript language service
  const tree = syntaxTree(state);
  const node = tree.resolveInner(pos);

  // Basic type inference based on syntax
  if (node.type.name === 'VariableName') {
    const text = state.doc.sliceString(node.from, node.to);

    return inferVariableType(text, state);
  }

  return null;
}

function showTypeTooltip(_view: EditorView, _pos: number, _typeInfo: string) {
  /*
   * Show type information in a tooltip.
   * This would integrate with the existing tooltip system.
   */
}

// Helper functions for error detection
function findUnclosedBrackets(text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const brackets = { '(': ')', '[': ']', '{': '}' };
  const stack: Array<{ char: string; pos: number }> = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (Object.keys(brackets).includes(char)) {
      stack.push({ char, pos: i });
    } else if (Object.values(brackets).includes(char)) {
      const last = stack.pop();

      if (!last || brackets[last.char as keyof typeof brackets] !== char) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: `Unmatched closing bracket '${char}'`,
        });
      }
    }
  }

  // Check for unclosed brackets
  for (const { char, pos } of stack) {
    diagnostics.push({
      from: pos,
      to: pos + 1,
      severity: 'error',
      message: `Unclosed bracket '${char}'`,
    });
  }

  return diagnostics;
}

function findUndefinedVariables(_text: string, _language: string): Diagnostic[] {
  // Simplified undefined variable detection
  return [];
}

function findUnusedImports(_text: string, _language: string): Diagnostic[] {
  // Simplified unused import detection
  return [];
}

function findCodeSmells(text: string, _language: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  // Long functions
  const longFunctions = findLongFunctions(text);

  diagnostics.push(
    ...longFunctions.map((fn) => ({
      from: fn.start,
      to: fn.end,
      severity: 'warning' as const,
      message: `Function is too long (${fn.lines} lines). Consider breaking it down.`,
    })),
  );

  return diagnostics;
}

function findSecurityIssues(text: string, _language: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  // Detect eval usage
  const evalUsage = findEvalUsage(text);

  diagnostics.push(
    ...evalUsage.map((usage) => ({
      from: usage.start,
      to: usage.end,
      severity: 'error' as const,
      message: 'Use of eval() is dangerous and should be avoided',
    })),
  );

  return diagnostics;
}

function findUndefinedIdentifiers(_code: string): string[] {
  // Simplified - would use proper AST analysis
  return [];
}

async function findImportForIdentifier(identifier: string): Promise<string | null> {
  // Would look up import suggestions from known libraries
  const commonImports: Record<string, string> = {
    React: "import React from 'react'",
    useState: "import { useState } from 'react'",
    useEffect: "import { useEffect } from 'react'",
    lodash: "import _ from 'lodash'",
  };

  return commonImports[identifier] || null;
}

function inferVariableType(variableName: string, state: EditorState): string | null {
  // Basic type inference
  const code = state.doc.toString();
  const varDeclaration = new RegExp(`(?:const|let|var)\\s+${variableName}\\s*=\\s*(.+)`);
  const match = code.match(varDeclaration);

  if (match) {
    const value = match[1].trim();

    if (value.startsWith('"') || value.startsWith("'")) {
      return 'string';
    }

    if (value.match(/^\d+$/)) {
      return 'number';
    }

    if (value === 'true' || value === 'false') {
      return 'boolean';
    }

    if (value.startsWith('[')) {
      return 'array';
    }

    if (value.startsWith('{')) {
      return 'object';
    }
  }

  return null;
}

function findLongFunctions(_text: string): Array<{ start: number; end: number; lines: number }> {
  // Simplified function length detection
  return [];
}

function findEvalUsage(text: string): Array<{ start: number; end: number }> {
  const evalRegex = /\beval\s*\(/g;
  const matches: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = evalRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return matches;
}

// Main extension factory
export function createCodeIntelligenceExtension(config: Partial<IntelligenceConfig> = {}): Extension {
  const finalConfig = { ...defaultConfig, ...config };

  return [
    autocompletion({
      override: [aiCompletionSource],
      closeOnBlur: false,
      activateOnTyping: true,
      selectOnOpen: false,
      maxRenderedOptions: 50,
    }),
    intelligentLinter(finalConfig),
    autoImportExtension(finalConfig),
    typeInferenceExtension(finalConfig),
  ];
}
