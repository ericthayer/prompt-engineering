# SPEC: InteractiveJourney

## 1. Goal & Intent
The `InteractiveJourney` component is a dedicated demo experience that tells the story of our "Agentic Orchestration." It guides the user through the evolution from "Vibe Coding" to "SDD Excellence" using a step-by-step narrative coupled with interactive 3D visualizations from our project (Three.js).

The goal is to provide a "behind the scenes" look at how the Agentic Brain (.agent/rules) and Specs (.spec.md) directly influence the production code.

## 2. Usage & Interface
This component is a full-page module that manages its own step-based state and provides a cinematic exit.

```tsx
<InteractiveJourney 
  onExit={() => console.log("Journey Finished")}
/>
```

## 3. Technical Implementation
- **State Management**: `useState` for current step (0-3). `useRef` for animation state (stepRef, finishingRef) to prevent stale closures.
- **Logic**: A "Step Engine" that maps each phase to a 3D geometry morph and a Camera Z-space transition.
- **Dependencies**: Three.js, Framer Motion for text and warp transitions.

## 4. Visuals & Interaction
- **Aesthetics**: "Cyber-Lab" / "Blueprints" style. Dark mode, neon accents, grid overlays.
- **Animations**: Z-space "Walking Forward" effect. The camera glides through space as the user progresses.
- **Interaction**: Dual-mode navigation:
    - **Scroll**: Scroll Up (Forward), Scroll Down (Backward).
    - **Keyboard**: Arrow keys (Right/Up for Forward, Left/Down for Backward).
- **Step 1: The Vibe**: A simple, unoptimized spinning cube (The Chaos of Prompts).
- **Step 2: The Brain**: Introducing the `.agent/rules`. The cube gains structure and a grid (The Rule of Law).
- **Step 3: The Spec**: Geometric shift to Icosahedron (The SDD contract).
- **Step 4: The Symphony**: High-speed "Warp Drive" plunge through a portal of color.

## 5. Accessibility (WCAG 2.1)
- [ ] Keyboard Navigation (Left/Right arrows for steps)
- [ ] Screen reader support for narrative text (`aria-live` for step changes)
- [ ] Reduced Motion: Fade transitions instead of complex morphs if the preference is set.

## 6. Performance
- [ ] Asset Budgeting: Reuse geometry buffer where possible.
- [ ] Lazy loading of complex 3D assets for Step 4.

## 7. Implementation Checklist
- [ ] Scaffold `InteractiveJourney` component folder.
- [ ] Define the `steps` data array (narrative + 3D state).
- [ ] Implement the Step UI (Floating navigation/text).
- [ ] Connect Three.js scene to the current step state.
- [ ] Animation Polish (Framer Motion).
- [ ] Audit for Accessibility and Perf.

## 8. Changelog
- **2026-01-24**: Initial spec creation.
- **2026-01-24**: ORCHESTRATION SYNC - Implemented Z-space "Walking Forward" motion.
- **2026-01-24**: ORCHESTRATION SYNC - Added Scroll (Wheel) and Keyboard (Arrows) navigation.
- **2026-01-24**: ORCHESTRATION SYNC - Added "Warp Drive" ending animation and automatic home transition.
