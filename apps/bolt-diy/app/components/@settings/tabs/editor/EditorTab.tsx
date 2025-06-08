import { motion } from 'framer-motion';
import { useSettings } from '~/lib/hooks/useSettings';
import { Switch } from '~/components/ui/Switch';
import { Slider } from '~/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/Card';

export default function EditorTab() {
  const { settings, updateEditorSettings } = useSettings();
  const { editor } = settings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Editor Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="minimap-switch" className="flex flex-col space-y-1">
              <span>Show Minimap</span>
              <span className="text-sm text-gray-500">Display a minimap for quick navigation.</span>
            </label>
            <Switch
              id="minimap-switch"
              checked={editor.minimap}
              onCheckedChange={(checked) => updateEditorSettings({ minimap: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="code-folding-switch" className="flex flex-col space-y-1">
              <span>Enable Code Folding</span>
              <span className="text-sm text-gray-500">Allow collapsing of code blocks.</span>
            </label>
            <Switch
              id="code-folding-switch"
              checked={editor.codeFolding}
              onCheckedChange={(checked) => updateEditorSettings({ codeFolding: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="format-on-save-switch" className="flex flex-col space-y-1">
              <span>Format on Save</span>
              <span className="text-sm text-gray-500">Automatically format code on save.</span>
            </label>
            <Switch
              id="format-on-save-switch"
              checked={editor.formatOnSave}
              onCheckedChange={(checked) => updateEditorSettings({ formatOnSave: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formatting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="font-size-slider" className="text-sm font-medium">
              Font Size: {editor.fontSize}px
            </label>
            <Slider
              id="font-size-slider"
              min={10}
              max={20}
              step={1}
              value={[editor.fontSize]}
              onValueChange={([value]: [number]) => updateEditorSettings({ fontSize: value })}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="tab-size-slider" className="text-sm font-medium">
              Tab Size: {editor.tabSize} spaces
            </label>
            <Slider
              id="tab-size-slider"
              min={2}
              max={8}
              step={2}
              value={[editor.tabSize]}
              onValueChange={([value]: [number]) => updateEditorSettings({ tabSize: value })}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
