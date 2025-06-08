import { atom } from 'nanostores';
import { logStore } from '~/lib/stores/logs';
import { workbenchStore } from '~/lib/stores/workbench';

// Types for visual design analysis
export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'group' | 'frame' | 'component';
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    opacity?: number;
    shadows?: Array<{
      color: string;
      x: number;
      y: number;
      blur: number;
      spread: number;
    }>;
    boxShadow?: string;
    margin?: string;
    padding?: string;
    display?: string;
    [key: string]: unknown;
  };
  constraints?: {
    horizontal: 'left' | 'right' | 'center' | 'stretch' | 'scale';
    vertical: 'top' | 'bottom' | 'center' | 'stretch' | 'scale';
  };
  children?: DesignElement[];
  content?: string; // For text elements
  imageUrl?: string; // For image elements
  alt?: string; // For image accessibility
  linkUrl?: string; // For clickable elements
}

export interface DesignSystem {
  colors: Record<string, string>;
  typography: Record<
    string,
    {
      fontSize: number;
      fontFamily: string;
      fontWeight: string;
      lineHeight?: number;
      letterSpacing?: number;
    }
  >;
  spacing: Record<string, number>;
  shadows: Record<
    string,
    {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    }
  >;
  borderRadius: Record<string, number>;
  breakpoints: Record<string, number>;
  zIndex?: Record<string, number>;
}

export interface GeneratedCode {
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'html';
  language: 'typescript' | 'javascript';
  styling: 'tailwind' | 'css' | 'styled-components' | 'emotion';
  files: Array<{
    path: string;
    content: string;
    type: 'component' | 'style' | 'types' | 'config';
  }>;
  dependencies: Array<{
    name: string;
    version: string;
    type: 'dependencies' | 'devDependencies';
  }>;
  instructions: string[];
  previewUrl?: string;
}

export interface FigmaIntegration {
  apiKey?: string;
  fileId?: string;
  nodeId?: string;
  accessToken?: string;
}

export interface SketchIntegration {
  cloudUrl?: string;
  documentId?: string;
  accessToken?: string;
}

type VisionProvider = 'openai' | 'google' | 'anthropic';

class VisualCodeGenerator {
  private _currentDesign = atom<DesignElement | null>(null);
  private _designSystem = atom<DesignSystem | null>(null);
  private _generatedCode = atom<GeneratedCode | null>(null);
  private _isProcessing = atom(false);
  private _figmaConfig = atom<FigmaIntegration>({});
  private _sketchConfig = atom<SketchIntegration>({});
  private _visionApiKey = atom<string>('');
  private _visionProvider = atom<VisionProvider>('openai');
  private _plugins: Array<{
    name: string;
    analyzeDesign?: (design: DesignElement) => Promise<unknown>;
    generateCode?: (design: DesignElement, config: unknown) => Promise<string>;
  }> = [];

  constructor() {
    this._loadStoredConfig();
  }

  private _loadStoredConfig() {
    try {
      const figmaConfig = localStorage.getItem('figma-config');

      if (figmaConfig) {
        this._figmaConfig.set(JSON.parse(figmaConfig));
      }

      const sketchConfig = localStorage.getItem('sketch-config');

      if (sketchConfig) {
        this._sketchConfig.set(JSON.parse(sketchConfig));
      }

      const visionApiKey = localStorage.getItem('vision-api-key');

      if (visionApiKey) {
        this._visionApiKey.set(visionApiKey);
      }

      const visionProvider = localStorage.getItem('vision-provider');

      if (visionProvider) {
        this._visionProvider.set(visionProvider as VisionProvider);
      }
    } catch (error) {
      logStore.logError('Failed to load visual-to-code config', error);
    }
  }

  private _saveConfig() {
    try {
      localStorage.setItem('figma-config', JSON.stringify(this._figmaConfig.get()));
      localStorage.setItem('sketch-config', JSON.stringify(this._sketchConfig.get()));
      localStorage.setItem('vision-api-key', this._visionApiKey.get());
      localStorage.setItem('vision-provider', this._visionProvider.get());
    } catch (error) {
      logStore.logError('Failed to save visual-to-code config', error);
    }
  }

