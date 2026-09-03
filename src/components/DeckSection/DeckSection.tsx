import type { ReactNode } from 'react';

interface DeckSectionProps {
  id: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

export function DeckSection({ id, labelledBy, className = '', children }: DeckSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-deck-section
      className={`deck-section relative isolate flex min-h-[100dvh] items-center overflow-hidden px-4 py-16 sm:px-6 md:px-10 lg:px-16 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
