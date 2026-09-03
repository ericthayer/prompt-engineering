import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DigitalAssetsSectionProps {
  title?: string;
  subtitle?: string;
}

export const DigitalAssetsSection: React.FC<DigitalAssetsSectionProps> = ({
  title = "Compound Digital Assets",
  subtitle = "Build, version, and share components to create scalable applications faster than ever"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6d28d9, 10); // Massive increase
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xdb2777, 10); // Massive increase
    pinkLight.position.set(-5, -5, 5);
    scene.add(pinkLight);

    const whiteLight = new THREE.PointLight(0xffffff, 2);
    whiteLight.position.set(0, 0, 10);
    scene.add(whiteLight);

    // 3. Holographic Assets (Icosahedrons with Wireframes)
    const geometry = new THREE.IcosahedronGeometry(1.2, 0); // Geometric faceted look
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x6d28d9,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const assetGroups: THREE.Group[] = [];
    const assetData = [
      { pos: [3.5, 3, -2], rot: [0.2, 0.4, 0.2], color: 0x6d28d9 },
      { pos: [-4.5, 4, -4], rot: [-0.1, 0.2, 0.1], color: 0xdb2777 },
      { pos: [-5.5, -3, 1], rot: [0.15, -0.15, 0.2], color: 0x6d28d9 },
      { pos: [6, -4.5, -2], rot: [0.2, 0.1, -0.2], color: 0xdb2777 },
    ];

    assetData.forEach(data => {
      const group = new THREE.Group();

      const mesh = new THREE.Mesh(geometry, meshMaterial.clone());
      const wire = new THREE.Mesh(geometry, wireMaterial.clone());
      wire.scale.setScalar(1.05); // Slightly larger for "hologram" shell effect
      (wire.material as THREE.MeshBasicMaterial).color.set(data.color);

      group.add(mesh);
      group.add(wire);
      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      scene.add(group);
      assetGroups.push(group);
    });

    // 4. Background Particle System (Digital Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 5. Animation Loop
    const animate = () => {
      const time = performance.now() * 0.0015;

      assetGroups.forEach((group, i) => {
        group.rotation.x += 0.008;
        group.rotation.y += 0.012;
        group.position.y += Math.sin(time + i) * 0.005;
        group.position.x += Math.cos(time * 0.5 + i) * 0.002;
      });

      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 5. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Cleanup (As per three-js-react.md rules)
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      geometry.dispose();
      meshMaterial.dispose();
      wireMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#050505] text-white flex items-center overflow-hidden pt-24 pb-12 lg:py-20 px-6 lg:px-24"
      aria-label="Digital Assets Section"
    >
      {/* Three.js Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? "block" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 opacity-90">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-4 bg-[#6D28D9] rounded-xl font-semibold hover:bg-[#5b21b6] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/20">
              Quick start
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-slate-800 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all hover:border-[#6D28D9]">
              <span className="text-cyan-400">✧</span> Build with Hope AI
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            *It's open source and free!
          </p>
        </div>

        {/* Right Content - Visual Composition Mockup */}
        <div className="relative flex justify-center items-center h-[600px] lg:h-auto">
          {/* Main composition card (Mobile frame style) */}
          <div className="relative z-20 w-72 h-[500px] bg-[#0c0c14] border-4 border-[#1e1e2d] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-black opacity-50" />
            <div className="relative p-6 h-full flex flex-col justify-end gap-2">
              <div className="w-full h-[300px] bg-gray-900 rounded-2xl mb-4 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center shadow-inner" />
              <h3 className="text-xl font-bold">Only (what I need)</h3>
              <p className="text-xs text-gray-400">Composables</p>
              <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full w-2/3 bg-purple-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Floating UI Elements & Connectors (Matching image composition) */}
          <div className="absolute left-[80%] top-[30%] w-48 h-32 bg-[#161625]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl -rotate-6 hidden lg:block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-1 bg-purple-500 rounded-full" />
              <p className="text-[10px] uppercase font-bold text-gray-400">Install v1.0.2</p>
            </div>
            <div className="h-full space-y-2">
              <div className="h-2 w-full bg-gray-800 rounded" />
              <div className="h-2 w-3/4 bg-gray-800 rounded" />
            </div>
          </div>

          {/* Connectors (Abstractly represented via CSS) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ filter: 'drop-shadow(0 0 8px rgba(219, 39, 119, 0.4))' }}>
            <path
              d="M 400 350 Q 550 350 600 250"
              fill="none"
              stroke="#DB2777"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-[dash_2s_linear_infinite]"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default DigitalAssetsSection;
