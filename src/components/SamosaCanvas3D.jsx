import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Maximize2, 
  RotateCw, 
  Layers, 
  Flame, 
  Compass, 
  Eye, 
  Sparkles,
  Volume2
} from 'lucide-react';

export default function SamosaCanvas3D({ activeVariant, onCrunchPlay }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const samosaGroupRef = useRef(null);
  const steamSystemRef = useRef(null);
  const coreFillingGroupRef = useRef(null);
  const wireframeMeshRef = useRef(null);
  const crustMeshRef = useRef(null);
  const flapMeshRef = useRef(null);
  const garnishGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Interaction State
  const [viewMode, setViewMode] = useState('standard'); // 'standard' | 'anatomy' | 'thermal' | 'cad'
  const [autoRotate, setAutoRotate] = useState(true);
  const [steamActive, setSteamActive] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.006);

  // Mouse drag rotation state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationMomentumRef = useRef({ x: 0, y: 0 });

  // Generate procedural fried pastry crust texture matching authentic golden-amber samosa
  const createPastryTexture = (baseHex, mode = 'standard') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (mode === 'thermal') {
      const gradient = ctx.createRadialGradient(512, 512, 50, 512, 512, 500);
      gradient.addColorStop(0, '#ffffff'); // 185°C center
      gradient.addColorStop(0.2, '#f59e0b'); // 160°C
      gradient.addColorStop(0.5, '#dc2626'); // 110°C
      gradient.addColorStop(0.8, '#4f46e5'); // 50°C
      gradient.addColorStop(1, '#0f172a'); // 24°C ambient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let r = 80; r < 500; r += 60) {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(canvas);
    }

    // Rich, warm, golden fried crust base
    const baseCol = new THREE.Color(baseHex || 0xdc8724);
    const darkerCol = baseCol.clone().multiplyScalar(0.72).getStyle();
    const midCol = baseCol.clone().getStyle();
    const highlightCol = baseCol.clone().multiplyScalar(1.22).getStyle();

    // Natural multi-stage gradient
    const gradient = ctx.createRadialGradient(480, 420, 80, 512, 512, 680);
    gradient.addColorStop(0, highlightCol);
    gradient.addColorStop(0.6, midCol);
    gradient.addColorStop(1, darkerCol);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm ghee oil glaze clouds
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const rad = 70 + Math.random() * 140;
      const radialGlaze = ctx.createRadialGradient(x, y, 0, x, y, rad);
      radialGlaze.addColorStop(0, 'rgba(255, 220, 150, 0.22)');
      radialGlaze.addColorStop(0.5, 'rgba(235, 145, 45, 0.08)');
      radialGlaze.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlaze;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Delicate fried blisters (soft rounded frying bubbles on crust)
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 3.0 + Math.random() * 7.0;

      const blisterGrad = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, radius * 0.1,
        x, y, radius
      );
      blisterGrad.addColorStop(0, 'rgba(255, 240, 205, 0.7)');
      blisterGrad.addColorStop(0.75, 'rgba(240, 175, 75, 0.35)');
      blisterGrad.addColorStop(1, 'rgba(120, 50, 12, 0.45)');

      ctx.fillStyle = blisterGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micro crisp frying bubbles (thousands of tiny blister specks)
    for (let i = 0; i < 2800; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 0.5 + Math.random() * 2.0;
      const isHighlight = Math.random() > 0.4;

      ctx.fillStyle = isHighlight 
        ? `rgba(255, 235, 190, ${0.12 + Math.random() * 0.25})` 
        : `rgba(90, 35, 10, ${0.08 + Math.random() * 0.18})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hand-scattered authentic Ajwain (carom) seed flecks
    ctx.fillStyle = '#261206';
    for (let i = 0; i < 320; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const length = 2.2 + Math.random() * 4.2;
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, length, length * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#220f04';
      ctx.fill();

      ctx.strokeStyle = '#4e250f';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(-length * 0.6, 0);
      ctx.lineTo(length * 0.6, 0);
      ctx.stroke();

      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Generate Bump Texture for tactile crunch relief
  const createBumpTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rad = 0.8 + Math.random() * 2.5;
      const isBump = Math.random() > 0.45;

      ctx.fillStyle = isBump ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elevated blister mounds
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rad = 2.5 + Math.random() * 5.0;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.8, 'rgba(200, 200, 200, 0.12)');
      grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // 1. Build the Puffed Samosa Body Mesh — Wide, Sturdy, Stuffed Belly
  const buildSamosaBodyGeometry = () => {
    const geom = new THREE.BufferGeometry();
    const vSlices = 48; // vertical slices
    const uSegments = 64; // perimeter points
    
    const positions = [];
    const uvs = [];
    const indices = [];

    // Key anatomical coordinates matching the authentic reference photo:
    // Wide base width (~2.85 units), height (~2.05 units), depth (~1.45 units)
    const leftX = -1.45, leftZ = 0.12;
    const rightX = 1.40, rightZ = 0.12;
    const backX = 0.0, backZ = -0.85;
    const apexX = -0.05, apexZ = 0.02;

    for (let i = 0; i <= vSlices; i++) {
      const v = i / vSlices; // 0 (bottom) to 1 (apex)
      const y = -0.85 + 2.05 * v;
      
      const taper = Math.pow(1.0 - v, 0.72);
      const bottomFactor = v < 0.10 ? Math.sin((v / 0.10) * Math.PI / 2) : 1.0;
      
      for (let j = 0; j <= uSegments; j++) {
        const u = j / uSegments;
        const angle = u * Math.PI * 2;
        
        let x, z;
        
        // Front face (between right corner and left corner)
        if (angle >= 0 && angle <= Math.PI) {
          const tFront = angle / Math.PI; // 0 at right, 1 at left
          const curLeftX = THREE.MathUtils.lerp(apexX, leftX, taper);
          const curRightX = THREE.MathUtils.lerp(apexX, rightX, taper);
          x = THREE.MathUtils.lerp(curRightX, curLeftX, tFront);
          
          const curZ = THREE.MathUtils.lerp(apexZ, rightZ, taper);
          
          // Authentic bulging belly packed with spiced potato filling
          const bellyBulge = 0.58 * Math.sin(tFront * Math.PI) * Math.sin(v * Math.PI * 0.85);
          
          // Soft organic frying blister mounds on the front belly
          const b1 = 0.06 * Math.exp(-(Math.pow(x - 0.25, 2) + Math.pow(y + 0.15, 2)) / 0.09);
          const b2 = 0.045 * Math.exp(-(Math.pow(x - 0.65, 2) + Math.pow(y - 0.20, 2)) / 0.07);
          const b3 = 0.04 * Math.exp(-(Math.pow(x + 0.40, 2) + Math.pow(y + 0.35, 2)) / 0.06);

          z = curZ + (bellyBulge + b1 + b2 + b3) * bottomFactor;
        } else {
          // Back faces (two sloping facets meeting at back ridge)
          const tBack = (angle - Math.PI) / Math.PI; // 0 at left, 1 at right
          const curLeftX = THREE.MathUtils.lerp(apexX, leftX, taper);
          const curRightX = THREE.MathUtils.lerp(apexX, rightX, taper);
          const curBackX = THREE.MathUtils.lerp(apexX, backX, taper);
          const curBackZ = THREE.MathUtils.lerp(apexZ, backZ, taper);
          const curFrontZ = THREE.MathUtils.lerp(apexZ, rightZ, taper);
          
          if (tBack < 0.5) {
            const f = tBack * 2;
            x = THREE.MathUtils.lerp(curLeftX, curBackX, f);
            z = THREE.MathUtils.lerp(curFrontZ, curBackZ, f);
          } else {
            const f = (tBack - 0.5) * 2;
            x = THREE.MathUtils.lerp(curBackX, curRightX, f);
            z = THREE.MathUtils.lerp(curBackZ, curFrontZ, f);
          }

          // Subtle convex rounding on back facets
          z -= 0.08 * Math.sin(tBack * Math.PI) * Math.sin(v * Math.PI) * bottomFactor;
        }
        
        // Gentle handcrafted micro-organic asymmetry
        const microNoise = 0.015 * Math.sin(x * 5 + y * 5) * Math.cos(z * 5);
        positions.push(x + microNoise, y, z + microNoise);
        uvs.push(u, v);
      }
    }
    
    for (let i = 0; i < vSlices; i++) {
      for (let j = 0; j < uSegments; j++) {
        const a = i * (uSegments + 1) + j;
        const b = (i + 1) * (uSegments + 1) + j;
        const c = (i + 1) * (uSegments + 1) + (j + 1);
        const d = i * (uSegments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  };

  // 2. Build the Signature Overlapping Front Fold Flap (The Iconic Patti Seam)
  const buildSamosaFlapGeometry = () => {
    const geom = new THREE.BufferGeometry();
    const vSteps = 36;
    const uSteps = 18;
    const positions = [];
    const uvs = [];
    const indices = [];

    // The signature flap visible in the reference photo:
    // Originates from apex, sweeps across front-left, with a raised overhanging lip!
    for (let i = 0; i <= vSteps; i++) {
      const v = i / vSteps;
      const y = -0.85 + 2.05 * v;
      const taper = Math.pow(1.0 - v, 0.72);

      // Left ridge point
      const leftX = THREE.MathUtils.lerp(-0.05, -1.45, taper);
      const leftZ = THREE.MathUtils.lerp(0.02, 0.12, taper);

      // Overlapping fold lip point (curves gracefully across the front belly)
      const curveOffset = Math.sin(v * Math.PI) * 0.48;
      const foldLipX = THREE.MathUtils.lerp(-0.05, -1.45, taper) + curveOffset;
      
      const tFront = Math.min(1.0, Math.max(0.0, (1.40 - foldLipX) / 2.85));
      const baseBellyZ = THREE.MathUtils.lerp(0.02, 0.12, taper) + 0.58 * Math.sin(tFront * Math.PI) * Math.sin(v * Math.PI * 0.85);
      
      // Raised physically above belly (+0.05 units) to cast an authentic real 3D shadow!
      const foldLipZ = baseBellyZ + 0.052;

      for (let j = 0; j <= uSteps; j++) {
        const u = j / uSteps;
        const x = THREE.MathUtils.lerp(leftX, foldLipX, u);
        const z = THREE.MathUtils.lerp(leftZ, foldLipZ, u);

        // Subtle dough thickness and slight upward curvature along lip
        const doughPuff = 0.025 * Math.sin(u * Math.PI);
        const lipCurvature = Math.pow(u, 2.5) * 0.015;

        positions.push(x, y, z + doughPuff + lipCurvature);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < vSteps; i++) {
      for (let j = 0; j < uSteps; j++) {
        const a = i * (uSteps + 1) + j;
        const b = (i + 1) * (uSteps + 1) + j;
        const c = (i + 1) * (uSteps + 1) + (j + 1);
        const d = i * (uSteps + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  };

  // 3. Build Cilantro / Coriander Leaf Garnish Group (as shown in reference photo)
  const buildCilantroGarnish = () => {
    const group = new THREE.Group();

    const createLeafGeom = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.03, 0.03, 0.06, 0.05, 0.05, 0.09);
      shape.bezierCurveTo(0.03, 0.11, 0.01, 0.10, 0.0, 0.13);
      shape.bezierCurveTo(-0.01, 0.10, -0.03, 0.11, -0.05, 0.09);
      shape.bezierCurveTo(-0.06, 0.05, -0.03, 0.03, 0, 0);
      return new THREE.ShapeGeometry(shape);
    };

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, // Fresh coriander green
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const leafPlacements = [
      // Leaf 1: Lower left fold
      { pos: [-1.02, -0.42, 0.33], rot: [0.3, -0.4, 0.5], scale: 1.1 },
      // Leaf 2: Flap rim middle
      { pos: [-0.52, 0.38, 0.54], rot: [0.1, -0.2, -0.4], scale: 1.25 },
      // Leaf 3: Upper belly right
      { pos: [0.08, 0.72, 0.38], rot: [0.2, 0.3, 0.2], scale: 0.95 }
    ];

    leafPlacements.forEach(({ pos, rot, scale }) => {
      const mesh = new THREE.Mesh(createLeafGeom(), leafMat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.scale.set(scale, scale, scale);
      mesh.castShadow = true;
      group.add(mesh);
    });

    return group;
  };

  // 4. Build Interior Spiced Core Filling
  const buildCoreFilling = () => {
    const group = new THREE.Group();

    // Spiced Potato Mass (Chunky, stuffed volume)
    const potatoGeom = new THREE.DodecahedronGeometry(1.05, 2);
    const pos = potatoGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const deform = 1 + (Math.sin(vx * 4.5) * Math.cos(vy * 4.5) * Math.sin(vz * 4.5)) * 0.15;
      pos.setXYZ(i, vx * deform * 1.3, vy * deform * 1.0, vz * deform * 0.9);
    }
    potatoGeom.computeVertexNormals();

    const potatoMat = new THREE.MeshStandardMaterial({
      color: 0xd99516,
      roughness: 0.85,
      metalness: 0.05,
    });
    const potatoMesh = new THREE.Mesh(potatoGeom, potatoMat);
    potatoMesh.position.set(0, -0.12, 0.05);
    group.add(potatoMesh);

    // English Garden Peas (Vibrant green glossy spheres)
    const peaGeom = new THREE.SphereGeometry(0.13, 16, 16);
    const peaMat = new THREE.MeshStandardMaterial({
      color: 0x38a13a,
      roughness: 0.28,
      metalness: 0.1,
    });

    const peaOffsets = [
      [0.55, 0.12, 0.35],
      [-0.45, -0.22, 0.45],
      [0.15, 0.55, -0.15],
      [-0.35, 0.35, -0.2],
      [0.35, -0.35, -0.25],
      [-0.1, -0.1, 0.55],
      [0.6, -0.18, -0.2],
      [-0.55, 0.12, 0.25],
      [0.25, 0.45, 0.35],
      [-0.2, 0.2, 0.52]
    ];

    peaOffsets.forEach(([x, y, z]) => {
      const pea = new THREE.Mesh(peaGeom, peaMat);
      pea.position.set(x, y, z);
      pea.scale.set(1 + Math.random() * 0.25, 1 + Math.random() * 0.25, 1 + Math.random() * 0.25);
      group.add(pea);
    });

    // Toasted Cumin & Coriander seeds
    const seedGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.09, 6);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.55,
    });

    for (let i = 0; i < 35; i++) {
      const seed = new THREE.Mesh(seedGeom, seedMat);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 0.85 + Math.random() * 0.25;

      seed.position.set(
        radius * Math.sin(theta) * Math.cos(phi) * 1.2,
        radius * Math.cos(theta) * 0.9 - 0.12,
        radius * Math.sin(theta) * Math.sin(phi) * 0.85 + 0.05
      );
      seed.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(seed);
    }

    return group;
  };

  // 5. Build Convection Steam Particle System
  const buildSteamSystem = () => {
    const particleCount = 50;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const lifetimes = [];

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const radGrad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    radGrad.addColorStop(0.4, 'rgba(240, 240, 245, 0.18)');
    radGrad.addColorStop(1, 'rgba(240, 240, 255, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = -0.05 + (Math.random() - 0.5) * 0.35;
      positions[i * 3 + 1] = 1.05 + Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.005,
        vy: 0.008 + Math.random() * 0.012,
        vz: (Math.random() - 0.5) * 0.005,
        wobbleSpeed: 1 + Math.random() * 2,
        wobbleOffset: Math.random() * Math.PI * 2,
      });

      lifetimes.push(Math.random());
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.7,
      map: texture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geom, material);
    points.userData = { velocities, lifetimes, particleCount };
    return points;
  };

  // Setup Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with precise framing
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.8);
    camera.lookAt(0, 0.05, 0);
    cameraRef.current = camera;

    // 3. Renderer with high DPR and ACES tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting: Culinary Studio 3-Point Setup with real shadows
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    scene.add(ambientLight);

    // Warm Key Light (Highlighting crisp golden surface and flap shadow)
    const keyLight = new THREE.DirectionalLight(0xffeed6, 2.7);
    keyLight.position.set(4.0, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    scene.add(keyLight);

    // Cool Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-4.5, 3.0, -3.5);
    scene.add(rimLight);

    // Under-bounce warm ghee reflector
    const bounceLight = new THREE.PointLight(0xd97706, 1.6, 8);
    bounceLight.position.set(0, -2.0, 2.0);
    scene.add(bounceLight);

    // 5. Build Samosa Object Group
    const samosaGroup = new THREE.Group();
    samosaGroupRef.current = samosaGroup;
    scene.add(samosaGroup);

    // Base Samosa Mesh
    const bodyGeom = buildSamosaBodyGeometry();
    const bumpMap = createBumpTexture();
    const crustTexture = createPastryTexture(activeVariant.crustColor, viewMode);

    const crustMaterial = new THREE.MeshStandardMaterial({
      map: crustTexture,
      bumpMap: bumpMap,
      bumpScale: 0.035,
      roughness: 0.40,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const crustMesh = new THREE.Mesh(bodyGeom, crustMaterial);
    crustMesh.castShadow = true;
    crustMesh.receiveShadow = true;
    crustMeshRef.current = crustMesh;
    samosaGroup.add(crustMesh);

    // Overlapping Fold Flap Mesh (Casting authentic shadow on body)
    const flapGeom = buildSamosaFlapGeometry();
    const flapMesh = new THREE.Mesh(flapGeom, crustMaterial);
    flapMesh.castShadow = true;
    flapMesh.receiveShadow = true;
    flapMeshRef.current = flapMesh;
    samosaGroup.add(flapMesh);

    // Fresh Cilantro Garnish
    const garnishGroup = buildCilantroGarnish();
    garnishGroupRef.current = garnishGroup;
    samosaGroup.add(garnishGroup);

    // Wireframe Mesh for CAD inspection mode
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(bodyGeom, wireframeMat);
    wireframeMesh.visible = false;
    wireframeMeshRef.current = wireframeMesh;
    samosaGroup.add(wireframeMesh);

    // Core Filling (potatoes, peas, seeds)
    const coreFillingGroup = buildCoreFilling();
    coreFillingGroup.visible = false;
    coreFillingGroupRef.current = coreFillingGroup;
    samosaGroup.add(coreFillingGroup);

    // Steam System
    const steamSystem = buildSteamSystem();
    steamSystemRef.current = steamSystem;
    scene.add(steamSystem);

    // 6. Interactive Drag Handlers
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      isDraggingRef.current = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      samosaGroup.rotation.y += deltaX * 0.008;
      samosaGroup.rotation.x += deltaY * 0.008;

      samosaGroup.rotation.x = Math.max(-0.55, Math.min(0.55, samosaGroup.rotation.x));

      rotationMomentumRef.current = {
        x: deltaY * 0.002,
        y: deltaX * 0.002
      };

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile / tablets
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      samosaGroup.rotation.y += deltaX * 0.008;
      samosaGroup.rotation.x += deltaY * 0.008;
      samosaGroup.rotation.x = Math.max(-0.55, Math.min(0.55, samosaGroup.rotation.x));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDraggingRef.current) {
        samosaGroup.rotation.y += rotationSpeed;
        samosaGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      }

      if (steamSystem && steamSystem.visible) {
        const positions = steamSystem.geometry.attributes.position.array;
        const { velocities, lifetimes, particleCount } = steamSystem.userData;

        for (let i = 0; i < particleCount; i++) {
          const vel = velocities[i];
          lifetimes[i] += 0.008;

          positions[i * 3 + 1] += vel.vy;
          positions[i * 3 + 0] += Math.sin(elapsedTime * vel.wobbleSpeed + vel.wobbleOffset) * 0.003 + vel.vx;
          positions[i * 3 + 2] += Math.cos(elapsedTime * vel.wobbleSpeed + vel.wobbleOffset) * 0.003 + vel.vz;

          if (positions[i * 3 + 1] > 3.2 || lifetimes[i] > 1.0) {
            positions[i * 3 + 0] = -0.05 + (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 1] = 1.05 + Math.random() * 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
            lifetimes[i] = 0;
          }
        }
        steamSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (renderer) {
        renderer.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  // Update Material & Mode upon viewMode or activeVariant changes
  useEffect(() => {
    if (!crustMeshRef.current || !samosaGroupRef.current) return;

    const crustMesh = crustMeshRef.current;
    const flapMesh = flapMeshRef.current;
    const garnish = garnishGroupRef.current;
    const wireframeMesh = wireframeMeshRef.current;
    const coreGroup = coreFillingGroupRef.current;
    const steam = steamSystemRef.current;

    if (steam) {
      steam.visible = steamActive && viewMode !== 'cad';
    }

    if (viewMode === 'standard') {
      crustMesh.visible = true;
      crustMesh.material.wireframe = false;
      crustMesh.material.map = createPastryTexture(activeVariant.crustColor, 'standard');
      crustMesh.material.needsUpdate = true;
      crustMesh.material.opacity = 1.0;
      crustMesh.material.transparent = false;

      if (flapMesh) flapMesh.visible = true;
      if (garnish) garnish.visible = true;
      if (wireframeMesh) wireframeMesh.visible = false;
      if (coreGroup) coreGroup.visible = false;
    } 
    else if (viewMode === 'anatomy') {
      // Cutaway / exploded cross-section mode revealing fat filled core
      crustMesh.visible = true;
      crustMesh.material.wireframe = false;
      crustMesh.material.map = createPastryTexture(activeVariant.crustColor, 'standard');
      crustMesh.material.transparent = true;
      crustMesh.material.opacity = 0.28;
      crustMesh.material.needsUpdate = true;

      if (flapMesh) flapMesh.visible = false;
      if (garnish) garnish.visible = false;
      if (wireframeMesh) wireframeMesh.visible = true;
      if (coreGroup) coreGroup.visible = true;
    } 
    else if (viewMode === 'thermal') {
      crustMesh.visible = true;
      crustMesh.material.wireframe = false;
      crustMesh.material.map = createPastryTexture(activeVariant.crustColor, 'thermal');
      crustMesh.material.opacity = 1.0;
      crustMesh.material.transparent = false;
      crustMesh.material.needsUpdate = true;

      if (flapMesh) flapMesh.visible = true;
      if (garnish) garnish.visible = false;
      if (wireframeMesh) wireframeMesh.visible = false;
      if (coreGroup) coreGroup.visible = false;
    } 
    else if (viewMode === 'cad') {
      crustMesh.visible = false;
      if (flapMesh) flapMesh.visible = false;
      if (garnish) garnish.visible = false;
      if (wireframeMesh) {
        wireframeMesh.visible = true;
        wireframeMesh.material.color = new THREE.Color(activeVariant.accentHex || 0x38bdf8);
      }
      if (coreGroup) coreGroup.visible = false;
    }
  }, [viewMode, activeVariant, steamActive]);

  const handleResetCamera = () => {
    if (samosaGroupRef.current) {
      samosaGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.25, 4.8);
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px] rounded-2xl bg-gradient-to-b from-[#0f1115] via-[#090a0d] to-[#060708] border border-white/10 shadow-glow-ambient overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating HUD — Top Left: Telemetry Data */}
      <div className="absolute top-5 left-5 pointer-events-none space-y-2 z-10">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>AUTHENTIC SAMOSA SCULPT // 60 FPS</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-400 space-y-1 hidden sm:block">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">PASTRY TENSION:</span>
            <span className="text-amber-400">{activeVariant.crustThickness}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">LAMINATION:</span>
            <span className="text-amber-400">{activeVariant.layers} FOLDS</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">SERVE CORE:</span>
            <span className="text-emerald-400">{activeVariant.coreTemp}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">ACOUSTIC CRUNCH:</span>
            <span className="text-amber-400">{activeVariant.acousticCrunch}</span>
          </div>
        </div>
      </div>

      {/* Floating HUD — Top Right: Viewport Mode Switcher */}
      <div className="absolute top-5 right-5 z-10 flex flex-wrap gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => setViewMode('standard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'standard' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Atelier Crust</span>
        </button>

        <button
          onClick={() => setViewMode('anatomy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'anatomy' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Core Anatomy</span>
        </button>

        <button
          onClick={() => setViewMode('thermal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'thermal' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Thermal 180°C</span>
        </button>

        <button
          onClick={() => setViewMode('cad')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            viewMode === 'cad' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>CAD Wireframe</span>
        </button>
      </div>

      {/* Floating HUD — Bottom Controls Bar */}
      <div className="absolute bottom-5 inset-x-5 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs text-zinc-300">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg transition-colors ${autoRotate ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Toggle Auto Orbit"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={() => setSteamActive(!steamActive)}
            className={`p-1.5 rounded-lg transition-colors ${steamActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Toggle Thermal Steam"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Reset Perspective"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          {onCrunchPlay && (
            <button
              onClick={onCrunchPlay}
              className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
              title="Acoustic Shatter Audio Synthesizer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Acoustic Shatter</span>
            </button>
          )}
        </div>

        <div className="text-[11px] font-mono text-zinc-500 hidden sm:block bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
          <span>DRAG TO ORBIT // SCROLL PERSPECTIVE</span>
        </div>
      </div>
    </div>
  );
}
