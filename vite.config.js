import { defineConfig } from 'vite';

export default defineConfig({
  base: '/interstellar-clock/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        embedded: 'lib-entry.js'
      },
      external: [],
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'embedded') {
            return '[name].iife.js';
          }
          return '[name]-[hash].js';
        },
        dir: 'dist'
      }
    }
  }
});