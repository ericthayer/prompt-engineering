import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const vertexShader = `
  attribute float size;
  attribute float phase;
  varying vec3 vColor;
  varying float vPhase;
  uniform float time;

  void main() {
    vColor = color;
    vPhase = phase;
    vec3 pos = position;
    float distanceFromCore = length(pos.xy);
    float drift = sin(distanceFromCore * 0.18 + time + phase) * 0.16;
    pos.x += cos(phase + time * 0.16) * drift;
    pos.y += sin(phase + time * 0.12) * drift;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vPhase;
  uniform float time;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(point);
    if (distanceFromCenter > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, distanceFromCenter);
    float pulse = 0.88 + 0.12 * sin(time * 1.4 + vPhase);
    gl_FragColor = vec4(vColor * pulse, alpha * 0.72);
  }
`;

function createRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function DeckBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const narrowViewport = window.matchMedia('(max-width: 767px)').matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.014);

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000);
    camera.position.z = 64;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      canvas.dataset.webgl = 'unavailable';
      return;
    }

    renderer.setClearColor(0x090a0f, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrowViewport ? 1.5 : 2));

    const particleCount = narrowViewport ? 4200 : 9800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const random = createRandom(2909);
    const lavender = new THREE.Color('#c8a7ff');
    const pale = new THREE.Color('#f3f1f8');
    const color = new THREE.Color();

    for (let index = 0; index < particleCount; index += 1) {
      const phi = Math.acos(-1 + (2 * index) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 45 * (0.68 + random() * 0.7);
      const offset = index * 3;

      positions[offset] = radius * Math.sin(phi) * Math.cos(theta);
      positions[offset + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[offset + 2] = radius * Math.cos(phi);

      color.copy(lavender).lerp(pale, random() * 0.42);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
      sizes[index] = 0.35 + random() * 1.1;
      phases[index] = random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let frameId = 0;
    let isVisible = !document.hidden;
    let activeSection = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastTime = performance.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const render = (now: number) => {
      if (!isVisible) return;
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      pointerX += (targetPointerX - pointerX) * 0.055;
      pointerY += (targetPointerY - pointerY) * 0.055;
      particles.rotation.x += (pointerY * 0.24 + activeSection * 0.035 - particles.rotation.x) * 0.025;
      particles.rotation.y += (pointerX * 0.3 + activeSection * 0.08 - particles.rotation.y) * 0.025;
      particles.rotation.z += delta * 0.022;
      material.uniforms.time.value += delta;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetPointerX = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !reduceMotion) {
        lastTime = performance.now();
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(frameId);
      }
    };

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-deck-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visibleEntry) return;
        const nextIndex = sections.indexOf(visibleEntry.target as HTMLElement);
        if (nextIndex >= 0) activeSection = nextIndex;
      },
      { threshold: [0.4, 0.6, 0.8] },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (finePointer && !reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

    resize();
    if (reduceMotion) {
      material.uniforms.time.value = 0.4;
      renderer.render(scene, camera);
    } else {
      frameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--deck-bg)]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(139,92,246,0.15),transparent_42%),linear-gradient(180deg,#090a0f_0%,#0e0e16_55%,#090a0f_100%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_22%,rgba(9,10,15,0.36)_72%,rgba(9,10,15,0.78)_100%)]" />
    </div>
  );
}
