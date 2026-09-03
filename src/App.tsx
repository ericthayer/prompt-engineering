import { ContextDriftSection } from './components/ContextDriftSection/ContextDriftSection'
import { ContextWindowSection } from './components/ContextWindowSection/ContextWindowSection'
import { DeckBackdrop } from './components/DeckBackdrop/DeckBackdrop'
import { DeckHashNavigation } from './components/DeckSection/DeckHashNavigation'
import { EvaluationChecklist } from './components/EvaluationChecklist/EvaluationChecklist'
import { IterationSection } from './components/IterationSection/IterationSection'
import { KeyTakeawaysSection } from './components/KeyTakeawaysSection/KeyTakeawaysSection'
import { PowerPhrasesSection } from './components/PowerPhrasesSection/PowerPhrasesSection'
import { PromptChainingSection } from './components/PromptChainingSection/PromptChainingSection'
import { PromptingHero } from './components/PromptingHero/PromptingHero'
import { ThreeCsSection } from './components/ThreeCsSection/ThreeCsSection'

function App() {
  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[var(--deck-bg)] text-[var(--deck-text)]">
      <DeckBackdrop />
      <DeckHashNavigation />
      <main
        className="relative z-[1] h-[100dvh] overflow-y-auto"
        aria-label="AI prompting fundamentals presentation"
      >
        <PromptingHero />
        <ThreeCsSection />
        <PowerPhrasesSection />
        <PromptChainingSection />
        <ContextWindowSection />
        <ContextDriftSection />
        <IterationSection />
        <KeyTakeawaysSection />
        <EvaluationChecklist />
      </main>
    </div>
  )
}

export default App
