import { defineConfig } from 'vite';

export default defineConfig({
  base:  '/interstellar-clock/',
  build: {
    lib: {
      entry: 'main.js',
      name: 'InterstellarClock',
      formats: ['iife', 'umd'],
      fileName: (format) => `interstellar-clock.${format === 'iife' ? 'iife' : 'umd'}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
});
