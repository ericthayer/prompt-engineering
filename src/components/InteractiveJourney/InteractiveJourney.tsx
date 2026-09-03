import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Brain, FileCode2, GraduationCap } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  sceneConfig: {
    geometryType: 'cube' | 'icosahedron';
    wireframe: boolean;
    complexity: number;
    color: number;
  };
}

const steps: Step[] = [
  {
    id: 0,
    title: "1. The 'Vibe' Era",
    description: "In the early days, we relied on 'Vibe Coding'—vague prompts and hopeful results. The code worked, but it was chaotic and unoptimized.",
    icon: <GraduationCap className="w-6 h-6 text-gray-400" />,
    sceneConfig: {
      geometryType: 'cube',
      wireframe: false,
      complexity: 0,
      color: 0x444444
    }
  },
  {
    id: 1,
    title: "2. The Agentic Brain",
    description: "We evolved by building the '.agent/rules'—a digital conscience for the AI. Now, the agent understands CoBank's DNA: Accessibility, Performance, and Design Tokens.",
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    sceneConfig: {
      geometryType: 'cube',
      wireframe: true,
      complexity: 1,
      color: 0x6d28d9
    }
  },
  {
    id: 2,
    title: "3. Spec-Driven Development",
    description: "The contract was born. Every feature now begins with a '.spec.md', ensuring alignment between human intent and machine execution before a single line is written.",
    icon: <FileCode2 className="w-6 h-6 text-cyan-400" />,
    sceneConfig: {
      geometryType: 'icosahedron',
      wireframe: true,
      complexity: 2,
      color: 0x06b6d4
    }
  },
  {
    id: 3,
    title: "4. Orchestrated Symphony",
    description: "The final result: High-performance, fully accessible, and visually stunning components that represent the true union of human creativity and agentic precision.",
    icon: <CheckCircle2 className="w-6 h-6 text-pink-400" />,
    sceneConfig: {
      geometryType: 'icosahedron',
      wireframe: false,
      complexity: 3,
      color: 0xdb2777
    }
  }
];

interface InteractiveJourneyProps {
  onExit?: () => void;
}

