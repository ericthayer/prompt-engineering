# SPEC: ContactBanner

## 1. Goal & Intent
Create a "Contact Us" banner specifically for consulting inquiries. It should provide a high-contrast break from the previous deep-dark 3D sections while feeling like a natural conclusion to the page.

## 2. Usage & Interface
A section to be placed after `DigitalAssetsSection`.

```tsx
<ContactBanner 
  title="Ready to Scale Your Infrastructure?"
  ctaText="Book a Consulting Call"
/>
```

## 3. Technical Implementation
- **Styling**: Tailwind v4 with a vibrant gradient background (Electric Purple to Deep Indigo).
- **Animation**: 
    - **Framer Motion**: Staggered text entrance.
    - **Background Animation**: A floating "light orb" or glowing aura that slowly moves behind a glassmorphic card.
- **Components**: 
    - `ContactCard`: A semi-translucent container for the layout.
    - `ContactForm`: A dedicated form component for data entry.
- **Dependencies**: Framer Motion, Lucide-react.

## 4. Visuals & Interaction
- **Aesthetics**: "Vibrant Glassmorphism." High-saturation gradients. White text for readability.
- **Blending**: Transition from the `#050505` of the previous section using a deep indigo `linear-gradient` at the top of this section.
- **Hover States**: CTA button should have a "magnetic" pull effect or a significant glow increase on hover.

## 5. Accessibility (WCAG 2.1)
- [ ] Link/Button has `aria-label` for screen readers.
- [ ] Contrast check: Ensure white text on purple/indigo gradient exceeds 4.5:1.
- [ ] Reduced Motion: Disable the floating aura background motion.

## 6. Performance
- [ ] SVGs for icons.
- [ ] CSS-based animations for the background aura to keep the main thread free.

## 7. Implementation Checklist
- [x] Initial scaffolding (Folder & Spec)
- [ ] HTML Structure (Full-width section with centered card)
- [ ] Gradient & Glassmorphism Styling
- [ ] Floating Aura Background Logic
- [ ] Framer Motion Scroll Trigger Animations
- [ ] Final Accessibility audit
