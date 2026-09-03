import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DigitalAssetsSectionProps {
  title?: string;
  subtitle?: string;
}

export const DigitalAssetsSection: React.FC<DigitalAssetsSectionProps> = ({
  title = "Precision & Prompt Chaining",
  subtitle = "Don't just tell the AI what to do; guide how it should get there."
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

    const pointLight = new THREE.PointLight(0xea580c, 10); // Orange keeps the lesson visual tied to the page palette
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xfb923c, 10);
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
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const assetGroups: THREE.Group[] = [];
    const assetData = [
      { pos: [3.5, 3, -2], rot: [0.2, 0.4, 0.2], color: 0xea580c },
      { pos: [-4.5, 4, -4], rot: [-0.1, 0.2, 0.1], color: 0xfb923c },
      { pos: [-5.5, -3, 1], rot: [0.15, -0.15, 0.2], color: 0xea580c },
      { pos: [6, -4.5, -2], rot: [0.2, 0.1, -0.2], color: 0xfb923c },
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
      id="chaining"
      className="relative flex min-h-[100dvh] snap-start items-center overflow-hidden bg-[#10100f] px-6 py-16 text-white lg:px-24"
      aria-label="Precision and Prompt Chaining Section"
    >
      {/* Three.js Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex max-w-xl flex-col gap-6">
          <h2 className="type-section font-bold leading-[1.05] tracking-tight">
            {title}
          </h2>
          <p className="type-body leading-relaxed text-stone-300">
            {subtitle}
          </p>

          <div className="type-card space-y-5 leading-relaxed text-stone-200">
            <div>
              <h3 className="mb-1 text-lg font-bold text-orange-300">Powerful Prompt Phrases</h3>
              <p>Use specific language to set boundaries and force complex reasoning paths.</p>
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold text-orange-300">Prompt Chaining</h3>
              <p>Break massive projects down into a series of smaller, connected prompts to structure the entire conversation.</p>
            </div>
          </div>

          <div className="flex pt-2">
            <a href="#evaluation" className="type-control inline-flex min-h-12 items-center bg-orange-400 px-6 py-3 font-semibold text-stone-950 transition-transform hover:-translate-y-0.5 active:translate-y-px">
              Quick Start Guide
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative grid gap-3 border border-orange-200/25 bg-stone-950/70 p-5 backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
            <article className="border border-stone-700 bg-stone-900 p-5">
              <p className="type-label mb-3 font-semibold tracking-[0.12em] text-orange-300">ONE FOCUSED TASK</p>
              <p className="type-card font-semibold">Draft a concise project brief.</p>
            </article>
            <span className="hidden text-2xl text-orange-300 md:block" aria-hidden="true">→</span>
            <article className="border border-orange-300 bg-orange-400 p-5 text-stone-950">
              <p className="type-label mb-3 font-bold tracking-[0.12em]">CHECK THE RESULT</p>
              <p className="type-card font-bold">Find gaps. Refine. Continue.</p>
            </article>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
            <article className="border border-stone-700 bg-stone-900 p-5">
              <p className="type-label mb-3 font-semibold tracking-[0.12em] text-orange-300">NEXT PROMPT</p>
              <p className="type-card font-semibold">Rewrite only the missing section.</p>
            </article>
            <span className="hidden text-2xl text-orange-300 md:block" aria-hidden="true">→</span>
            <article className="border border-stone-700 bg-stone-900 p-5">
              <p className="type-label mb-3 font-semibold tracking-[0.12em] text-orange-300">FINAL PASS</p>
              <p className="type-card font-semibold">Verify facts and format.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalAssetsSection;
