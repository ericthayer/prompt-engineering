import { BookOpenCheck, Focus, ListChecks } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

const icons: LucideIcon[] = [BookOpenCheck, Focus, ListChecks];
const desktopPositions = [
  'md:col-span-5 md:col-start-1 md:[grid-row:1]',
  'md:col-span-5 md:col-start-5 md:[grid-row:1] md:translate-y-10',
  'md:col-span-4 md:col-start-9 md:[grid-row:1] md:translate-y-20',
];

export function ContextDriftSection() {
  const content = promptingDeck.drift;

  return (
    <DeckSection id="drift" labelledBy="drift-title">
      <div className="flex flex-col gap-10 md:gap-14">
        <SlideReveal>
          <h2 id="drift-title" className="deck-section-title max-w-4xl font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
        </SlideReveal>

        <div className="deck-horizontal-rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-12 md:overflow-visible md:px-0 md:pb-20">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <SlideReveal
                key={item.title}
                className={`min-w-[84vw] snap-center sm:min-w-[70vw] md:min-w-0 ${desktopPositions[index]}`}
                delay={index * 0.08}
                distance={18 + index * 8}
              >
                <article className="flex min-h-64 flex-col justify-between gap-8 rounded-2xl border border-[var(--deck-line)] bg-[rgba(19,20,29,0.94)] p-6 shadow-[0_24px_70px_rgba(7,5,13,0.28)] md:p-7">
                  <Icon aria-hidden="true" className="size-8 text-[var(--deck-accent)]" strokeWidth={1.6} />
                  <div className="flex flex-col gap-3">
                    <h3 className="deck-card-title font-bold tracking-[-0.025em]">{item.title}</h3>
                    <p className="deck-body leading-relaxed text-[var(--deck-muted)]">{item.description}</p>
                  </div>
                </article>
              </SlideReveal>
            );
          })}
        </div>
      </div>
    </DeckSection>
  );
}
