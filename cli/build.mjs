import { build } from 'esbuild';
import { chmodSync, readFileSync, rmSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const define = { __LONGREIN_VERSION__: JSON.stringify(packageJson.version) };

rmSync(new URL('./dist/', import.meta.url), { recursive: true, force: true });

await build({
  entryPoints: {
    index: 'cli/src/entry.ts',
    'extension-entry': 'cli/src/extension-entry.ts',
  },
  outdir: 'cli/dist',
  bundle: true,
  splitting: true,
  entryNames: '[name]',
  chunkNames: 'chunks/[name]-[hash]',
  packages: 'external',
  platform: 'node',
  format: 'esm',
  target: 'node18',
  jsx: 'automatic',
  define,
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'warning',
});

chmodSync('cli/dist/index.js', 0o755);
