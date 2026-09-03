# AI Prompting Scroll Deck Implementation Guide

## Design read

Reading this as: an educational scroll-deck for a time-limited team presentation, with a dark cinematic tech language, leaning toward native CSS, Tailwind v4, React, and the existing Three.js particle system.

- `DESIGN_VARIANCE: 8`: Each section uses a distinct composition while retaining a unified frame.
- `MOTION_INTENSITY: 7`: Motion supports sequencing, state changes, and narrative flow. Reduced motion uses static equivalents.
- `VISUAL_DENSITY: 4`: One teaching point per viewport with generous spacing and presentation-scale type.
- Redesign mode: overhaul the visual and content structure while preserving the strongest asset, the interactive particle field.
- Design system: project-native Tailwind v4 and CSS variables. No external component system is needed.

## Current-state audit

### Preserve

- The `Hero` particle shader, pointer interaction, pixel-ratio cap, and resource disposal.
- React 19, TypeScript, Vite, Tailwind v4, Three.js, Storybook, and the existing motion package.
- The current component colocation pattern: implementation, story, and spec in one folder.
- The dark cinematic presentation language.

### Replace or extract

- Replace the five marketing sections in `App.tsx` with nine educational sections.
- Extract the Three.js implementation from `Hero` into one fixed `DeckBackdrop` canvas. Do not mount a new WebGL renderer for every slide.
- Replace `h-screen` with `h-[100dvh]` on the scroll container and `min-h-[100dvh]` on each slide.
- Replace technical infrastructure copy, newsletter UI, contact forms, footer navigation, and marketing CTAs.
- Remove decorative scroll cues, version labels, generic navigation links, and repeated neon hover glows.
- Keep the existing `lucide-react` icon family because it is already installed. Do not mix icon libraries.

### Intentional content exception

The supplied hero subheadline is longer than the usual 20-word hero limit. Preserve it exactly as requested, cap it to four visual lines on desktop, and add no eyebrow, trust strip, or secondary CTA.

## Proposed component structure

```text
src/
  App.tsx
  index.css
  content/
    promptingDeck.ts
  components/
    DeckBackdrop/
      DeckBackdrop.tsx
      DeckBackdrop.spec.md
      DeckBackdrop.stories.tsx
    DeckSection/
      DeckSection.tsx
      DeckSection.spec.md
      DeckSection.stories.tsx
    PromptingHero/
      PromptingHero.tsx
      PromptingHero.spec.md
      PromptingHero.stories.tsx
    ThreeCsSection/
      ThreeCsSection.tsx
      ThreeCsSection.spec.md
      ThreeCsSection.stories.tsx
    PowerPhrasesSection/
      PowerPhrasesSection.tsx
      PowerPhrasesSection.spec.md
      PowerPhrasesSection.stories.tsx
    PromptChainingSection/
      PromptChainingSection.tsx
      PromptChainingSection.spec.md
      PromptChainingSection.stories.tsx
    ContextWindowSection/
      ContextWindowSection.tsx
      ContextWindowSection.spec.md
      ContextWindowSection.stories.tsx
    ContextDriftSection/
      ContextDriftSection.tsx
      ContextDriftSection.spec.md
      ContextDriftSection.stories.tsx
    IterationSection/
      IterationSection.tsx
      IterationSection.spec.md
      IterationSection.stories.tsx
    KeyTakeawaysSection/
      KeyTakeawaysSection.tsx
      KeyTakeawaysSection.spec.md
      KeyTakeawaysSection.stories.tsx
    EvaluationChecklist/
      EvaluationChecklist.tsx
      EvaluationChecklist.spec.md
      EvaluationChecklist.stories.tsx
```

### App composition

```tsx
export default function App() {
  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[var(--deck-bg)] text-[var(--deck-text)]">
      <DeckBackdrop />
      <main
        className="relative h-[100dvh] snap-y snap-proximity overflow-y-auto scroll-smooth md:snap-mandatory"
        aria-label="AI prompting fundamentals presentation"
      >
        <PromptingHero />
        <ThreeCsSection />
        <PowerPhrasesSection />
        <PromptChainingSection />
        <ContextWindowSection />
        <ContextDriftSection />
        <IterationSection />
        <KeyTakeawaysSection />
        <EvaluationChecklist />
      </main>
    </div>
  );
}
```

### Shared section contract

