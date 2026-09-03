import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

const cardStyles = [
  'md:col-span-7 md:row-span-2 bg-[linear-gradient(145deg,rgba(200,167,255,0.16),rgba(20,21,30,0.78))]',
  'md:col-span-5 bg-[linear-gradient(135deg,rgba(200,167,255,0.24),rgba(36,29,51,0.8))]',
  'md:col-span-5 bg-[rgba(16,17,25,0.86)]',
];

export function ThreeCsSection() {
  const content = promptingDeck.threeCs;

  return (
    <DeckSection id="framework" labelledBy="framework-title">
      <div className="flex flex-col gap-9 md:gap-12">
        <SlideReveal>
          <h2 id="framework-title" className="deck-section-title max-w-4xl font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
        </SlideReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
          {content.items.map((item, index) => (
            <SlideReveal key={item.title} className={cardStyles[index]} delay={index * 0.07}>
              <article className="group relative flex h-full min-h-44 overflow-hidden rounded-2xl border border-[var(--deck-line)] p-6 transition-transform duration-300 hover:-translate-y-1 md:min-h-52 md:p-8">
                <span
                  className="pointer-events-none absolute -right-3 -bottom-8 select-none text-[7rem] font-black leading-none text-[var(--deck-accent)] opacity-[0.055] md:text-[10rem]"
                  aria-hidden="true"
                >
                  {item.title.split(' ')[1]}
                </span>
                <div className="relative flex max-w-xl flex-col justify-end gap-3">
                  <h3 className="deck-card-title font-bold tracking-[-0.025em] text-[var(--deck-text)]">
                    {item.title}
                  </h3>
                  <p className="deck-body max-w-[52ch] leading-relaxed text-[var(--deck-muted)]">
                    {item.description}
                  </p>
                </div>
              </article>
            </SlideReveal>
          ))}
        </div>
      </div>
    </DeckSection>
  );
}
