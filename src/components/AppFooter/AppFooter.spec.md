# SPEC: AppFooter

## 1. Goal & Intent
Create a comprehensive footer that matches the professional layout of the provided reference image while elevating the aesthetic to match our "Orchestrated" design system (deep dark, neon accents, glassmorphism). It features an interactive "lava-lamp" Three.js background.

## 2. Usage & Interface
The final section of the application.

```tsx
<AppFooter />
```

## 3. Technical Implementation
- **Three.js Background**: A dedicated canvas rendering large, blurry "blobs" (lava-lamp effect). 
- **Physics Engine**: Use high-speed interpolation (`lerp`) for tight mouse tracking.
- **Magnetic Scaling**: Blobs dynamically expand when in close proximity to the cursor.
- **Newsletter**: Managed via local React state.
- **Styling**: Tailwind v4 with glassmorphic elements.
- **Dependencies**: Three.js, Lucide-react.

## 4. Visuals & Interaction
- **Aesthetics**: Deep dark background (#050505). High-end translucent UI columns.
- **Lava-Lamp Effect**: 
    - 5 large spheres with heavy blur for a liquid-void feel.
    - Colors: Neon Purple, Electric Blue, Hot Pink, Deep Indigo.
    - Mouse Interaction: Strong magnetic attraction. Blobs "clump" and scale up based on cursor position.
- **Layout**: 
    - Branding col (Gradient Logo + Tagline).
    - Multi-column navigation (Product, Company, Resources).
    - Integrated Newsletter form with glassmorphic borders and glowing CTA.

## 5. Accessibility (WCAG 2.1)
- [x] Links have descriptive titles.
- [x] Labeled form inputs.
- [x] High-contrast visibility (3.5+ for decorative, 4.5+ for text).
- [x] Motion: Assets properly disposed of on unmount.

## 6. Performance
- [x] Shared Geometry: Multiple meshes share a single `baseGeometry` to minimize buffer overhead.
- [x] Disposal Logic: Full cleanup of scene, renderer, and geometries on component unmount.
- [x] Optimized Blur: Balanced canvas opacity (50%) and blur (100px) for smooth 60fps performance.

## 7. Implementation Checklist
- [x] Initial scaffolding (Folder & Spec)
- [x] Three.js "Lava-Lamp" Background Logic
- [x] High-Reaction Mouse Physics
- [x] Magnetic Scaling Interaction
- [x] Footer Column Layout (Tailwind v4)
- [x] Newsletter Form Component
- [x] Final Accessibility & Disposal audit
