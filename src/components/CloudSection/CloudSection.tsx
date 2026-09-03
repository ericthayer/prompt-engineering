import React, { useEffect, useRef } from 'react';

import * as THREE from 'three';


const cloudShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float opacity;
    varying vec2 vUv;

    // Classic 2D Noise
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float smoothNoise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      f = f * f * (3.0 - 2.0 * f);
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 uv) {
      float total = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        total += smoothNoise(uv) * amplitude;
        uv *= 2.0;
        amplitude *= 0.5;
      }
      return total;
    }

    void main() {
      vec2 uv = vUv;
      
      // Moving noise for clouds
      float n = fbm(uv * 3.0 + time * 0.1);
      float n2 = fbm(uv * 6.0 - time * 0.05);
      float finalNoise = mix(n, n2, 0.5);

      // Sky gradient (Purple to Pink to Cyan as seen in nodetoy)
      vec3 topColor = vec3(0.1, 0.0, 0.3); // Deep purple
      vec3 midColor = vec3(0.8, 0.0, 0.8); // Hot pink
      vec3 bottomColor = vec3(1.0, 1.0, 1.0); // White/Clouds

      vec3 skyColor = mix(midColor, topColor, uv.y);
      skyColor = mix(bottomColor, skyColor, smoothstep(0.0, 0.6, uv.y));

      // Cloud shaping
      float cloudMask = smoothstep(0.3, 0.6, finalNoise * (1.0 - uv.y + 0.2));
      vec3 finalColor = mix(skyColor, vec3(1.0), cloudMask * 0.6);

      gl_FragColor = vec4(finalColor, opacity);
    }
  `
};

export const CloudSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 }
      },
      vertexShader: cloudShader.vertexShader,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float smoothNoise(vec2 uv) {
          vec2 i = floor(uv);
          vec2 f = fract(uv);
          f = f * f * (3.0 - 2.0 * f);
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 uv) {
          float total = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 6; i++) {
            total += smoothNoise(uv) * amplitude;
            uv *= 2.1;
            amplitude *= 0.5;
          }
          return total;
        }

        void main() {
          vec2 uv = vUv;
          
          float n = fbm(uv * 2.0 + time * 0.05);
          float n2 = fbm(uv * 4.0 - time * 0.02);
          float finalNoise = mix(n, n2, 0.5);

          // More vibrant colors from the screenshot
          vec3 topColor = vec4(0.05, 0.0, 0.2, 1.0).rgb; // Dark purple
          vec3 midColor = vec3(1.0, 0.0, 1.0); // Vibrant Magenta/Pink
          vec3 lowMidColor = vec3(0.0, 0.8, 1.0); // Cyan/Highlight
          vec3 bottomColor = vec3(1.0, 1.0, 1.0); // White Cloud

          vec3 skyColor = mix(midColor, topColor, pow(uv.y, 1.5));
          skyColor = mix(lowMidColor, skyColor, smoothstep(0.0, 0.4, uv.y));
          skyColor = mix(bottomColor, skyColor, smoothstep(0.0, 0.2, uv.y));

          // Volumetric cloud look
          float clouds = smoothstep(0.3, 0.8, finalNoise * (1.2 - uv.y));
          vec3 cloudColor = mix(vec3(1.0), midColor * 1.2, 0.2);
          
          vec3 finalColor = mix(skyColor, cloudColor, clouds * 0.7);

          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number;
    const animate = (time: number) => {
      material.uniforms.time.value = time * 0.001;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate(0);

    material.uniforms.opacity.value = 1;

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="cloud-section" className="relative flex min-h-[100dvh] w-full snap-start flex-col items-center overflow-hidden bg-[#10100f]" ref={containerRef}>
      <div className="relative z-10 flex min-h-[100dvh] w-full items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.28),transparent_52%)]" />
        <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-start px-6 py-20 text-left text-white lg:px-12">
          <p className="type-label mb-5 font-semibold tracking-[0.12em] text-orange-300">WRITE WITH INTENT</p>
          <h2 className="type-section mb-8 max-w-4xl font-extrabold leading-[1.05] tracking-tight">
            The Three C&apos;s of Prompt Writing
          </h2>
          <p className="type-body mb-10 max-w-[65ch] leading-relaxed text-stone-200">
            Write better prompts by keeping them <strong>Concise</strong> (avoiding overly complex requests), <strong>Clear</strong> (providing precise, unambiguous directions), and <strong>Consistent</strong> (using the same vocabulary for the same concepts throughout your chat).
          </p>
          <a href="#chaining" className="type-control inline-flex min-h-12 items-center border border-orange-300 bg-orange-400 px-6 py-3 font-bold text-stone-950 transition-transform hover:-translate-y-0.5 active:translate-y-px">
            Read the Guidelines
          </a>
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-35" aria-hidden="true" />
      </div>

    </section>

  );
};

export default CloudSection;
