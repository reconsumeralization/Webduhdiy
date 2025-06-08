import { foldGutter, codeFolding, foldKeymap } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { showMinimap } from '@replit/codemirror-minimap';
import { type Extension } from '@codemirror/state';

export interface EnhancedFeaturesConfig {
  enableMinimap?: boolean;
  enableCodeFolding?: boolean;
}

export function createEnhancedFeaturesExtension(config: EnhancedFeaturesConfig = {}): Extension {
  const extensions: Extension[] = [];

  const { enableMinimap = true, enableCodeFolding = true } = config;

  if (enableCodeFolding) {
    extensions.push(
      foldGutter({
        markerDOM: (open) => {
          const marker = document.createElement('span');
          marker.className = `cm-foldMarker ${open ? 'cm-foldMarker-open' : 'cm-foldMarker-closed'}`;
          marker.innerHTML = open ? '▾' : '▸';

          return marker;
        },
      }),
      codeFolding(),
      keymap.of(foldKeymap),
    );
  }

  if (enableMinimap) {
    extensions.push(
      showMinimap.of({
        create: () => {
          const dom = document.createElement('div');
          return { dom };
        },
      }),
    );
  }

  return extensions;
}