export const InteractiveJourney: React.FC<InteractiveJourneyProps> = ({ onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Three.js Refs for morphing
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireRef = useRef<THREE.Mesh | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const stepRef = useRef(currentStep);
  const finishRef = useRef(false);

  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    finishRef.current = isFinishing;
  }, [isFinishing]);

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      handleFinish();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    if (isFinishing) return;
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      onExit?.();
    }, 2000); // 2 second cinematic zoom
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6d28d9, 15);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    lightRef.current = pointLight;

    // 3. Initial Mesh
    const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.2,
      metalness: 0.8
    });
    const mesh = new THREE.Mesh(cubeGeo, material);
    scene.add(mesh);
    meshRef.current = mesh;

    const wireframe = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({
      color: 0x6d28d9,
      wireframe: true,
      transparent: true,
      opacity: 0
    }));
    wireframe.scale.setScalar(1.02);
    scene.add(wireframe);
    wireRef.current = wireframe;

    // 4. Background Grid (Step 2+)
    const grid = new THREE.GridHelper(10, 20, 0x444444, 0x222222);
    grid.position.y = -2;
    grid.rotation.x = Math.PI * 0.05;
    grid.material.transparent = true;
    grid.material.opacity = 0;
    scene.add(grid);

    // 5. Animation Loop
    const animate = () => {
      const time = performance.now() * 0.001;
      const activeStep = stepRef.current;
      const finishing = finishRef.current;

      // Smooth Camera Z transition (Walking Forward)
      let targetZ = 4 - (activeStep * 2.5);
      if (finishing) {
        targetZ = -100; // Plunge MUCH deeper into space
      }
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, finishing ? 0.05 : 0.05);

      if (meshRef.current) {
        meshRef.current.rotation.y += activeStep === 0 ? 0.02 : 0.01;
        meshRef.current.rotation.x += activeStep === 0 ? 0.015 : 0.005;
        meshRef.current.position.y = Math.sin(time) * 0.1;

        // Keep objects relative to the forward movement or slightly offset
        const meshTargetZ = finishing ? -40 : -activeStep * 2.5;
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, meshTargetZ, finishing ? 0.02 : 0.05);

        if (finishing) {
          meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 0, 0.05));
        }
      }

      if (wireRef.current) {
        wireRef.current.rotation.y = meshRef.current?.rotation.y || 0;
        wireRef.current.rotation.x = meshRef.current?.rotation.x || 0;
        wireRef.current.position.z = (meshRef.current?.position.z || 0) + 0.02; // Tiny offset for wireframe
      }

      // Dynamic Grid Opacity and Position
      grid.material.opacity = THREE.MathUtils.lerp(grid.material.opacity, activeStep >= 1 ? 0.2 : 0, 0.05);
      grid.position.z = THREE.MathUtils.lerp(grid.position.z, -activeStep * 2.5, 0.05);

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Interaction Listeners
    let lastScrollTime = 0;
    const scrollCooldown = 1500;

    const handleWheel = (e: WheelEvent) => {
      if (finishRef.current) return;
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;
      if (Math.abs(e.deltaY) < 30) return;

      if (e.deltaY > 0) {
        prevStep();
        lastScrollTime = now;
      } else if (e.deltaY < 0) {
        nextStep();
        lastScrollTime = now;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (finishRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        nextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        prevStep();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(requestRef.current);
      cubeGeo.dispose();
      material.dispose();
      wireframe.material.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Geometry and Materials when Step changes
  useEffect(() => {
    if (!meshRef.current || !wireRef.current || !lightRef.current) return;

    const config = steps[currentStep].sceneConfig;

    // Dispose old, create new
    const newGeo = config.geometryType === 'cube'
      ? new THREE.BoxGeometry(1.5, 1.5, 1.5)
      : new THREE.IcosahedronGeometry(1.2, 0);

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = newGeo;

    wireRef.current.geometry.dispose();
    wireRef.current.geometry = newGeo;

    // Animate Colors and Opacity
    const targetColor = new THREE.Color(config.color);
    lightRef.current.color.lerp(targetColor, 1);

    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.lerp(targetColor, 1);
      meshRef.current.material.opacity = config.wireframe ? 0.3 : 1;
      meshRef.current.material.transparent = true;
    }

    if (wireRef.current.material instanceof THREE.MeshBasicMaterial) {
      wireRef.current.material.color.lerp(targetColor, 1);
      wireRef.current.material.opacity = config.wireframe || currentStep >= 1 ? 0.5 : 0;
    }

  }, [currentStep]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden"
      role="main"
      aria-label="Interactive Journey through Agentic Orchestration"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* Progress Line */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`h-1 w-12 rounded-full transition-all duration-700 ${step.id <= currentStep ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-gray-800'}`}
          />
        ))}
      </div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isFinishing && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 1.5, rotateX: -40, z: 100 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0c0c14]/40 backdrop-blur-md p-8 lg:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center text-center max-w-2xl perspective-1000"
            >
              <div className="p-4 bg-gray-900/50 rounded-2xl mb-6 ring-1 ring-white/10">
                {steps[currentStep].icon}
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                {steps[currentStep].title}
              </h2>

              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                {steps[currentStep].description}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-4 rounded-xl border border-white/5 hover:bg-white/5 disabled:opacity-20 transition-all text-white active:scale-95"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextStep}
                  className="px-8 py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-all flex items-center gap-3 shadow-lg shadow-purple-900/20 active:scale-95 disabled:bg-gray-800 disabled:opacity-50"
                  aria-label="Next step"
                >
                  {currentStep === steps.length - 1 ? "Quest Complete" : "Continue Quest"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warp / Exit Portal Overlay */}
      <AnimatePresence>
        {isFinishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white"
            transition={{ duration: 0.8, ease: "easeIn" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 mix-blend-multiply opacity-50" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full bg-purple-500 blur-[100px] opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Accents */}
      <div className="absolute bottom-12 left-12 p-4 border-l border-purple-500/30 font-mono text-[10px] text-gray-500 uppercase tracking-widest hidden lg:block">
        Orchestration Mode: [ACTIVE]<br />
        Integrity Level: 99.8%<br />
        Spec Alignment: 1.0.0
      </div>

      <div className="absolute bottom-12 right-12 flex items-center gap-6">
        <div className="flex items-center gap-3 text-gray-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Agentic Thread Connected
        </div>
        <button
          onClick={onExit}
          className="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest border border-white/10 px-3 py-1 rounded"
        >
          Exit Journey
        </button>
      </div>
    </div>
  );
};

export default InteractiveJourney;
