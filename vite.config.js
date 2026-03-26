import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

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
  },
  plugins: [
    {
      name: 'generate-embed-script',
      apply: 'build',
      writeBundle() {
        const embedContent = `(function() {
  // Get the base URL of where this script is hosted
  const scriptUrl = new URL(document.currentScript.src);
  const baseUrl = scriptUrl.origin + scriptUrl.pathname.substring(0, scriptUrl.pathname.lastIndexOf('/'));
  
  // Create container
  const container = document.createElement('div');
  container.id = 'interstellar-clock-container';
  container.style.width = '100%';
  container.style.height = '600px';
  container.style.borderRadius = '8px';
  container.style.overflow = 'hidden';
  
  // Find where to insert (right after this script tag)
  const script = document.currentScript;
  script.parentNode.insertBefore(container, script.nextSibling);
  
  // Load the Three.js library
  const threeScript = document.createElement('script');
  threeScript.src = 'https://unpkg.com/three@v0.149.0/build/three.min.js';
  
  // Load the clock script from the same directory as this embed script
  const clockScript = document.createElement('script');
  clockScript.src = baseUrl + '/embedded.iife.js';
  
  // Initialize after both load
  let loaded = 0;
  const init = () => {
    loaded++;
    if (loaded === 2 && window.InterstellarClock) {
      window.InterstellarClock.initInterstellarClock('interstellar-clock-container');
    }
  };
  
  // Add error handlers
  threeScript.onerror = () => console.error('Failed to load Three.js');
  clockScript.onerror = () => console.error('Failed to load Interstellar Clock from: ' + clockScript.src);
  
  threeScript.onload = init;
  clockScript.onload = init;
  
  document.head.appendChild(threeScript);
  document.head.appendChild(clockScript);
})();`;

        const distPath = path.resolve('dist', 'embed.js');
        fs.writeFileSync(distPath, embedContent, 'utf-8');
        console.log('✓ Generated embed.js');
      }
    }
  ]
});