(function() {
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
  
  // Load the clock script
  const clockScript = document.createElement('script');
  clockScript.src = 'https://cyno-benzene.github.io/interstellar-clock/interstellar-clock.iife.js';
  
  // Initialize after both load
  let loaded = 0;
  const init = () => {
    loaded++;
    if (loaded === 2 && window.InterstellarClock) {
      window.InterstellarClock.initInterstellarClock('interstellar-clock-container');
    }
  };
  
  threeScript.onload = init;
  clockScript.onload = init;
  
  document.head.appendChild(threeScript);
  document.head.appendChild(clockScript);
})();
