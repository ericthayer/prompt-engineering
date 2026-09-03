import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { promptingDeck, type EvaluationKey } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

const initialChecks: Record<EvaluationKey, boolean> = {
  accuracy: false,
  bias: false,
  relevancy: false,
  consistency: false,
};

export function EvaluationChecklist() {
  const content = promptingDeck.evaluation;
  const [checks, setChecks] = useState(initialChecks);
  const checkedCount = Object.values(checks).filter(Boolean).length;
  const isComplete = checkedCount === content.items.length;

  const toggleCheck = (key: EvaluationKey) => {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  };

  const resetChecks = () => setChecks(initialChecks);

  return (
    <DeckSection id="evaluation" labelledBy="evaluation-title">
      <SlideReveal className="mx-auto max-w-5xl">
        <div className="deck-glass rounded-2xl p-5 sm:p-8 lg:p-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h2 id="evaluation-title" className="deck-section-title font-bold leading-[0.98] tracking-[-0.04em]">
              {content.title}
            </h2>
            <p className="deck-body max-w-[65ch] leading-relaxed text-[var(--deck-muted)]">
              {content.description}
            </p>
          </div>

          <fieldset className="mt-8 grid gap-3 md:grid-cols-2">
            <legend className="sr-only">AI output evaluation criteria</legend>
            {content.items.map((item) => (
              <label
                key={item.key}
                className="group relative grid min-h-20 cursor-pointer grid-cols-[2.75rem_1fr] items-center gap-4 rounded-xl border border-[var(--deck-line)] bg-[rgba(9,10,15,0.56)] p-4 transition-colors hover:border-[var(--deck-accent)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--deck-focus)]"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checks[item.key]}
                  onChange={() => toggleCheck(item.key)}
                />
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--deck-line)] bg-[var(--deck-surface-strong)] text-transparent transition-colors peer-checked:border-[var(--deck-accent)] peer-checked:bg-[var(--deck-accent)] peer-checked:text-[var(--deck-bg)]">
                  <Check aria-hidden="true" className="size-5" strokeWidth={2.2} />
                </span>
                <span>
                  <strong className="text-[var(--deck-text)]">{item.title}:</strong>{' '}
                  <span className="leading-relaxed text-[var(--deck-muted)]">{item.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[var(--deck-accent)]" aria-live="polite">
              {isComplete ? 'Evaluation complete. Review each answer before sharing the output.' : `${checkedCount} of ${content.items.length} checks complete`}
            </p>
            {checkedCount > 0 ? (
              <button
                type="button"
                onClick={resetChecks}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[var(--deck-muted)] transition-colors hover:bg-white/5 hover:text-[var(--deck-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--deck-focus)] active:translate-y-px"
              >
                <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Reset checklist
              </button>
            ) : null}
          </div>
        </div>
      </SlideReveal>
    </DeckSection>
  );
}
