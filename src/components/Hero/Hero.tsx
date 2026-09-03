import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

const coreShader = {

  vertexShader: `
    attribute float size;
    attribute vec3 customColor;
    attribute float phase;
    varying vec3 vColor;
    varying float vPhase;
    uniform float time;

    void main() {
        vColor = customColor;
        vPhase = phase;

        vec3 pos = position;

        float angle = atan(pos.y, pos.x);
        float distance = length(pos.xy);
        float spiralFactor = sin(distance * 0.5 + time * 2.0 + phase) * 0.1;

        pos.x += cos(angle + spiralFactor) * 0.2;
        pos.y += sin(angle + spiralFactor) * 0.2;
        pos.z += sin(distance + time + phase) * 0.1;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`,
  fragmentShader: `
    varying vec3 vColor;
    varying float vPhase;
    uniform float time;

    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.2, dist);

        float pulse = 0.8 + 0.2 * sin(time * 4.0 + vPhase);
        gl_FragColor = vec4(vColor * pulse, alpha);
    }
`
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.01);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60; // Pushed back from 80 to reduce globe footprint

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Post-processing ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    bloomPass.threshold = 0.25;
    bloomPass.strength = 0.4; // Reduced from 0.6 for better legibility
    bloomPass.radius = 0.4;
    composer.addPass(bloomPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
    composer.addPass(fxaaPass);

    // --- Particle System ---
    const createParticleSystem = (numParticles: number, radius: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];
      const sizes = [];
      const phases = [];

      for (let i = 0; i < numParticles; i++) {
        const phi = Math.acos(-1 + (2 * i) / numParticles);
        const theta = Math.sqrt(numParticles * Math.PI) * phi;

        const r = radius * (0.7 + Math.random() * 0.6); // Spreading particles by randomizing radius
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions.push(x, y, z);

        const color = new THREE.Color();
        const t = (x / radius + 1.0) / 2.0;
        const hue = 0.74 + t * 0.18; // Brand Purple (269deg) to Pink (332deg)
        color.setHSL(hue, 0.9, 0.6);
        colors.push(color.r, color.g, color.b);

        sizes.push(Math.random() * 1.0 + 0.3); // Slightly smaller particles for less "mass"
        phases.push(Math.random() * Math.PI * 2);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: coreShader.vertexShader,
        fragmentShader: coreShader.fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Points(geometry, material);
    };

    const particleSystem = createParticleSystem(12000, 45); // Reduced from 40k to 12k for clarity
    scene.add(particleSystem);
    cameraRef.current = camera;

    // --- Animation & Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
      targetRotationX = mouseY * 0.6;
      targetRotationY = mouseX * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    let requestRef: number;

    const animate = () => {
      time += 0.002;

      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      particleSystem.rotation.x = currentRotationX;
      particleSystem.rotation.y = currentRotationY;
      particleSystem.rotation.z += 0.0005;

      // Handle cinematic zoom transition
      if (isTransitioning && cameraRef.current) {
        cameraRef.current.position.z += (300 - cameraRef.current.position.z) * 0.05;
        particleSystem.scale.x *= 0.98;
        particleSystem.scale.y *= 0.98;
        particleSystem.scale.z *= 0.98;
      }

      particleSystem.material.uniforms.time.value = time;

      composer.render();
      requestRef = requestAnimationFrame(animate);
    };

    requestRef = requestAnimationFrame(animate);

    // --- Resize Handling ---
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);

      const pxRatio = renderer.getPixelRatio();
      fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pxRatio);
      fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pxRatio);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef);
      // Clean up Three.js resources
      particleSystem.geometry.dispose();
      (particleSystem.material as THREE.ShaderMaterial).dispose();
      renderer.dispose();
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const scrollToCloudSection = () => {
    setIsTransitioning(true);

    // Smooth scroll to cloud section
    const cloudSection = document.getElementById('cloud-section');
    if (cloudSection) {
      setTimeout(() => {
        cloudSection.scrollIntoView({ behavior: 'smooth' });
        // Reset transition state after scroll
        setTimeout(() => setIsTransitioning(false), 1500);
      }, 100);
    }
  };

  return (
    <div className="relative m-0 h-screen w-screen snap-start overflow-hidden bg-black" ref={containerRef}>
      <canvas ref={canvasRef} className="absolute top-0 left-0 block h-full w-full" />

      <nav className="absolute top-0 left-0 z-20 flex w-full box-border items-center justify-between p-8 font-['Inter',sans-serif]">
        <a href="#" className="text-[1.8rem] font-black text-white no-underline">LearnAI</a>
        <div className="hidden md:flex gap-8">
          <a href="#" className="relative py-[6px] px-[3px] font-semibold text-white no-underline opacity-100 transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1">Home</a>
          <a href="#" className="relative py-[6px] px-[3px] font-semibold text-white no-underline opacity-100 transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1">Features</a>
          <a href="#" className="relative py-[6px] px-[3px] font-semibold text-white no-underline opacity-100 transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1">About</a>
          <a href="#" className="relative py-[6px] px-[3px] font-semibold text-white no-underline opacity-100 transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1">Contact</a>
        </div>
        <div
          className={`z-30 flex md:hidden h-[21px] w-[30px] cursor-pointer flex-col justify-between ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          id="hamburger-menu"
        >
          <span className="block h-[3px] w-full rounded-[3px] bg-white transition-all duration-300 ease-in-out" style={isMobileMenuOpen ? { transform: 'rotate(45deg) translate(5px, 6px)' } : {}}></span>
          <span className="block h-[3px] w-full rounded-[3px] bg-white transition-all duration-300 ease-in-out" style={isMobileMenuOpen ? { opacity: 0 } : {}}></span>
          <span className="block h-[3px] w-full rounded-[3px] bg-white transition-all duration-300 ease-in-out" style={isMobileMenuOpen ? { transform: 'rotate(-45deg) translate(5px, -6px)' } : {}}></span>
        </div>
      </nav>

      <div className={`fixed top-0 z-25 flex h-screen w-[70%] max-w-[300px] flex-col items-center justify-center bg-black/90 p-8 backdrop-blur-md transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'right-0' : 'right-[-100%]'}`} id="mobile-nav">
        <div className="absolute top-8 right-8 flex h-7.5 w-7.5 cursor-pointer items-center justify-center after:absolute after:h-[3px] after:w-full after:rotate-[-45deg] after:rounded-[3px] after:bg-white after:content-[''] before:absolute before:h-[3px] before:w-full before:rotate-[45deg] before:rounded-[3px] before:bg-white before:content-['']" id="close-btn" onClick={toggleMobileMenu}></div>
        <a href="#" className="relative my-6 py-2 px-1 text-2xl font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1" onClick={toggleMobileMenu}>Home</a>
        <a href="#" className="relative my-6 py-2 px-1 text-2xl font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1" onClick={toggleMobileMenu}>Features</a>
        <a href="#" className="relative my-6 py-2 px-1 text-2xl font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1" onClick={toggleMobileMenu}>About</a>
        <a href="#" className="relative my-6 py-2 px-1 text-2xl font-semibold text-white no-underline transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(109,40,217,0.8)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#6D28D9] after:to-[#DB2777] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-1" onClick={toggleMobileMenu}>Contact</a>
      </div>

      <div className="absolute top-0 left-0 z-10 flex h-screen w-full pointer-events-none flex-col items-center justify-center p-5 text-center text-white font-['Inter',sans-serif]">
        <div className="max-w-[800px] pointer-events-auto animate-[fadeIn_1.5s_ease-out]">
          <h1 className="type-display mb-4 font-extrabold leading-[1.05] tracking-tight bg-linear-to-r from-[#6D28D9] to-[#DB2777] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">Master AI Prompting</h1>
          <p className="type-body mx-auto mb-10 max-w-[65ch] leading-relaxed opacity-90 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">The Core Framework: Persona, Task, Format, and Context. Combine this structure with iterative refinement to consistently guide AI to accurate, high-quality results.</p>
          <button
            onClick={scrollToCloudSection}
            className="type-control rounded-xl cursor-pointer bg-linear-to-l from-[#6D28D9] to-[#DB2777] py-4 px-9 font-semibold text-white shadow-[0_4px_20px_rgba(109,40,217,0.4)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_7px_30_rgba(109,40,217,0.6)] active:scale-95"
          >
            Learn the Framework
          </button>
          <button
            onClick={scrollToCloudSection}
            className="type-control rounded-xl cursor-pointer bg-transparent border-2 border-white/20 ml-4 py-4 px-9 font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40 active:scale-95"
          >
            Explore the 3 C&apos;s
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 translate-x-[-50%] animate-bounce text-2xl opacity-70">↓</div>
      </div>

      {/* Blending mask at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-15 pointer-events-none" />
    </div>

  );
};

export default Hero;
