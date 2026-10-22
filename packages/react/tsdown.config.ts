import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.tsx'],
  platform: 'neutral',
  external: ['react'],
  exports: true,
  publint: { level: 'suggestion' },
  attw: { profile: 'esm-only', level: 'error' },
});
