# SPEC: ContactForm

## 1. Goal & Intent
Provide a clean, user-friendly form for consulting inquiries. This form will be embedded within the `ContactBanner` to capture user details.

## 2. Usage & Interface
A form component that takes a submission handler.

```tsx
<ContactForm 
  onSubmit={(data) => console.log(data)}
/>
```

## 3. Technical Implementation
- **State Management**: Local React state for form fields.
- **Styling**: Tailwind v4 with a clean, dark-themed input aesthetic.
- **Animation**: 
    - **Framer Motion**: Subtle fade-in/up for each form field.
- **Components**: 
    - Custom styled `Input` and `TextArea`.
- **Validation**: Inline validation for email and required fields.

## 8. Changelog
- **2026-01-24**: Initial spec creation.
- **2026-01-24**: (MANUAL SYNC) Design update: Changed button border-radius from `rounded-2xl` to `rounded-xl` for consistency across the page.

## 4. Visuals & Interaction
- **Aesthetics**: Dark inputs with glassmorphic borders. Subtle glow on focus.
- **Animations**: Labels that shift upward on focus.
- **Container Queries**: Form adjusts from single column to multi-column on larger widths.

## 5. Accessibility (WCAG 2.1)
- [ ] Labels properly associated with inputs (`htmlFor`).
- [ ] Error messages announced via `aria-live`.
- [ ] Focus indicators clearly visible.

## 6. Performance
- [ ] Uncontrolled components where possible for speed.
- [ ] Prevent unnecessary re-renders during typing.

## 7. Implementation Checklist
- [x] Initial scaffolding
- [ ] Form Structure (Fields: Name, Email, Service Type, Message)
- [ ] Validation Logic
- [ ] Styling & Animations
- [ ] Integration into ContactBanner