`DeckSection` should own viewport sizing, containment, snap behavior, and section labeling. It should not own slide-specific alignment.

```tsx
interface DeckSectionProps {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}
```

Base layout:

```tsx
<section
  id={id}
  aria-labelledby={labelledBy}
  className="relative isolate flex min-h-[100dvh] snap-start snap-always items-center overflow-hidden px-4 py-16 sm:px-6 md:px-10 lg:px-16"
>
  <div className="mx-auto w-full max-w-7xl">{children}</div>
</section>
```

## Visual system

### Theme and color

Use one dark theme across all nine slides. Section tints can vary inside the same near-black family, but no slide should flip to a light theme.

```css
:root {
  color-scheme: dark;
  --deck-bg: #090a0f;
  --deck-surface: rgb(20 21 30 / 0.82);
  --deck-surface-strong: #151621;
  --deck-text: #f3f1f8;
  --deck-muted: #c8c3d1;
  --deck-subtle: #9b95a8;
  --deck-line: rgb(216 201 255 / 0.18);
  --deck-accent: #c8a7ff;
  --deck-accent-strong: #aa7df4;
  --deck-focus: #dfccff;
  --deck-danger-surface: rgb(77 47 99 / 0.24);
}
```

The only accent family is lavender. Hero gradients move from off-white to lavender, not across multiple saturated hues. The context-window warning uses a deeper lavender tint instead of introducing amber or red.

### Typography

Use the existing sans stack or self-host Geist with `font-display: swap`. Do not use Inter as a new default.

```css
:root {
  --type-hero: clamp(3.25rem, 8vw, 7rem);
  --type-section: clamp(2.35rem, 5vw, 4.75rem);
  --type-body: clamp(1.05rem, 1.5vw, 1.35rem);
  --type-card: clamp(1.2rem, 2vw, 1.75rem);
}
```

- Hero: `font-black tracking-[-0.055em] leading-[0.92]`
- Section headings: `font-bold tracking-[-0.04em] leading-[0.98]`
- Body: `leading-relaxed text-[var(--deck-muted)] max-w-[65ch]`
- Prompt example: existing monospace stack, never the main body font
- Heading order: one `h1`, followed by one `h2` per slide and `h3` for card or checklist labels

### Shape system

- Structural panels and cards: `rounded-2xl`, equivalent to 16px
- Buttons and checkbox rows: `rounded-xl`, equivalent to 12px
- Circular shapes are reserved for process nodes and checkbox indicators because their geometry communicates function
- Use tinted shadows only when elevation is required

### Glass treatment

Use glass only for the hero CTA, the prompt example, the summary panel, and the evaluation panel. This keeps the material meaningful.

```css
.deck-glass {
  border: 1px solid rgb(223 204 255 / 0.22);
  background: linear-gradient(135deg, rgb(255 255 255 / 0.11), rgb(255 255 255 / 0.04));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12), 0 24px 64px rgb(11 6 21 / 0.28);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

@media (prefers-reduced-transparency: reduce) {
  .deck-glass {
    background: var(--deck-surface-strong);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

## Shared motion strategy

Use the installed `framer-motion` package for content reveals. Keep Three.js animation isolated inside `DeckBackdrop`.

- Hero: fade and translate the headline, body, then CTA to establish reading order.
- Three C's: reveal each cell according to visual priority, not simply left to right.
- Power phrases: reveal the highlighted phrase after the explanatory body.
- Prompt chaining: draw connectors by scaling wrapper elements on the x or y axis. Animate wrappers around icons, not SVG paths.
- Context window: use a single opacity and scale transition to create an interruption in the narrative.
- Context drift: stagger the three cards to show drift being corrected.
- Iteration: rotate the process ring no more than 12 degrees while the steps reveal. Do not use an infinite loop.
- Takeaways: reveal checked items in reading order.
- Evaluation: animate check state only after user input.

All automated motion must use `useReducedMotion()`. In reduced-motion mode, render final states immediately and keep the Three.js canvas static. Do not use `window.addEventListener('scroll')`; use `IntersectionObserver` for discrete active-slide updates.

## Slide 1: Prompting hero

### Component

`PromptingHero`

### Exact copy

- Headline: **Master AI Prompting**
- Subheadline: **Effective prompting relies on a clear framework: Persona, Task, Format, and Context. Combine this with iterative refinement to consistently guide AI to accurate, high-quality results.**
- Primary button: **Learn the Framework**

### Structure

```text
section#intro
  DeckBackdrop remains behind the section
  centered content group
    h1
    subheadline
    glass CTA
