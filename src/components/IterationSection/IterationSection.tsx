import { ChevronDown, RefreshCw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

export function IterationSection() {
  const content = promptingDeck.iteration;
  const reduceMotion = useReducedMotion();

  return (
    <DeckSection id="iteration" labelledBy="iteration-title">
      <div className="flex flex-col gap-10 text-center md:gap-14">
        <SlideReveal className="mx-auto flex max-w-4xl flex-col items-center gap-5">
          <h2 id="iteration-title" className="deck-section-title font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
          <p className="deck-body max-w-[65ch] leading-relaxed text-[var(--deck-muted)]">
            {content.description}
          </p>
        </SlideReveal>

        <div className="relative mx-auto w-full max-w-6xl">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 hidden size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--deck-line)] bg-[conic-gradient(from_225deg,transparent_0deg,var(--deck-accent)_95deg,transparent_175deg,var(--deck-accent)_270deg,transparent_360deg)] p-px opacity-35 md:block lg:size-80"
            initial={reduceMotion ? false : { opacity: 0, rotate: -12, scale: 0.92 }}
            whileInView={{ opacity: 0.35, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="size-full rounded-full bg-[var(--deck-bg)]" />
          </motion.div>
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-[1] hidden size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--deck-accent)] bg-[var(--deck-surface-strong)] text-[var(--deck-accent)] md:flex">
            <RefreshCw aria-hidden="true" className="size-7" strokeWidth={1.6} />
          </div>

          <ol className="relative z-[2] grid gap-3 text-left md:grid-cols-3 md:gap-8">
            {content.items.map((item, index) => (
              <SlideReveal key={item.title} delay={index * 0.09}>
                <li className={`rounded-2xl border border-[var(--deck-line)] bg-[rgba(17,18,27,0.94)] p-6 md:min-h-52 ${index === 1 ? 'md:translate-y-24' : ''}`}>
                  <h3 className="deck-card-title font-bold tracking-[-0.025em] text-[var(--deck-text)]">{item.title}</h3>
                  <p className="deck-body mt-3 leading-relaxed text-[var(--deck-muted)]">{item.description}</p>
                  {index < content.items.length - 1 ? (
                    <ChevronDown aria-hidden="true" className="mx-auto mt-5 size-5 text-[var(--deck-accent)] md:hidden" />
                  ) : null}
                </li>
              </SlideReveal>
            ))}
          </ol>
        </div>
      </div>
    </DeckSection>
  );
}
