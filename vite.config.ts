/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: 'src/bootstrap.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['node:child_process', 'node:path', 'node:util'],
    },
  },
  test: {
    // ...
  },
});