```

### Layout strategy

- Use `min-h-[100dvh]` and center the content both vertically and horizontally.
- Keep the text group at `max-w-5xl` and the body at `max-w-3xl`.
- Use no eyebrow, secondary CTA, logo strip, or scroll cue.
- Apply the headline gradient with `bg-linear-to-r from-[var(--deck-text)] via-[var(--deck-text)] to-[var(--deck-accent)] bg-clip-text text-transparent`.
- Add a dark radial scrim behind the copy to protect contrast against bright particles.
- Style the CTA as a single glass surface with `min-h-12`, `whitespace-nowrap`, and a visible focus ring.
- Link the CTA directly to `#framework` so the page works without JavaScript.

Suggested Tailwind core:

```text
flex min-h-[100dvh] items-center justify-center px-4 text-center
mx-auto flex max-w-5xl flex-col items-center gap-7
text-[length:var(--type-hero)] font-black leading-[0.92] tracking-[-0.055em]
max-w-3xl text-[length:var(--type-body)] leading-relaxed text-[var(--deck-muted)]
```

### Mobile

- Reduce the headline to the `clamp()` minimum.
- Use `px-4 py-20` and allow the body to occupy the full width.
- Keep the CTA visible within the initial viewport at 320px width.
- Disable pointer-driven particle rotation on coarse pointers.

## Slide 2: The Three C's

### Component

`ThreeCsSection`

### Exact copy