  configureFigma(config: FigmaIntegration) {
    this._figmaConfig.set(config);
    this._saveConfig();
    logStore.logSystem('🎨 Figma integration configured');
  }

  configureSketch(config: SketchIntegration) {
    this._sketchConfig.set(config);
    this._saveConfig();
    logStore.logSystem('✏️ Sketch integration configured');
  }

  configureVisionAPI(apiKey: string, provider: VisionProvider) {
    this._visionApiKey.set(apiKey);
    this._visionProvider.set(provider);
    this._saveConfig();
    logStore.logSystem(`👁️ Vision API configured for ${provider}`);
  }

  async analyzeImageUpload(file: File): Promise<DesignElement> {
    this._isProcessing.set(true);

    try {
      logStore.logSystem('📷 Analyzing uploaded image');

      const base64 = await this._fileToBase64(file);
      const analysis = await this._analyzeWithVisionAPI(base64);
      const designElement = await this._convertAnalysisToDesign(analysis);
      this._currentDesign.set(designElement);
      logStore.logSystem('✅ Image analysis complete');

      return designElement;
    } catch (error) {
      logStore.logError('Failed to analyze image', error);
      throw error;
    } finally {
      this._isProcessing.set(false);
    }
  }

  private async _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async _analyzeWithVisionAPI(base64Image: string): Promise<unknown> {
    const provider = this._visionProvider.get();
    const apiKey = this._visionApiKey.get();

    if (!apiKey) {
      throw new Error(`${provider} API key not configured`);
    }

    switch (provider) {
      case 'openai':
        return this._analyzeWithOpenAI(base64Image, apiKey);
      case 'google':
        return this._analyzeWithGoogleVision(base64Image, apiKey);
      case 'anthropic':
        return this._analyzeWithAnthropic(base64Image, apiKey);
      default:
        throw new Error(`Unsupported vision provider: ${provider}`);
    }
  }

