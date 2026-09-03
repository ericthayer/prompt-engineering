import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

type CopyState = 'idle' | 'copied' | 'error';

export function PowerPhrasesSection() {
  const content = promptingDeck.powerPhrases;
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | null>(null);
  const [beforeWhat, afterWhat = ''] = content.description.split('what');
  const [between, afterHow = ''] = afterWhat.split('how');

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(content.example);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2200);
  };

  const statusMessage = copyState === 'copied'
    ? 'Prompt copied.'
    : copyState === 'error'
      ? 'Copy failed. Select the prompt text and copy it manually.'
      : '';

  return (
    <DeckSection id="precision" labelledBy="precision-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SlideReveal className="flex flex-col gap-6">
          <h2 id="precision-title" className="deck-section-title font-bold leading-[0.98] tracking-[-0.04em]">
            {content.title}
          </h2>
          <p className="deck-body max-w-[65ch] leading-relaxed text-[var(--deck-muted)]">
            {beforeWhat}<em className="font-semibold text-[var(--deck-text)]">what</em>{between}
            <em className="font-semibold text-[var(--deck-text)]">how</em>{afterHow}
          </p>
        </SlideReveal>

        <SlideReveal delay={0.1}>
          <div className="deck-glass relative rounded-2xl p-5 sm:p-7">
            <div className="mb-7 flex items-center justify-between gap-4">
              <span className="font-mono text-sm font-semibold text-[var(--deck-accent)]">Precision prompt</span>
              <button
                type="button"
                onClick={copyPrompt}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--deck-line)] bg-[rgba(9,10,15,0.62)] px-4 py-2 text-sm font-semibold text-[var(--deck-text)] transition-colors hover:border-[var(--deck-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--deck-focus)] active:translate-y-px"
                aria-label="Copy example prompt"
              >
                {copyState === 'copied' ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
                {copyState === 'copied' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              className="whitespace-pre-wrap break-words border-l-2 border-[var(--deck-accent)] pl-5 font-mono text-base leading-relaxed text-[var(--deck-text)] sm:text-lg"
              aria-label="Example precision prompt"
            ><code>{content.example}</code></pre>
            <p className="sr-only" aria-live="polite">{statusMessage}</p>
          </div>
        </SlideReveal>
      </div>
    </DeckSection>
  );
}
