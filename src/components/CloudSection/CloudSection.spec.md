# SPEC: CloudSection

## 1. Goal & Intent
A cinematic scrolling experience that introduces the "Shader Editor" product mission. It uses an orthographic camera and fragment shaders to render volumetric-style clouds in a vibrant brand palette.

## 2. Usage & Interface
A standalone section between `Hero` and `DigitalAssetsSection`.

```tsx
<CloudSection />
```

## 3. Technical Implementation
- **Shaders**: Multi-layered FBM (Fractal Brownian Motion) noise for organic cloud movement.
- **Intersection Observer**: Tracks scroll progress to trigger text animations.
- **Scroll Logic**: Maps viewport position (0-1) to shader opacity and text transformations (`blur`, `translate-y`).

## 4. Visuals & Interaction
- **Aesthetics**: Blended sky with Deep Purple, Magenta, Cyan, and White.
- **Design System**: Buttons use `rounded-xl` per global design sync.
- **Text Animation**: Staggered fade-ins with blur-to-clear transitions as the user scrolls.

## 5. Accessibility (WCAG 2.1)
- [x] Text has high contrast against cloud density.
- [x] Scroll animations respect the user's scroll speed.

## 6. Performance
- [x] Simple plane geometry (2 vertices) for the shader canvas.
- [x] Efficient disposal of Three.js materials.

## 7. Implementation Checklist
- [x] Foundation shader logic
- [x] Vibrant sky gradient
- [x] Scroll progress mapping
- [x] Responsive text layer
- [x] Design sync: apply `rounded-xl` to main CTA.

## 8. Changelog
- **2026-01-24**: Initial spec creation to document existing component.
- **2026-01-24**: [MANUAL SYNC] Design update: Applied `rounded-xl` to button for brand consistency.
