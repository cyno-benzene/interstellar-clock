(function() {
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
  clockScript.src = baseUrl + '/interstellar-clock.iife.js';
  
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
  clockScript.onerror = () => console.error('Failed to load Interstellar Clock');
  
  threeScript.onload = init;
  clockScript.onload = init;
  
  document.head.appendChild(threeScript);
  document.head.appendChild(clockScript);
})();
