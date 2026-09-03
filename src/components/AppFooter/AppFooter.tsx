import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AppFooter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.parentElement?.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

    // 2. Lava-Lamp Blobs (High-Reaction & Ultra-Vibrant)
    const blobs: THREE.Mesh[] = [];
    const blobColors = [0x9333ea, 0x3b82f6, 0xdb2777, 0x4f46e5, 0xec4899];

    // Use one shared geometry to optimize memory and fix disposal error
    const baseGeometry = new THREE.SphereGeometry(1, 32, 32);

    blobColors.forEach((color) => {
      const material = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.35, // Dimmed from 0.6
        roughness: 0,
        metalness: 0.1,
        emissive: color,
        emissiveIntensity: 0.6 // Dimmed from 1.0
      });
      const blob = new THREE.Mesh(baseGeometry, material);

      // Initial random scale and position
      const initialScale = 3 + Math.random() * 4;
      blob.scale.setScalar(initialScale);

      blob.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );

      scene.add(blob);
      blobs.push(blob);
    });

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);

    // 4. Mouse Tracking
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse to -1 to 1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 5. Animation
    let requestFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001;

      blobs.forEach((blob, i) => {
        // Base floating movement
        blob.position.x += Math.sin(elapsed * 0.3 + i) * 0.02;
        blob.position.y += Math.cos(elapsed * 0.3 + i) * 0.02;

        // Stronger Magnetic Displacement
        const targetX = mouse.current.x * 15; // Increased range
        const targetY = mouse.current.y * 8;

        // Very fast interpolation for high reactivity
        blob.position.x += (targetX - blob.position.x) * 0.05;
        blob.position.y += (targetY - blob.position.y) * 0.05;

        // Dynamic scaling based on mouse speed & proximity
        const dist = Math.sqrt(
          Math.pow(blob.position.x - targetX, 2) +
          Math.pow(blob.position.y - targetY, 2)
        );

        // Blobs expand as they get closer to the mouse
        const baseScale = 3 + (i * 0.5);
        const proximityEffect = Math.max(0, 3 - dist / 4);
        const finalScale = baseScale + proximityEffect + (Math.sin(elapsed + i) * 0.5);

        blob.scale.set(finalScale, finalScale, finalScale);
      });

      renderer.render(scene, camera);
      requestFrame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestFrame);
      baseGeometry.dispose();
      blobs.forEach(b => (b.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <footer className="relative w-full snap-start bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden" ref={containerRef}>
      {/* Lava Lamp Canvas (Balanced & Reactive) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Logo & Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg" />
              <span className="text-xl font-bold text-white tracking-tight">PROMPTING</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
              Keep prompts concise, clear, and consistent. Use iterative refinement to improve output quality across every AI task.
            </p>
            <div className="flex items-center gap-4">
              {/* {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all hover:bg-white/5">
                  <Icon size={18} />
                </a>
              ))} */}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Framework</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#cloud-section" onClick={(event) => scrollToSection(event, 'cloud-section')} className="hover:text-purple-400 transition-colors">Persona</a></li>
              <li><a href="#cloud-section" onClick={(event) => scrollToSection(event, 'cloud-section')} className="hover:text-purple-400 transition-colors">Task</a></li>
              <li><a href="#cloud-section" onClick={(event) => scrollToSection(event, 'cloud-section')} className="hover:text-purple-400 transition-colors">Format</a></li>
              <li><a href="#evaluation" onClick={(event) => scrollToSection(event, 'evaluation')} className="hover:text-purple-400 transition-colors">Context</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Best Practices</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#chaining" onClick={(event) => scrollToSection(event, 'chaining')} className="hover:text-purple-400 transition-colors">Prompt Chaining</a></li>
              <li><a href="#evaluation" onClick={(event) => scrollToSection(event, 'evaluation')} className="hover:text-purple-400 transition-colors">Context Hygiene</a></li>
              <li><a href="#evaluation" onClick={(event) => scrollToSection(event, 'evaluation')} className="hover:text-purple-400 transition-colors">Output Evaluation</a></li>
              <li><a href="#chaining" onClick={(event) => scrollToSection(event, 'chaining')} className="hover:text-purple-400 transition-colors">Iteration Loops</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-6">Practice Prompting</h4>
            <a
              href="https://www.coursera.org/professional-certificates/google-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-purple-500 active:scale-[0.98]"
            >
              Explore Google AI Certificate
            </a>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Build practical AI fluency with Google.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs">
            © 2026 Prompting Fundamentals Deck v{__APP_VERSION__}. Built for team enablement.
          </p>
          <div className="flex gap-8 text-gray-500 text-xs font-medium">
            <a href="https://docs.github.com/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms</a>
            <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://docs.github.com/site-policy/privacy-policies/github-cookies" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
