import { Check } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

export function KeyTakeawaysSection() {
  const content = promptingDeck.takeaways;

  return (
    <DeckSection id="takeaways" labelledBy="takeaways-title">
      <SlideReveal className="mx-auto max-w-5xl rounded-2xl bg-[linear-gradient(135deg,rgba(200,167,255,0.72),rgba(243,241,248,0.3),rgba(200,167,255,0.58))] p-px">
        <div className="deck-glass rounded-2xl bg-[rgba(12,13,20,0.96)] p-6 sm:p-8 lg:p-12">
          <h2 id="takeaways-title" className="deck-section-title text-center font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
          <ul className="mt-9 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {content.items.map((item, index) => (
              <li key={item.title} className={`grid grid-cols-[2.5rem_1fr] gap-4 ${index === 4 ? 'md:col-span-2 md:max-w-2xl' : ''}`}>
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--deck-accent)] text-[var(--deck-bg)]">
                  <Check aria-hidden="true" className="size-5" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-bold text-[var(--deck-text)]">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-[var(--deck-muted)]">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SlideReveal>
    </DeckSection>
  );
}
