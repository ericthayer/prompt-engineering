import { Circle, MessageSquareText, RefreshCw, SearchCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

const nodeIcons: LucideIcon[] = [Circle, MessageSquareText, SearchCheck, RefreshCw];

export function PromptChainingSection() {
  const content = promptingDeck.chaining;

  return (
    <DeckSection id="chaining" labelledBy="chaining-title">
      <div className="flex flex-col gap-11 md:gap-16">
        <SlideReveal className="flex max-w-4xl flex-col gap-5">
          <h2 id="chaining-title" className="deck-section-title font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
          <p className="deck-body max-w-[65ch] leading-relaxed text-[var(--deck-muted)]">
            {content.description}
          </p>
        </SlideReveal>

        <ol className="relative grid gap-4 md:grid-cols-4 md:gap-3">
          <div className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-[var(--deck-line)] md:block" aria-hidden="true" />
          {content.items.map((item, index) => {
            const Icon = nodeIcons[index];
            return (
              <SlideReveal key={item} delay={index * 0.08}>
                <li className="relative grid min-h-24 grid-cols-[3.5rem_1fr] items-center gap-4 rounded-2xl border border-[var(--deck-line)] bg-[rgba(15,16,24,0.82)] p-4 md:flex md:min-h-48 md:flex-col md:items-start md:justify-between md:p-5">
                  <span className="relative z-[1] inline-flex size-14 items-center justify-center rounded-full border border-[var(--deck-accent)] bg-[var(--deck-surface-strong)] text-[var(--deck-accent)]">
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
                  </span>
                  <span className="font-semibold leading-snug text-[var(--deck-text)] md:text-lg">{item}</span>
                </li>
              </SlideReveal>
            );
          })}
        </ol>
      </div>
    </DeckSection>
  );
}
