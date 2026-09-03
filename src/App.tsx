import { useState } from 'react'
import { Hero } from './components/Hero/Hero'
import { CloudSection } from './components/CloudSection/CloudSection'
import { DigitalAssetsSection } from './components/DigitalAssetsSection/DigitalAssetsSection'
import { ContactBanner } from './components/ContactBanner/ContactBanner'
import { AppFooter } from './components/AppFooter/AppFooter'
import { InteractiveJourney } from './components/InteractiveJourney/InteractiveJourney'

function App() {
  const [view, setView] = useState<'landing' | 'journey'>('landing');

  if (view === 'journey') {
    return <InteractiveJourney onExit={() => setView('landing')} />;
  }

  return (
    <main className="h-screen w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      <Hero />
      <CloudSection />
      <DigitalAssetsSection />
      <ContactBanner />
      <AppFooter />
    </main>
  )
}

export default App
