import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './apps/bolt-diy/vite.config.ts',
  './apps/bolt-diy/vite-electron.config.ts',
  './apps/bolt-diy/electron/preload/vite.config.ts',
  './apps/bolt-diy/electron/main/vite.config.ts',
]);
