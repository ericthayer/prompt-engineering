import { ArrowRight } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

export function PromptingHero() {
  const content = promptingDeck.hero;

  return (
    <DeckSection id="intro" labelledBy="intro-title" className="text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,10,15,0.22)_0%,rgba(9,10,15,0.68)_54%,rgba(9,10,15,0.88)_100%)]" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-7">
        <SlideReveal>
          <h1
            id="intro-title"
            className="deck-hero-title bg-linear-to-r from-[var(--deck-text)] via-[var(--deck-text)] to-[var(--deck-accent)] bg-clip-text font-black leading-[0.92] tracking-[-0.055em] text-transparent"
          >
            {content.title}
          </h1>
        </SlideReveal>
        <SlideReveal delay={0.09}>
          <p className="deck-body mx-auto max-w-3xl text-balance leading-relaxed text-[var(--deck-muted)]">
            {content.description}
          </p>
        </SlideReveal>
        <SlideReveal delay={0.17}>
          <div className="deck-glass pointer-events-auto rounded-xl p-1.5">
            <a
              href="#framework"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--deck-text)] px-6 py-3 font-bold text-[var(--deck-bg)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--deck-focus)] active:translate-y-px"
            >
              {content.cta}
              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
            </a>
          </div>
        </SlideReveal>
      </div>
    </DeckSection>
  );
}
