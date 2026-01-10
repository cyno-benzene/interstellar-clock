import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

function app() {
  const container = document.getElementById('container');

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, -20, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Post-processing setup
  const renderScene = new RenderPass(scene, camera);
  
  // Reduced bloom for less "glow" overwhelming
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.4, 0.85);
  bloomPass.threshold = 0.1;
  bloomPass.strength = 0.5; 
  bloomPass.radius = 0.4;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
  composer.addPass(fxaaPass);

  // Clock Face elements
  const clockGroup = new THREE.Group();
  scene.add(clockGroup);

  // 60 Ticks
  for (let i = 0; i < 60; i++) {
    const isFive = i % 5 === 0;
    const length = isFive ? 0.6 : 0.3;
    const geometry = new THREE.PlaneGeometry(0.06, length);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const tick = new THREE.Mesh(geometry, material);
    
    const angle = (i / 60) * Math.PI * 2;
    const radius = 6;
    tick.position.x = Math.sin(angle) * radius;
    tick.position.y = Math.cos(angle) * radius;
    tick.rotation.z = -angle;
    clockGroup.add(tick);
  }

  // Hands
  const handMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  const hourHandGeom = new THREE.PlaneGeometry(0.2, 3.5);
  hourHandGeom.translate(0, 1.75, 0);
  const hourHand = new THREE.Mesh(hourHandGeom, handMaterial);
  clockGroup.add(hourHand);

  const minHandGeom = new THREE.PlaneGeometry(0.12, 5.5);
  minHandGeom.translate(0, 2.75, 0);
  const minuteHand = new THREE.Mesh(minHandGeom, handMaterial);
  clockGroup.add(minuteHand);

  const secHandGeom = new THREE.PlaneGeometry(0.06, 6);
  secHandGeom.translate(0, 3, 0);
  const secondHand = new THREE.Mesh(secHandGeom, handMaterial);
  clockGroup.add(secondHand);

  // Time-Trail Logic (Solid vertical strings)
  const MAX_LINES = 15000;
  const trailGeometry = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(MAX_LINES * 6); // 2 points per line
  const trailColors = new Float32Array(MAX_LINES * 6);
  
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
  
  const trailMaterial = new THREE.LineBasicMaterial({ 
    vertexColors: true, 
    transparent: true,
    opacity: 0.6, // Lowered opacity for reduced brightness
    blending: THREE.AdditiveBlending
  });
  
  const trailMesh = new THREE.LineSegments(trailGeometry, trailMaterial);
  scene.add(trailMesh);

  let trailLines = [];
  const velocity = 0.15; 
  const captureInterval = 32; // Less frequent capture for cleaner look
  let lastCapture = 0;

  const colorsList = [
    new THREE.Color(0x00ffff), 
    new THREE.Color(0xadd8e6), 
    new THREE.Color(0x008b8b)  
  ];

  function getHandPoints() {
    const points = [];
    const numSteps = 40; // Increased density along the hand
    const handLength = 6;
    for (let i = 0; i <= numSteps; i++) {
      const dist = (i / numSteps) * handLength;
      const vector = new THREE.Vector3(0, dist, 0);
      vector.applyQuaternion(secondHand.quaternion);
      points.push(vector);
    }
    return points;
  }

  function updateTrail(time) {
    if (time - lastCapture > captureInterval) {
      const handPoints = getHandPoints();
      handPoints.forEach((pos, index) => {
        // High spawn rate for dense curtain
        if (Math.random() < 0.6) {
          trailLines.push({
            x: pos.x + (Math.random() - 0.5) * 0.05, // Slight jitter for volume
            y: pos.y + (Math.random() - 0.5) * 0.05,
            baseX: pos.x,
            baseY: pos.y,
            z: 0,
            length: Math.random() * 40 + 20, 
            color: colorsList[Math.floor(Math.random() * colorsList.length)],
            speed: velocity * (0.8 + Math.random() * 0.4),
            phase: Math.random() * Math.PI * 2
          });
        }
      });
      lastCapture = time;
    }

    const newTrailLines = [];
    const positions = [];
    const colors = [];

    for (let i = 0; i < trailLines.length; i++) {
      const line = trailLines[i];
      line.z += line.speed;

      if (line.z < 100) {
        newTrailLines.push(line);
        
        // Ripple effect: offset X and Y based on Z and time
        const wave = Math.sin(line.z * 0.2 - time * 0.005 + line.phase) * 0.08;
        const ox = line.x + wave;
        const oy = line.y + wave;

        positions.push(ox, oy, line.z);
        positions.push(ox, oy, line.z + line.length);

        const fade = Math.max(0, 1 - (line.z / 100)) * 0.7; 
        colors.push(line.color.r * fade, line.color.g * fade, line.color.b * fade);
        colors.push(line.color.r * fade, line.color.g * fade, line.color.b * fade);
      }
    }
    trailLines = newTrailLines;

    const posAttr = trailGeometry.getAttribute('position');
    const colorAttr = trailGeometry.getAttribute('color');

    for (let i = 0; i < positions.length; i++) {
      trailPositions[i] = positions[i];
      trailColors[i] = colors[i];
    }
    
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    trailGeometry.setDrawRange(0, positions.length / 3);
  }

  function animate(time) {
    requestAnimationFrame(animate);

    const date = new Date();
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    
    const smoothSeconds = seconds + milliseconds / 1000;
    const smoothMinutes = minutes + smoothSeconds / 60;
    const smoothHours = hours + smoothMinutes / 60;

    secondHand.rotation.z = - (smoothSeconds / 60) * Math.PI * 2;
    minuteHand.rotation.z = - (smoothMinutes / 60) * Math.PI * 2;
    hourHand.rotation.z = - (smoothHours / 12) * Math.PI * 2;

    updateTrail(time);
    
    controls.update();
    composer.render();
  }

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
  });

  animate(0);
}

app();