- Headline: **The Three C’s of Prompt Writing**
- **Be Concise:** Keep prompts simple and avoid overly long or complex requests in a single prompt.
- **Be Clear:** Be precise and avoid contradictory or ambiguous instructions. Give specific directions to guide the AI.
- **Be Consistent:** Use the same vocabulary for the same concepts throughout your conversation (e.g., don't mix "spreadsheet" and "matrix").

### Structure

```text
section#framework
  h2
  asymmetric three-cell bento
    article: Be Concise
    article: Be Clear
    article: Be Consistent
```

### Layout strategy

Use exactly three cells with asymmetric rhythm instead of three equal cards:

```text
md:grid md:grid-cols-12 md:grid-rows-2 gap-4
Concise: md:col-span-7 md:row-span-2
Clear: md:col-span-5
Consistent: md:col-span-5
```

Visual variation:

- `Be Concise`: transparent panel with a large cropped word treatment in the background.
- `Be Clear`: accent-tinted surface with a subtle grid texture.
- `Be Consistent`: darker panel with a repeated vocabulary pair shown as a semantic definition list.
- Use an inner edge highlight on hover instead of a large outer neon halo.
- Each card uses `group focus-within:ring-2` and shifts by no more than `-translate-y-1`.

### Mobile

- Collapse to `grid-cols-1` below 768px.
- Preserve reading order: Concise, Clear, Consistent.
- Remove row spans and decorative background words.
- Use `snap-start` only on the whole slide, never on individual cards.

## Slide 3: Power phrases

### Component

`PowerPhrasesSection`

### Exact copy

- Headline: **Precision & Powerful Phrases**
- Body: **There are no magic words, but certain phrases are more effective. Powerful prompt phrases don't just tell AI *what* to do. They guide *how* AI should get there by adding precision, setting boundaries, and forcing AI to use more complex reasoning paths.**

### Prompt example

Use a real semantic prompt example rather than a fake product screenshot:

> Before answering, identify the assumptions, constraints, and missing context that could affect the result.

### Structure

```text
section#precision
  two-column grid
    content column
      h2
      body
    semantic prompt example
      pre
        code
```

### Layout strategy

- Use `lg:grid-cols-2 lg:gap-16` with vertically centered columns.
- Keep the left copy stacked under the heading. Do not use a split header with a floating paragraph.
- Render the right visual as `<pre><code>` inside a glass panel with a real copy button.
- Use `aria-label="Example precision prompt"` on the code region.
- Highlight the phrase through text selection styling and an inset accent border, not a fake terminal title bar.
- The copy button needs `aria-label="Copy example prompt"`, a visible focus ring, and a temporary `Copied` state announced with `aria-live="polite"`.

### Mobile

- Collapse to one column with the text first and example second.
- Allow the code block to wrap with `whitespace-pre-wrap break-words`.
- Make the copy button full width only below 480px.

## Slide 4: Prompt chaining

### Component

`PromptChainingSection`

### Exact copy

- Headline: **Prompt Chaining**
- Body: **Don't ask for everything at once. Prompt chaining uses a series of smaller, connected prompts to structure an entire conversation and break down massive, complex projects step-by-step.**

### Node copy

Use direct task labels instead of generic stage numbers:

1. **Define the outcome**
2. **Draft one focused part**
3. **Review the result**
4. **Refine the next prompt**

### Structure

```text
section#chaining
  h2
  body
  ordered list visualized as connected nodes
```

### Layout strategy

- Use an actual `<ol>` so sequence remains understandable without CSS.
- Desktop: horizontal four-node path inside `grid-cols-4`, with connector wrappers between nodes.
- Tablet and mobile: vertical path using `before` or dedicated connector elements behind the list.
- Use `Circle`, `MessageSquareText`, `SearchCheck`, and `RefreshCw` from the existing icon family.
- Keep connectors subdued and illuminate only the active or revealed segment.
- The diagram should occupy the lower half of the viewport, balancing the concise header above.

### Mobile

- Switch to `grid-cols-1` and align nodes to a single left rail.
- Keep connector lines behind content and at least 24px away from body text.
- Reduce animation to a simple staggered reveal.

## Slide 5: The context window

### Component

`ContextWindowSection`

### Exact copy

- Headline: **Use New Chats for New Topics**
- Body: **A context window is the limit of how much information AI can retain. Because of this, you should always start a new chat when changing topics. If you switch to a completely new topic within the same chat, AI might use unrelated earlier context and generate misguided responses.**

### Structure

```text
section#context-window
  high-contrast aside
    ShieldAlert icon
    h2
    body
    two-topic separation visual
```

### Layout strategy

- Keep the global dark theme and use `--deck-danger-surface` for a stronger tinted field.
- Do not use `role="alert"` because the content is static instruction, not a live system alert.
- Use a thick left edge and a large shield icon as redundant non-color cues.
- Show `Topic A` and `New topic` as separate chat surfaces divided by a `Plus` icon and spacing. Do not imply they belong to one thread.
- Use `border-[var(--deck-accent)] bg-[var(--deck-danger-surface)]` with off-white text.

### Mobile

- Stack the icon, copy, and topic surfaces.
- Keep the body at `max-w-[65ch]` but allow full available width.
- Remove any background blur if it reduces text contrast.

## Slide 6: Managing drift

### Component

`ContextDriftSection`

### Exact copy

- Headline: **Managing Context Drift**
- **Context:** Provide accurate and up-to-date context in your prompts, especially for fast-changing topics.
- **Focus:** Keep chats focused by starting a new conversation for each specific task to reset the context window.
- **Explicitness:** Be explicit with clear and specific instructions.

### Structure

```text
section#drift
  h2
  staggered three-item layout
    Context
    Focus
    Explicitness
```

### Layout strategy

- Desktop: use a twelve-column grid with three cards offset vertically to show disorder resolving into focus.
- Suggested spans: `Context` columns 1-5, `Focus` columns 5-10 with `md:translate-y-10`, `Explicitness` columns 9-13.
- If overlap harms readability at 1024px, switch to a horizontal `overflow-x-auto snap-x snap-mandatory` rail instead.
- Use distinct textures within the same lavender palette: soft particles, a focused inset border, and a crisp solid surface.
- Motion reveals the cards from wider x offsets toward alignment, communicating drift correction.

### Mobile

- Use `flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4`.
- Each card is `min-w-[84vw] snap-center` at 320px to 767px.
- Preserve keyboard access to any controls and show a visible scrollbar or overflow fade. Do not rely on a drag gesture alone.

## Slide 7: Iteration

### Component

`IterationSection`

### Exact copy

- Headline: **Improve Results Through Iteration**
- Body: **AI outputs are a starting point, not a final product.**
- **Revisit the framework:** Add detail to your persona, task, format, or context.
- **Break up tasks:** Ask for smaller pieces one at a time.
- **Add constraints:** Add specific requirements the AI must meet to narrow its focus.

### Structure

```text
section#iteration
  centered heading and body
  ordered list arranged around a process ring
    Revisit the framework
    Break up tasks
    Add constraints
```

### Layout strategy

- Build the ring with CSS borders and a restrained conic gradient, not a custom SVG illustration.
- Place three semantic list items around the ring on desktop using a three-column grid layered over the ring.
- Use `RefreshCw` in the center to clarify that the process repeats.
- Do not visibly label items as `Step 1`, `Step 2`, or `Step 3`. The ordered list and directional flow communicate sequence.
- Animate the ring once as it enters view. Stop at the final state and do not loop.

### Mobile

- Hide the decorative ring and present a vertical ordered list with `ChevronDown` separators.
- Keep list titles and descriptions together to prevent orphaned labels.
- Render the final chevron as a curved return cue only when there is enough space.

## Slide 8: Key takeaways

### Component

`KeyTakeawaysSection`

### Exact copy

- Headline: **Key Takeaways**
- **Structure Your Approach:** Always define the Persona, Task, Format, and Context.
- **Master the 3 C's:** Keep prompts Concise, Clear, and Consistent.
- **Guide the Reasoning:** Use powerful phrases and prompt chaining to dictate *how* the AI thinks.
- **Protect Your Context:** Stick to one topic per chat to prevent AI drift.
- **Iterate:** Treat the first output as a draft, refine your constraints, and prompt again.

### Structure

```text
section#takeaways
  centered gradient-border panel
    h2
    five-item summary list
```

### Layout strategy

- Use one centered panel because this slide is a deliberate recap moment.
- Create the gradient border with a pseudo-element or nested wrapper. The gradient should move from transparent lavender to off-white and back to lavender.
- Keep the panel surface solid enough to maintain contrast over the canvas.
- Use `Check` icons with `aria-hidden="true"`; the text itself communicates completion.
- Arrange five items as two columns on desktop with the fifth item spanning both columns. This avoids one long divider list.
- Do not place borders on every item. Use spacing and icon alignment.

### Mobile

- Collapse to one column.
- Remove the fifth-item span and preserve source order.
- Keep each icon aligned to the first text line.

## Slide 9: Evaluation checklist

### Component

`EvaluationChecklist`

### Exact copy

- Headline: **Always Evaluate the Output**
- Body: **Before using or sharing AI output, read through to ensure it fulfills your request.**
- **Accuracy:** Is the information correct and factually sound?
- **Bias:** Does the output favor one perspective unfairly based on training data?
- **Relevancy:** Does it directly answer your prompt and stay on topic?
- **Consistency:** Is the tone, style, and quality the same throughout?

### Structure

```text
section#evaluation
  glass panel
    h2
    body
    fieldset
      legend for screen readers
      four native checkbox inputs and labels
    reset action
    aria-live completion message
```

### Layout strategy

- Use native `<input type="checkbox">` elements. Keep them visually available or use `sr-only` only when the custom control preserves a strong visible focus state.
- Render the checked glyph with the existing `Check` icon. Do not draw a custom SVG path.
- Make the full label row clickable with `cursor-pointer`, `min-h-14`, and `active:translate-y-px`.
- Use `grid gap-3 md:grid-cols-2` so the checklist reads quickly and does not become a long table.
- Add a `Reset checklist` text button only after at least one item is checked.
- Announce completion through an `aria-live="polite"` message. Do not use a toast.
- Preserve state locally with `useState<Record<EvaluationKey, boolean>>`.

Suggested interactive states:

- Default: dark surface, visible border, unchecked square.
- Hover: brighter inner border.
- Focus-visible: 2px lavender ring with 2px offset.
- Checked: lavender control background, near-black check icon, and slightly brighter row surface.
- Disabled is not needed because all checks remain user-controlled.

### Mobile

- Collapse to one column.
- Keep the panel at `mx-4` with `p-5` and each row at least 56px tall.
- Never put two checkbox labels on the same row below 768px.

## Content model

Store the educational strings in `src/content/promptingDeck.ts` so copy changes do not require editing visual components.

```ts
export const promptingDeck = {
  hero: {
    title: 'Master AI Prompting',
    description:
      'Effective prompting relies on a clear framework: Persona, Task, Format, and Context. Combine this with iterative refinement to consistently guide AI to accurate, high-quality results.',
    cta: 'Learn the Framework',
  },
  threeCs: [
    {
      title: 'Be Concise',
      description: 'Keep prompts simple and avoid overly long or complex requests in a single prompt.',
    },
    {
      title: 'Be Clear',
      description: 'Be precise and avoid contradictory or ambiguous instructions. Give specific directions to guide the AI.',
    },
    {
      title: 'Be Consistent',
      description:
        'Use the same vocabulary for the same concepts throughout your conversation (e.g., don\'t mix "spreadsheet" and "matrix").',
    },
  ],
} as const;
```

Continue the same immutable data shape for the remaining sections. Keep interaction state, icon references, and layout classes out of the content file.

## Three.js architecture

### One shared canvas

`DeckBackdrop` should be a fixed, pointer-inert visual layer:

```text
fixed inset-0 z-0 pointer-events-none
```

The deck content occupies `relative z-[1]`. Reserve higher layers only for focusable overlays if one is added later.

### Active-slide response

- Use one `IntersectionObserver` on the nine section elements.
- Update a discrete `activeSection` value only when a section crosses a 60 percent threshold.
- Pass the active value to the renderer through a ref or uniform target.
- Lerp uniforms inside the existing animation loop. Do not set React state on animation frames.
- Limit device pixel ratio to 2 and lower particle count on coarse pointers or narrow screens.
- Pause the loop when the document is hidden.
- Dispose geometry, shader material, composer passes, listeners, observers, and the renderer on unmount.

### Reduced motion

- Skip pointer tracking.
- Render one stable frame.
- Disable camera pushes, rapid particle pulses, and slide-linked transitions.
- Keep enough particle contrast to remain decorative rather than competing with text.

## Accessibility and interaction requirements

- Provide one `h1`, eight `h2` elements, and logical `h3` labels.
- Add `aria-labelledby` to each slide.
- Keep all decorative canvases and textures `aria-hidden="true"`.
- Ensure every CTA, copy button, and checkbox has a visible `:focus-visible` treatment.
- Do not use `role="alert"` for static slide content.
- Do not trap keyboard focus in scroll-snap sections.
- Test keyboard scrolling with Page Down, Space, Shift+Space, Home, and End.
- Keep text contrast at WCAG AA minimum, with hero copy targeting AAA.
- Do not communicate sequence or completion through color alone.
- Preserve browser zoom up to 200 percent without clipping content.
- If a slide exceeds one viewport at 320px width, let it grow vertically and use `snap-proximity` so content remains reachable.

## Storybook coverage

Create one story per section plus a full-deck story.

Required states:

- Default desktop at 1440px
- Tablet at 768px
- Mobile at 320px
- Reduced motion
- Reduced transparency
- Evaluation checklist: empty, partially checked, and complete
- Power phrase copy button: default and copied
- Three.js unavailable fallback with a static background

The full-deck story should validate section order, anchor links, and scroll snapping. Keep visual regression snapshots focused on content layers; stabilize or mock random particle positions for Chromatic.

## Presentation pacing

A practical speaking budget for a presentation under 10 minutes:

| Section | Target time |
| --- | ---: |
| Master AI Prompting | 45 seconds |
| The Three C's | 60 seconds |
| Power Phrases | 60 seconds |
| Prompt Chaining | 60 seconds |
| Context Window | 55 seconds |
| Managing Drift | 55 seconds |
| Iteration | 60 seconds |
| Key Takeaways | 50 seconds |
| Evaluation | 55 seconds |

Total planned speaking time: 8 minutes. The remaining time covers transitions and one short example.

## Implementation order

1. Extract `DeckBackdrop` from `Hero` and verify cleanup.
2. Add `DeckSection` and replace the root viewport classes.
3. Add the immutable content model with the exact supplied copy.
4. Build the nine static sections in source order.
5. Add interactive copy and checklist states.
6. Add motivated reveal motion with reduced-motion fallbacks.
7. Add responsive rules for 320px, 768px, 1024px, and 1440px.
8. Add Storybook stories and deterministic visual states.
9. Run build, lint, Storybook tests, keyboard checks, and a browser performance audit.

## Pre-flight decisions

- One dark theme across all sections.
- One lavender accent family across all sections.
- One documented radius system.
- One CTA intent: `Learn the Framework`.
- No visible slide-number eyebrows.
- No decorative scroll cue.
- No em dash or en dash in visible copy.
- No duplicate WebGL canvases.
- No fake terminal window or fake product screenshot.
- No custom icon paths.
- No continuous React state updates from scrolling or pointer movement.
- No infinite animations.
- No three equal feature cards.
- Exactly three cells for the Three C's bento.
- Reduced motion and reduced transparency fallbacks included.
- Mobile collapse defined for every multi-column section.
