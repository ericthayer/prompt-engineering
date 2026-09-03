# SPEC: DigitalAssetsSection

## 1. Goal & Intent
Create a high-impact feature section that showcases "Compound Digital Assets." The intent is to demonstrate a high-tech, AI-driven environment where UI components are shared and versioned. This matches the provided visual design featuring 3D floating elements and a central "composition" UI.

## 2. Usage & Interface
The component will be a standalone section intended to follow the `CloudSection` in the main landing page.

```tsx
<DigitalAssetsSection 
  title="Compound Digital Assets"
  subtitle="Build, version, and share components to create scalable applications faster than ever"
/>
```

## 3. Technical Implementation
- **Three.js Background**: A dedicated canvas rendering floating **Icosahedrons** with dual-mesh (solid + wireframe) to create a "holographic digital asset" feel. Includes a subtle particle background for depth.
- **React Components**: 
    - `HeroContent`: The left-aligned text and CTA buttons.
    - `ComposerUI`: The central mobile-frame mockup and floating node elements.
- **Logic**:
    - `useFrame`: For smooth animation of 3D assets and particle field.
    - `Framer Motion`: For entry animations of UI cards and connector lines.
- **Dependencies**: Three.js, Lucide-react (for icons), Framer Motion (for UI transitions).

## 4. Visuals & Interaction
- **Aesthetics**: Deep dark mode (#050505 bg). Neon accents (Purple #6D28D9, Pink #DB2777). Glassmorphism for floating UI cards.
- **Animations**:
    - Ambient drift for 3D cubes.
    - "Install" tags on connector lines with a pulse/drawing animation.
    - Hover states on buttons with glowing borders.
- **Container Queries**: The section uses `@container` to switch from a horizontal split (desktop) to a stacked layout (mobile) based on available width.

## 5. Accessibility (WCAG 2.1)
- [ ] ARIA Labels for 3D canvas ("Floating 3D asset visualization").
- [ ] Keyboard navigation for CTA buttons.
- [ ] Reduced Motion: Disable cube drift and line animations if `prefers-reduced-motion` is active.
- [ ] High contrast text (White on Deep Dark).

## 6. Performance
- [ ] Soft asset limit: Reuse cube geometries across all instances to save memory.
- [ ] Render loop: Capped at 60fps, paused when off-screen using Intersection Observer.
- [ ] Critical CSS: Inline initial background color.

## 7. Implementation Checklist
- [x] Initial scaffolding (Folder & Spec)
- [ ] Three.js Background Implementation (Floating Cubes)
- [ ] Core UI Structure (Text & Buttons)
- [ ] Central "Composition" UI (Mobile Frame & Nodes)
- [ ] Animation & Connector Lines
- [ ] Final Accessibility & Performance audit
