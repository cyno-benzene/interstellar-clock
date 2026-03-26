An Interstellar-inspired temporal visualization built with Three.js. It transforms the motion of a second hand into a 3D vertical "curtain" of light, representing the history of time through spatial extrusion.


## Tech Stack
- Three.js
- WebGL
- OrbitControls for camera manipulation

## Setup
1. Clone the repository.
2. Serve the directory using a local web server (e.g., `python -m http.server 8000`).
3. Open `index.html` in a modern browser.


## Usage Examples

**In a README.md:**
```html
<div id="interstellar-clock-container" style="width: 100%; height: 600px;"></div>
<script src="https://unpkg.com/three@v0.149.0/build/three.min.js"></script>
<script src="https://cyno-benzene.github.io/interstellar-clock/interstellar-clock.iife.js"></script>
<script>
  window.InterstellarClock.initInterstellarClock('interstellar-clock-container');
</script>
```

**Single embed script (simplest):**
```html
<script src="https://cyno-benzene.github.io/interstellar-clock/embed.js"></script>
```

**Using jsDelivr (alternative to GitHub Pages):**
```html
<script src="https://cdn.jsdelivr.net/gh/cyno-benzene/interstellar-clock@main/dist/interstellar-clock.iife.js"></script>
```

