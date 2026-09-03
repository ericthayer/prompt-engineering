import React, { useEffect, useRef, useState } from 'react';

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
  const [scrollProgress, setScrollProgress] = useState(0);

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

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      () => {
        // We are using scroll progress instead of a simple boolean visibility
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Scroll listener for parallax/fade
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far through the section we are (0 to 1)
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height + windowHeight)));
      setScrollProgress(progress);

      // Update shader opacity based on scroll
      // Fade in at the start, stay fully opaque, fade out at the end
      let currentOpacity = 0;
      if (progress < 0.2) {
        currentOpacity = progress / 0.2;
      } else if (progress > 0.8) {
        currentOpacity = (1 - progress) / 0.2;
      } else {
        currentOpacity = 1;
      }
      material.uniforms.opacity.value = currentOpacity;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="cloud-section" className="relative flex w-full flex-col items-center overflow-hidden bg-black" ref={containerRef}>
      <div className="sticky top-0 z-10 h-screen w-full">
        <div className="absolute top-1/2 left-1/2 z-20 flex w-full translate-x-[-50%] translate-y-[-50%] pointer-events-none flex-col items-center justify-center p-5 text-center text-white">
          <h2 className={`mb-8 max-w-[900px] text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${scrollProgress > 0.2 && scrollProgress < 0.9 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-[8px]'}`}>
            Say hello to the ultimate shader editor.
          </h2>
          <p className={`mx-auto mb-12 max-w-[550px] text-[clamp(1rem,2vw,1.35rem)] font-normal leading-relaxed text-white/90 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${scrollProgress > 0.3 && scrollProgress < 0.9 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-[8px]'}`}>
            Create, fork and publish shader graphs with the world using an intuitive and easy to use tool built for all.
          </p>
          <button className={`pointer-events-auto cursor-pointer rounded-xl bg-white py-4.5 px-10 text-[1.15rem] font-bold text-black transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.08] hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] active:scale-95 ${scrollProgress > 0.4 && scrollProgress < 0.9 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-[8px]'}`}>
            Open App →
          </button>
        </div>
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

    </section>

  );
};

export default CloudSection;
