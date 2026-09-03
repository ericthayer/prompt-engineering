# SPEC: Hero

## 1. Goal & Intent
The Hero section provides the first impression of the "Stellar" application. It features a high-performance 3D particle simulation of a galaxy/universe, reinforcing the high-tech and cosmic theme of the brand.

## 2. Usage & Interface
The entry point component for the landing page.

```tsx
<Hero onStartJourney={() => setView('journey')} />
```

## 3. Technical Implementation
- **Three.js Particle System**: Renders 40,000 particles in a spherical spiral formation using a custom `ShaderMaterial`.
- **Post-processing**: Uses `EffectComposer` with `UnrealBloomPass` for glow and `FXAAShader` for anti-aliasing.
- **Navigation**: Responsive navbar with a hamburger menu for mobile devices.
- **Animation**: 
    - Smooth rotation tracking the user's mouse position.
    - Particle pulsing and spiral animation controlled via vertex shaders.
    - CSS-based entry animations for text and button.

## 4. Visuals & Interaction
- **Aesthetics**: High-contrast dark mode (pure black background). 
- **Current Theme**: Purple to Pink gradient (`#6D28D9` to `#DB2777`) to align with the global brand palette.
- **Design System**: Buttons and containers use `rounded-xl` for a more structural, modern look.
- **Entry Points**: 
    - "Get Started": Scrolls to the CloudSection.
    - "Our Journey": Launches the `InteractiveJourney` demo via the `onStartJourney` prop.
- **Interaction**: Mouse movement subtly rotates the particle field. Bouncing arrow indicator for scroll cues.
- **Scroll Transition**: Clicking "Get Started" triggers a smooth "zoom-out" particle animation followed by a cinematic scroll to the `CloudSection`.

## 5. Accessibility (WCAG 2.1)
- [ ] Accessible navigation with ARIA labels.
- [ ] Keyboard focus states for links and buttons.
- [ ] Reduced motion support (not yet implemented).

## 6. Performance
- [x] High-performance vertex shader for particle math.
- [x] Proper resource disposal on unmount.
- [x] Pixel ratio limiting for Retina displays.

## 7. Implementation Checklist
- [x] Particle system foundation
- [x] Custom shaders & Bloom
- [x] Responsive Navigation
- [x] Interaction & Animation polish
- [x] Smooth view-transition to CloudSection

## 8. Changelog
- **2026-01-24**: Initial spec creation representing the current legacy state.
- **2026-01-24**: Refactor theme colors from Cyan/Blue to Purple/Pink to match global orchestration standards.
- **2026-01-24**: Fine-tune particle HSL range (0.74 - 0.92) to strictly match brand Purple/Pink aesthetics.
- **2026-01-24**: Improve text legibility by reducing bloom intensity and adjusting camera distance.
- **2026-01-24**: Spread particles out by increasing base radius (45) and introducing a volumetric distribution (0.7 to 1.3 variance) for a more immersive feel.
- **2026-01-24**: Reduced particle density (12k) and slowed down overall animation speeds for a more cinematic and less distracting background.
- **2026-01-24**: Add smooth "zoom" scroll transition for the "Get Started" button to navigate to the CloudSection.
- **2026-01-24**: ڈیزائن اپ ڈیٹ (Design update): Changed button border-radius from `rounded-full` to `rounded-xl` per brand direction.
- **2026-01-24**: Added `onStartJourney` prop and the secondary "Our Journey" action button to launch the orchestration demo.
