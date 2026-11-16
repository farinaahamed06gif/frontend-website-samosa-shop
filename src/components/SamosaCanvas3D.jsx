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

  // Generate procedural fried pastry crust texture
  const createPastryTexture = (baseHex, mode = 'standard') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (mode === 'thermal') {
      // Thermodynamic false-color spectrum
      const gradient = ctx.createRadialGradient(512, 512, 50, 512, 512, 500);
      gradient.addColorStop(0, '#ffffff'); // 185°C center
      gradient.addColorStop(0.2, '#f59e0b'); // 160°C
      gradient.addColorStop(0.5, '#dc2626'); // 110°C
      gradient.addColorStop(0.8, '#4f46e5'); // 50°C
      gradient.addColorStop(1, '#0f172a'); // 24°C ambient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);

      // Thermal contour lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let r = 80; r < 500; r += 60) {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(canvas);
    }

    // Base color gradient for flaky golden crust
    const baseCol = new THREE.Color(baseHex);
    const darkerCol = baseCol.clone().multiplyScalar(0.7).getStyle();
    const lighterCol = baseCol.clone().multiplyScalar(1.25).getStyle();

    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, lighterCol);
    gradient.addColorStop(0.5, baseCol.getStyle());
    gradient.addColorStop(1, darkerCol);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Micro blisters and fried bubbles
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 0.5 + Math.random() * 3.5;
      const alpha = 0.08 + Math.random() * 0.25;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 
        ? `rgba(255, 230, 180, ${alpha})` 
        : `rgba(90, 35, 10, ${alpha * 0.8})`;
      ctx.fill();
    }

    // Hand-scattered Ajwain & Nigella seed flecks
    ctx.fillStyle = 'rgba(40, 20, 10, 0.85)';
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const length = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, length, length * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Subtle pastry lamination striations
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const y = Math.random() * 1024;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        340, y + (Math.random() - 0.5) * 80,
        680, y + (Math.random() - 0.5) * 80,
        1024, y
      );
      ctx.stroke();
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
      const rad = Math.random() * 2.5;
      const isBump = Math.random() > 0.5;

      ctx.fillStyle = isBump ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Build the parametric Samosa Geometry (Tetrahedral Puffed Geometry)
  const buildSamosaGeometry = () => {
    // A tetrahedral pyramid with 3 bowed side faces and 1 bowed base
    const geom = new THREE.BufferGeometry();
    const resolution = 28; // Grid density per face

    const positions = [];
    const normals = [];
    const uvs = [];

    // Key vertices of the equilateral base and apex
    const h = 2.2;
    const r = 1.65;
    const apex = new THREE.Vector3(0, h * 0.55, 0);

    const b0 = new THREE.Vector3(
      r * Math.cos(0),
      -h * 0.45,
      r * Math.sin(0)
    );
    const b1 = new THREE.Vector3(
      r * Math.cos((2 * Math.PI) / 3),
      -h * 0.45,
      r * Math.sin((2 * Math.PI) / 3)
    );
    const b2 = new THREE.Vector3(
      r * Math.cos((4 * Math.PI) / 3),
      -h * 0.45,
      r * Math.sin((4 * Math.PI) / 3)
    );

    // Helper to generate a puffed triangular face
    const generateFace = (p0, p1, p2, isBase = false) => {
      const faceCenter = new THREE.Vector3()
        .add(p0)
        .add(p1)
        .add(p2)
        .divideScalar(3);

      const faceNormal = new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3().subVectors(p1, p0),
          new THREE.Vector3().subVectors(p2, p0)
        )
        .normalize();

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution - i; j++) {
          const u1 = i / resolution;
          const v1 = j / resolution;

          const u2 = (i + 1) / resolution;
          const v2 = j / resolution;

          const u3 = i / resolution;
          const v3 = (j + 1) / resolution;

          const calcPoint = (u, v) => {
            const w = 1 - u - v;
            const pt = new THREE.Vector3()
              .addScaledVector(p0, w)
              .addScaledVector(p1, u)
              .addScaledVector(p2, v);

            // Add convex puffiness
            const puffWeight = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * Math.sin(w * Math.PI);
            const puffMagnitude = isBase ? 0.35 : 0.65;
            pt.addScaledVector(faceNormal, puffWeight * puffMagnitude);

            // Subtle handcrafted asymmetry
            const noise = (Math.sin(pt.x * 4.0) * Math.cos(pt.y * 4.0)) * 0.035;
            pt.addScaledVector(faceNormal, noise);

            // Crimp effect along the bottom edges
            if (!isBase && pt.y < -h * 0.35) {
              const crimp = Math.sin(pt.x * 24.0 + pt.z * 24.0) * 0.04;
              pt.addScaledVector(faceNormal, crimp);
            }

            return pt;
          };

          const pt1 = calcPoint(u1, v1);
          const pt2 = calcPoint(u2, v2);
          const pt3 = calcPoint(u3, v3);

          // Triangle 1
          positions.push(pt1.x, pt1.y, pt1.z);
          positions.push(pt2.x, pt2.y, pt2.z);
          positions.push(pt3.x, pt3.y, pt3.z);

          uvs.push(u1, v1);
          uvs.push(u2, v2);
          uvs.push(u3, v3);

          // Second triangle for the quad cell if valid
          if (i + j + 1 < resolution) {
            const u4 = (i + 1) / resolution;
            const v4 = (j + 1) / resolution;
            const pt4 = calcPoint(u4, v4);

            positions.push(pt2.x, pt2.y, pt2.z);
            positions.push(pt4.x, pt4.y, pt4.z);
            positions.push(pt3.x, pt3.y, pt3.z);

            uvs.push(u2, v2);
            uvs.push(u4, v4);
            uvs.push(u3, v3);
          }
        }
      }
    };

    // 3 Upright faces
    generateFace(b0, b1, apex);
    generateFace(b1, b2, apex);
    generateFace(b2, b0, apex);

    // 1 Bottom face
    generateFace(b0, b2, b1, true);

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.computeVertexNormals();

    return geom;
  };

  // Build interior spiced core filling
  const buildCoreFilling = () => {
    const group = new THREE.Group();

    // Spiced Potato Mass (Central irregular volume)
    const potatoGeom = new THREE.DodecahedronGeometry(0.85, 2);
    const pos = potatoGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const deform = 1 + (Math.sin(vx * 5) * Math.cos(vy * 5) * Math.sin(vz * 5)) * 0.15;
      pos.setXYZ(i, vx * deform, vy * deform * 1.1, vz * deform);
    }
    potatoGeom.computeVertexNormals();

    const potatoMat = new THREE.MeshStandardMaterial({
      color: 0xd4a017, // Turmeric potato gold
      roughness: 0.9,
      metalness: 0.05,
    });
    const potatoMesh = new THREE.Mesh(potatoGeom, potatoMat);
    potatoMesh.position.y = -0.15;
    group.add(potatoMesh);

    // English Garden Peas (Vibrant green glossy spheres)
    const peaGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const peaMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.3,
      metalness: 0.1,
    });

    const peaOffsets = [
      [0.45, 0.1, 0.3],
      [-0.4, -0.2, 0.4],
      [0.1, 0.45, -0.3],
      [-0.35, 0.3, -0.2],
      [0.3, -0.4, -0.25],
      [-0.1, -0.1, 0.55],
      [0.5, -0.15, -0.2],
      [-0.45, 0.1, 0.2]
    ];

    peaOffsets.forEach(([x, y, z]) => {
      const pea = new THREE.Mesh(peaGeom, peaMat);
      pea.position.set(x, y, z);
      pea.scale.set(1 + Math.random() * 0.3, 1 + Math.random() * 0.3, 1 + Math.random() * 0.3);
      group.add(pea);
    });

    // Toasted Cumin & Coriander seeds
    const seedGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 6);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.6,
    });

    for (let i = 0; i < 28; i++) {
      const seed = new THREE.Mesh(seedGeom, seedMat);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 0.72 + Math.random() * 0.18;

      seed.position.set(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.cos(theta) * 0.9 - 0.1,
        radius * Math.sin(theta) * Math.sin(phi)
      );
      seed.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(seed);
    }

    return group;
  };

  // Build rising convection steam particle system
  const buildSteamSystem = () => {
    const particleCount = 50;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const lifetimes = [];

    // Steam billboard canvas texture
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
      // Spawn near apex or base vent
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 1.0 + Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

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
      size: 0.65,
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

    // 2. Camera with precise field of view
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.2);
    cameraRef.current = camera;

    // 3. Renderer with high DPR and tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting: Culinary Studio 3-Point Setup
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.7);
    scene.add(ambientLight);

    // Warm Key Light (Highlighting crisp golden surface)
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cool Rim Light (defining sharp pastry edges)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Under-bounce warm reflector
    const bounceLight = new THREE.PointLight(0xd97706, 1.5, 8);
    bounceLight.position.set(0, -2, 2);
    scene.add(bounceLight);

    // 5. Build Samosa Object Group
    const samosaGroup = new THREE.Group();
    samosaGroupRef.current = samosaGroup;
    scene.add(samosaGroup);

    // Base Samosa Mesh
    const samosaGeom = buildSamosaGeometry();
    const bumpMap = createBumpTexture();
    const crustTexture = createPastryTexture(activeVariant.crustColor, viewMode);

    const crustMaterial = new THREE.MeshStandardMaterial({
      map: crustTexture,
      bumpMap: bumpMap,
      bumpScale: 0.045,
      roughness: 0.48,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const crustMesh = new THREE.Mesh(samosaGeom, crustMaterial);
    crustMesh.castShadow = true;
    crustMesh.receiveShadow = true;
    crustMeshRef.current = crustMesh;
    samosaGroup.add(crustMesh);

    // Wireframe Mesh for CAD inspection mode
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(samosaGeom, wireframeMat);
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

      // Constrain vertical rotation to prevent flipping upside down
      samosaGroup.rotation.x = Math.max(-0.6, Math.min(0.6, samosaGroup.rotation.x));

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
      samosaGroup.rotation.x = Math.max(-0.6, Math.min(0.6, samosaGroup.rotation.x));
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

      // Auto-rotation when not dragging
      if (autoRotate && !isDraggingRef.current) {
        samosaGroup.rotation.y += rotationSpeed;
        // Subtle floating breath motion
        samosaGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      // Steam Particle Physics
      if (steamSystem && steamSystem.visible) {
        const positions = steamSystem.geometry.attributes.position.array;
        const { velocities, lifetimes, particleCount } = steamSystem.userData;

        for (let i = 0; i < particleCount; i++) {
          const vel = velocities[i];
          lifetimes[i] += 0.008;

          // Drift upwards with gentle swirl
          positions[i * 3 + 1] += vel.vy;
          positions[i * 3 + 0] += Math.sin(elapsedTime * vel.wobbleSpeed + vel.wobbleOffset) * 0.003 + vel.vx;
          positions[i * 3 + 2] += Math.cos(elapsedTime * vel.wobbleSpeed + vel.wobbleOffset) * 0.003 + vel.vz;

          // Recycle particle when it climbs above 3.5m
          if (positions[i * 3 + 1] > 3.2 || lifetimes[i] > 1.0) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 0.35;
            positions[i * 3 + 1] = 0.9 + Math.random() * 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
            lifetimes[i] = 0;
          }
        }
        steamSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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

      if (wireframeMesh) wireframeMesh.visible = false;
      if (coreGroup) coreGroup.visible = false;
    } 
    else if (viewMode === 'anatomy') {
      // Cutaway / exploded cross-section mode
      crustMesh.visible = true;
      crustMesh.material.wireframe = false;
      crustMesh.material.map = createPastryTexture(activeVariant.crustColor, 'standard');
      crustMesh.material.transparent = true;
      crustMesh.material.opacity = 0.28;
      crustMesh.material.needsUpdate = true;

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

      if (wireframeMesh) wireframeMesh.visible = false;
      if (coreGroup) coreGroup.visible = false;
    } 
    else if (viewMode === 'cad') {
      crustMesh.visible = false;
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
      cameraRef.current.position.set(0, 0.8, 5.2);
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
          <span>REAL-TIME 3D VIEWPORT // 60 FPS</span>
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

