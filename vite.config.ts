/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'gitlab-mr-labeler',
    },
    rollupOptions: {
      external: ['node:child_process', 'node:path', 'node:util'],
    },
  },
  test: {
    // ...
  },
});
