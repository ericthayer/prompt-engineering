import { MessageSquarePlus, Plus, ShieldAlert } from 'lucide-react';
import { promptingDeck } from '../../content/promptingDeck';
import { DeckSection } from '../DeckSection/DeckSection';
import { SlideReveal } from '../DeckSection/SlideReveal';

export function ContextWindowSection() {
  const content = promptingDeck.contextWindow;

  return (
    <DeckSection id="context-window" labelledBy="context-window-title">
      <SlideReveal>
        <aside className="relative overflow-hidden rounded-2xl border border-[var(--deck-accent)] bg-[var(--deck-danger-surface)] p-6 shadow-[inset_5px_0_0_var(--deck-accent)] sm:p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex size-14 items-center justify-center rounded-xl border border-[var(--deck-line)] bg-[rgba(9,10,15,0.56)] text-[var(--deck-accent)]">
                <ShieldAlert aria-hidden="true" className="size-7" strokeWidth={1.7} />
              </span>
              <h2 id="context-window-title" className="deck-section-title max-w-4xl font-bold leading-[0.98] tracking-[-0.04em]">
                {content.title}
              </h2>
              <p className="deck-body max-w-[65ch] leading-relaxed text-[var(--deck-muted)]">
                {content.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center" aria-label="Separate chats for separate topics">
              <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-[var(--deck-line)] bg-[rgba(9,10,15,0.68)] p-5">
                <MessageSquarePlus aria-hidden="true" className="size-6 text-[var(--deck-subtle)]" strokeWidth={1.7} />
                <span className="font-semibold text-[var(--deck-muted)]">Current topic</span>
              </div>
              <Plus aria-hidden="true" className="mx-auto size-5 text-[var(--deck-accent)]" strokeWidth={1.8} />
              <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-[var(--deck-accent)] bg-[var(--deck-surface-strong)] p-5">
                <MessageSquarePlus aria-hidden="true" className="size-6 text-[var(--deck-accent)]" strokeWidth={1.7} />
                <span className="font-semibold text-[var(--deck-text)]">New topic, new chat</span>
              </div>
            </div>
          </div>
        </aside>
      </SlideReveal>
    </DeckSection>
  );
}