  private async _analyzeWithOpenAI(base64Image: string, apiKey: string): Promise<unknown> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this UI design image and provide a detailed description of:
                1. Layout structure and hierarchy
                2. All text content and typography
                3. Colors, spacing, and visual styles
                4. Interactive elements (buttons, inputs, etc.)
                5. Component boundaries and relationships
                Return the analysis as structured JSON with precise measurements and styling details.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };

    try {
      // Try to parse JSON if possible
      return JSON.parse(data.choices[0].message.content);
    } catch {
      return data.choices[0].message.content;
    }
  }

  private async _analyzeWithGoogleVision(base64Image: string, apiKey: string): Promise<unknown> {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }, { type: 'OBJECT_LOCALIZATION' }, { type: 'IMAGE_PROPERTIES' }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { responses?: unknown[] };

    return data.responses?.[0] ?? data;
  }

  private async _analyzeWithAnthropic(base64Image: string, apiKey: string): Promise<unknown> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this UI design image and provide detailed structure information for code generation.`,
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { content?: Array<{ text?: string }> };

    try {
      return JSON.parse(data.content?.[0]?.text ?? '{}');
    } catch {
      return data.content?.[0]?.text;
    }
  }

  private async _convertAnalysisToDesign(analysis: unknown): Promise<DesignElement> {
    // Try to parse a real structure if possible, fallback to a stub
    if (typeof analysis === 'object' && analysis !== null && 'id' in analysis && 'type' in analysis) {
      return analysis as DesignElement;
    }

    // Fallback stub
    return {
      id: 'root',
      type: 'frame',
      name: 'Analyzed Design',
      bounds: { x: 0, y: 0, width: 800, height: 600 },
      styles: {},
      children: [],
    };
  }

  async importFromFigma(fileId: string, nodeId?: string): Promise<DesignElement> {
    this._isProcessing.set(true);

    try {
      const config = this._figmaConfig.get();

      if (!config.accessToken) {
        throw new Error('Figma access token not configured');
      }

      logStore.logSystem('🎨 Importing from Figma');

      const fileData = await this._fetchFigmaFile(fileId, config.accessToken);
      const targetNode = nodeId ? this._findFigmaNode(fileData, nodeId) : (fileData as { document: unknown }).document;
      const designElement = this._convertFigmaNodeToDesign(targetNode);
      const designSystem = this._extractFigmaDesignSystem(fileData);
      this._currentDesign.set(designElement);
      this._designSystem.set(designSystem);
      logStore.logSystem('✅ Figma import complete');

      return designElement;
    } catch (error) {
      logStore.logError('Failed to import from Figma', error);
      throw error;
    } finally {
      this._isProcessing.set(false);
    }
  }

  private async _fetchFigmaFile(fileId: string, accessToken: string): Promise<unknown> {
    const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        'X-Figma-Token': accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    return response.json();
  }

  private _findFigmaNode(fileData: unknown, nodeId: string): unknown {
    function searchNode(node: { id?: string; children?: unknown[] }): unknown {
      if (node.id === nodeId) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = searchNode(child as { id?: string; children?: unknown[] });
          if (found) return found;
        }
      }

      return null;
    }
    return searchNode((fileData as { document: { id?: string; children?: unknown[] } }).document);
  }

  private _convertFigmaNodeToDesign(figmaNode: unknown): DesignElement {
    const node = figmaNode as {
      id: string;
      type: string;
      name: string;
      absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
      characters?: string;
      children?: unknown[];
    };

    const element: DesignElement = {
      id: node.id,
      type: this._mapFigmaTypeToElementType(node.type),
      name: node.name,
      bounds: {
        x: node.absoluteBoundingBox?.x || 0,
        y: node.absoluteBoundingBox?.y || 0,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
      },
      styles: this._extractFigmaStyles(figmaNode),
    };

    if (node.type === 'TEXT' && node.characters) {
      element.content = node.characters;
    }

    if (node.children) {
      element.children = node.children.map((child: unknown) => this._convertFigmaNodeToDesign(child));
    }

    return element;
  }

  private _mapFigmaTypeToElementType(figmaType: string): DesignElement['type'] {
    const mapping: Record<string, DesignElement['type']> = {
      FRAME: 'frame',
      GROUP: 'group',
      TEXT: 'text',
      RECTANGLE: 'shape',
      ELLIPSE: 'shape',
      VECTOR: 'shape',
      COMPONENT: 'component',
      INSTANCE: 'component',
      IMAGE: 'image',
    };
    return mapping[figmaType] || 'frame';
  }

  private _extractFigmaStyles(figmaNode: unknown): DesignElement['styles'] {
    const node = figmaNode as {
      fills?: Array<{ type: string; color: { r: number; g: number; b: number }; opacity?: number }>;
      strokes?: Array<{ type: string; color: { r: number; g: number; b: number } }>;
      strokeWeight?: number;
      cornerRadius?: number;
      style?: {
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
      };
      effects?: Array<{
        type: string;
        color: { r: number; g: number; b: number };
        offset: { x: number; y: number };
        radius: number;
        spread?: number;
      }>;
    };

    const styles: DesignElement['styles'] = {};

    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];

      if (fill.type === 'SOLID') {
        styles.backgroundColor = this._rgbToHex(fill.color);
        styles.opacity = fill.opacity;
      }
    }

    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];

      if (stroke.type === 'SOLID') {
        styles.borderColor = this._rgbToHex(stroke.color);
        styles.borderWidth = node.strokeWeight;
      }
    }

    if (node.cornerRadius) {
      styles.borderRadius = node.cornerRadius;
    }

    if (node.style) {
      styles.fontSize = node.style.fontSize;
      styles.fontFamily = node.style.fontFamily;
      styles.fontWeight = node.style.fontWeight;

      if (node.fills && node.fills.length > 0) {
        const textFill = node.fills[0];

        if (textFill.type === 'SOLID') {
          styles.color = this._rgbToHex(textFill.color);
        }
      }
    }

    if (node.effects && node.effects.length > 0) {
      styles.shadows = node.effects
        .filter((effect) => effect.type === 'DROP_SHADOW')
        .map((effect) => ({
          color: this._rgbToHex(effect.color),
          x: effect.offset.x,
          y: effect.offset.y,
          blur: effect.radius,
          spread: effect.spread || 0,
        }));
    }

    return styles;
  }

  private _extractFigmaDesignSystem(fileData: unknown): DesignSystem {
    const data = fileData as {
      styles?: Record<
        string,
        {
          styleType: string;
          name: string;
          fills?: Array<{ color: { r: number; g: number; b: number } }>;
          fontSize?: number;
          fontFamily?: string;
          fontWeight?: string;
          lineHeightPercent?: number;
          letterSpacing?: number;
        }
      >;
    };

    const designSystem: DesignSystem = {
      colors: {},
      typography: {},
      spacing: {},
      shadows: {},
      borderRadius: {},
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1440,
      },
    };

    if (data.styles) {
      Object.values(data.styles).forEach((style) => {
        if (style.styleType === 'FILL' && style.fills?.[0]) {
          designSystem.colors[style.name] = this._rgbToHex(style.fills[0].color);
        } else if (style.styleType === 'TEXT') {
          designSystem.typography[style.name] = {
            fontSize: style.fontSize || 16,
            fontFamily: style.fontFamily || 'Arial',
            fontWeight: style.fontWeight || 'normal',
            lineHeight: style.lineHeightPercent,
            letterSpacing: style.letterSpacing,
          };
        }
      });
    }

    return designSystem;
  }

  private _rgbToHex(rgb: { r: number; g: number; b: number }): string {
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  async importFromSketch(documentId: string): Promise<DesignElement> {
    this._isProcessing.set(true);

    try {
      const config = this._sketchConfig.get();

      if (!config.accessToken) {
        throw new Error('Sketch access token not configured');
      }

      logStore.logSystem('✏️ Importing from Sketch Cloud');

      const documentData = await this._fetchSketchDocument(documentId, config.accessToken);
      const designElement = this._convertSketchDataToDesign(documentData);
      this._currentDesign.set(designElement);
      logStore.logSystem('✅ Sketch import complete');

      return designElement;
    } catch (error) {
      logStore.logError('Failed to import from Sketch', error);
      throw error;
    } finally {
      this._isProcessing.set(false);
    }
  }

  private async _fetchSketchDocument(documentId: string, accessToken: string): Promise<unknown> {
    const response = await fetch(`https://api.sketch.com/v1/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Sketch API error: ${response.statusText}`);
    }

    return response.json();
  }

  private _convertSketchDataToDesign(_sketchData: unknown): DesignElement {
    // TODO: Implement full Sketch parser
    return {
      id: 'sketch-root',
      type: 'frame',
      name: 'Sketch Design',
      bounds: { x: 0, y: 0, width: 800, height: 600 },
      styles: {},
      children: [],
    };
  }

  async generateCode(
    framework: GeneratedCode['framework'] = 'react',
    language: GeneratedCode['language'] = 'typescript',
    styling: GeneratedCode['styling'] = 'tailwind',
  ): Promise<GeneratedCode> {
    const design = this._currentDesign.get();
    const designSystem = this._designSystem.get();

    if (!design) {
      throw new Error('No design loaded. Please import or analyze a design first.');
    }

    this._isProcessing.set(true);

    try {
      logStore.logSystem(`🚀 Generating ${framework} code with ${styling}`);

      const generatedCode = await this._generateCodeForFramework(design, designSystem, framework, language, styling);
      this._generatedCode.set(generatedCode);

      for (const file of generatedCode.files) {
        await workbenchStore.createFile(file.path, file.content);
      }
      logStore.logSystem('✅ Code generation complete');

      return generatedCode;
    } catch (error) {
      logStore.logError('Failed to generate code', error);
      throw error;
    } finally {
      this._isProcessing.set(false);
    }
  }

  private async _generateCodeForFramework(
    design: DesignElement,
    designSystem: DesignSystem | null,
    framework: GeneratedCode['framework'],
    language: GeneratedCode['language'],
    styling: GeneratedCode['styling'],
  ): Promise<GeneratedCode> {
    switch (framework) {
      case 'react':
        return this._generateReactCode(design, designSystem, language, styling);
      case 'vue':
        return this._generateVueCode();
      case 'angular':
        return this._generateAngularCode();
      case 'svelte':
        return this._generateSvelteCode();
      case 'html':
        return this._generateHTMLCode();
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  private async _generateReactCode(
    design: DesignElement,
    designSystem: DesignSystem | null,
    language: GeneratedCode['language'],
    styling: GeneratedCode['styling'],
  ): Promise<GeneratedCode> {
    const componentName = this._sanitizeComponentName(design.name);
    const isTypeScript = language === 'typescript';
    const fileExtension = isTypeScript ? 'tsx' : 'jsx';
    const componentCode = this._generateReactComponent(design, componentName, styling, isTypeScript);
    const styleFiles = this._generateStyleFiles(design, styling, designSystem);
    const typeFiles = isTypeScript ? this._generateTypeFiles(design) : [];
    const files = [
      {
        path: `components/${componentName}.${fileExtension}`,
        content: componentCode,
        type: 'component' as const,
      },
      ...styleFiles,
      ...typeFiles,
    ];
    const dependencies = this._getFrameworkDependencies('react', language, styling);

    return {
      framework: 'react',
      language,
      styling,
      files,
      dependencies,
      instructions: [
        'Install dependencies: npm install',
        `Import and use the ${componentName} component in your app`,
        styling === 'tailwind' ? 'Make sure Tailwind CSS is configured' : 'Import the CSS file',
      ],
    };
  }

  private _generateReactComponent(
    design: DesignElement,
    componentName: string,
    styling: GeneratedCode['styling'],
    isTypeScript: boolean,
  ): string {
    const props = isTypeScript
      ? `interface ${componentName}Props {\n  className?: string;\n  children?: React.ReactNode;\n}\n\n`
      : '';
    const propsType = isTypeScript ? `: React.FC<${componentName}Props>` : '';
    const propsParam = isTypeScript ? '{ className, children }' : 'props';
    let imports = "import React from 'react';\n";

    if (styling === 'styled-components') {
      imports += "import styled from 'styled-components';\n";
    } else if (styling === 'css') {
      imports += `import './${componentName}.css';\n`;
    }

    const jsx = this._generateReactJSX(design, styling);

    return `${imports}\n${props}const ${componentName}${propsType} = (${propsParam}) => {\n  return (\n${jsx}\n  );\n};\n\nexport default ${componentName};`;
  }

  private _generateReactJSX(design: DesignElement, styling: GeneratedCode['styling'], depth = 2): string {
    const indent = '  '.repeat(depth);
    const className = this._generateClassName(design, styling);
    const style =
      styling === 'css' ? ` className="${className}"` : styling === 'tailwind' ? ` className="${className}"` : '';
    let jsx = '';

    if (design.type === 'image' && design.imageUrl) {
      jsx = `${indent}<img src="${design.imageUrl}"${design.alt ? ` alt="${design.alt}"` : ''}${style} />`;
    } else if (design.type === 'text' && design.content) {
      jsx = `${indent}<span${style}>${design.content}</span>`;
    } else if (design.type === 'component' && design.name) {
      jsx = `${indent}<${this._sanitizeComponentName(design.name)}${style ? ` className="${className}"` : ''}>`;

      if (design.children) {
        jsx += '\n';

        for (const child of design.children) {
          jsx += this._generateReactJSX(child, styling, depth + 1) + '\n';
        }
        jsx += indent;
      }

      jsx += `</${this._sanitizeComponentName(design.name)}>`;
    } else {
      jsx = `${indent}<div${style}>`;

      if (design.content) {
        jsx += design.content;
      }

      if (design.children) {
        jsx += '\n';

        for (const child of design.children) {
          jsx += this._generateReactJSX(child, styling, depth + 1) + '\n';
        }
        jsx += indent;
      }

      jsx += '</div>';
    }

    return jsx;
  }

  private _generateClassName(design: DesignElement, styling: GeneratedCode['styling']): string {
    if (styling === 'tailwind') {
      return this._generateTailwindClasses(design);
    }

    return this._sanitizeComponentName(design.name).toLowerCase();
  }

  private _generateTailwindClasses(design: DesignElement): string {
    const classes: string[] = [];

    if (design.type === 'frame' || design.type === 'group') {
      classes.push('flex', 'flex-col');
    }

    if (design.bounds.width) {
      classes.push(`w-[${design.bounds.width}px]`);
    }

    if (design.bounds.height) {
      classes.push(`h-[${design.bounds.height}px]`);
    }

    if (design.styles.backgroundColor) {
      classes.push(`bg-[${design.styles.backgroundColor}]`);
    }

    if (design.styles.borderRadius) {
      classes.push(`rounded-[${design.styles.borderRadius}px]`);
    }

    if (design.styles.fontSize) {
      classes.push(`text-[${design.styles.fontSize}px]`);
    }

    if (design.styles.color) {
      classes.push(`text-[${design.styles.color}]`);
    }

    if (design.styles.margin) {
      classes.push(`m-[${design.styles.margin}]`);
    }

    if (design.styles.padding) {
      classes.push(`p-[${design.styles.padding}]`);
    }

    if (design.styles.display) {
      classes.push(design.styles.display);
    }

    return classes.join(' ');
  }

  private _generateStyleFiles(
    design: DesignElement,
    styling: GeneratedCode['styling'],
    designSystem: DesignSystem | null,
  ): Array<{ path: string; content: string; type: 'style' }> {
    const files: Array<{ path: string; content: string; type: 'style' }> = [];

    if (styling === 'css') {
      const cssContent = this._generateCSS(design);
      files.push({
        path: `styles/${this._sanitizeComponentName(design.name)}.css`,
        content: cssContent,
        type: 'style',
      });
    }

    if (designSystem) {
      const tokensContent = this._generateDesignTokens(designSystem, styling);
      files.push({
        path: styling === 'css' ? 'styles/tokens.css' : 'tokens/design-system.ts',
        content: tokensContent,
        type: 'style',
      });
    }

    return files;
  }

  private _generateCSS(design: DesignElement): string {
    const className = this._sanitizeComponentName(design.name).toLowerCase();
    let css = `.${className} {\n`;

    if (design.styles.backgroundColor) {
      css += `  background-color: ${design.styles.backgroundColor};\n`;
    }

    if (design.styles.color) {
      css += `  color: ${design.styles.color};\n`;
    }

    if (design.styles.fontSize) {
      css += `  font-size: ${design.styles.fontSize}px;\n`;
    }

    if (design.styles.borderRadius) {
      css += `  border-radius: ${design.styles.borderRadius}px;\n`;
    }

    if (design.bounds.width) {
      css += `  width: ${design.bounds.width}px;\n`;
    }

    if (design.bounds.height) {
      css += `  height: ${design.bounds.height}px;\n`;
    }

    if (design.styles.margin) {
      css += `  margin: ${design.styles.margin};\n`;
    }

    if (design.styles.padding) {
      css += `  padding: ${design.styles.padding};\n`;
    }

    if (design.styles.boxShadow) {
      css += `  box-shadow: ${design.styles.boxShadow};\n`;
    }

    css += '}\n\n';

    if (design.children) {
      for (const child of design.children) {
        css += this._generateCSS(child);
      }
    }

    return css;
  }

  private _generateDesignTokens(designSystem: DesignSystem, styling: GeneratedCode['styling']): string {
    if (styling === 'css') {
      let css = ':root {\n';
      Object.entries(designSystem.colors).forEach(([name, value]) => {
        css += `  --color-${name.toLowerCase().replace(/\s+/g, '-')}: ${value};\n`;
      });
      Object.entries(designSystem.typography).forEach(([name, type]) => {
        const safeName = name.toLowerCase().replace(/\s+/g, '-');
        css += `  --font-size-${safeName}: ${type.fontSize}px;\n`;
        css += `  --font-family-${safeName}: ${type.fontFamily};\n`;
        css += `  --font-weight-${safeName}: ${type.fontWeight};\n`;

        if (type.lineHeight) {
          css += `  --line-height-${safeName}: ${type.lineHeight};\n`;
        }

        if (type.letterSpacing) {
          css += `  --letter-spacing-${safeName}: ${type.letterSpacing};\n`;
        }
      });
      css += '}\n';

      return css;
    } else {
      let tokens = 'export const designTokens = {\n';
      tokens += '  colors: {\n';
      Object.entries(designSystem.colors).forEach(([name, value]) => {
        tokens += `    ${name.replace(/\s+/g, '')}: '${value}',\n`;
      });
      tokens += '  },\n';
      tokens += '  typography: {\n';
      Object.entries(designSystem.typography).forEach(([name, type]) => {
        tokens += `    ${name.replace(/\s+/g, '')}: {\n`;
        tokens += `      fontSize: '${type.fontSize}px',\n`;
        tokens += `      fontFamily: '${type.fontFamily}',\n`;
        tokens += `      fontWeight: '${type.fontWeight}',\n`;

        if (type.lineHeight) {
          tokens += `      lineHeight: '${type.lineHeight}',\n`;
        }

        if (type.letterSpacing) {
          tokens += `      letterSpacing: '${type.letterSpacing}',\n`;
        }

        tokens += '    },\n';
      });
      tokens += '  },\n';
      tokens += '};\n';

      return tokens;
    }
  }

  private _generateTypeFiles(design: DesignElement): Array<{ path: string; content: string; type: 'types' }> {
    const typesContent = `export interface ${this._sanitizeComponentName(design.name)}Props {
  className?: string;
  children?: React.ReactNode;
}

export interface DesignElement {
  id: string;
  type: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: Record<string, unknown>;
}`;
    return [
      {
        path: `types/${this._sanitizeComponentName(design.name)}.types.ts`,
        content: typesContent,
        type: 'types',
      },
    ];
  }

  private _getFrameworkDependencies(
    framework: GeneratedCode['framework'],
    language: GeneratedCode['language'],
    styling: GeneratedCode['styling'],
  ): GeneratedCode['dependencies'] {
    const deps: GeneratedCode['dependencies'] = [];

    if (framework === 'react') {
      deps.push(
        { name: 'react', version: '^18.0.0', type: 'dependencies' },
        { name: 'react-dom', version: '^18.0.0', type: 'dependencies' },
      );

      if (language === 'typescript') {
        deps.push(
          { name: '@types/react', version: '^18.0.0', type: 'devDependencies' },
          { name: '@types/react-dom', version: '^18.0.0', type: 'devDependencies' },
        );
      }
    }

    if (styling === 'tailwind') {
      deps.push(
        { name: 'tailwindcss', version: '^3.0.0', type: 'devDependencies' },
        { name: 'autoprefixer', version: '^10.0.0', type: 'devDependencies' },
        { name: 'postcss', version: '^8.0.0', type: 'devDependencies' },
      );
    } else if (styling === 'styled-components') {
      deps.push({ name: 'styled-components', version: '^6.0.0', type: 'dependencies' });
    }

    return deps;
  }

  private async _generateVueCode(): Promise<GeneratedCode> {
    throw new Error('Vue code generation not implemented yet');
  }
  private async _generateAngularCode(): Promise<GeneratedCode> {
    throw new Error('Angular code generation not implemented yet');
  }
  private async _generateSvelteCode(): Promise<GeneratedCode> {
    throw new Error('Svelte code generation not implemented yet');
  }
  private async _generateHTMLCode(): Promise<GeneratedCode> {
    throw new Error('HTML code generation not implemented yet');
  }

  private _sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, '_$&')
      .replace(/^./, (c) => c.toUpperCase());
  }

  getCurrentDesign(): DesignElement | null {
    return this._currentDesign.get();
  }
  getDesignSystem(): DesignSystem | null {
    return this._designSystem.get();
  }
  getGeneratedCode(): GeneratedCode | null {
    return this._generatedCode.get();
  }
  getProcessingStatus(): boolean {
    return this._isProcessing.get();
  }

  registerPlugin(plugin: {
    name: string;
    analyzeDesign?: (design: DesignElement) => Promise<unknown>;
    generateCode?: (design: DesignElement, config: unknown) => Promise<string>;
  }) {
    this._plugins.push(plugin);
    logStore.logSystem(`🔌 Registered visual-to-code plugin: ${plugin.name}`);
  }
}

export const visualCodeGenerator = new VisualCodeGenerator();
