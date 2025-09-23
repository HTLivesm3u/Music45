import { useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import { Navigation } from '@/components/Navigation'
import { MiniPlayer } from '@/components/MiniPlayer'
import { MusicBanner } from '@/components/MusicBanner'
import { SettingsSheet } from '@/components/SettingsSheet'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Library } from '@/pages/Library'
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home />
      case 'search':
        return <Search />
      case 'library':
        return <Library />
      default:
        return <Home />
    }
  }

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          {/* Navigation */}
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />

          {/* Main Content */}
          <main className="relative">
            {renderActiveTab()}
          </main>

          {/* Mini Player */}
          <MiniPlayer onExpand={() => setIsPlayerExpanded(true)} />

          {/* Expanded Music Banner */}
          <MusicBanner 
            isExpanded={isPlayerExpanded}
            onCollapse={() => setIsPlayerExpanded(false)}
          />

          {/* Settings Sheet */}
          <SettingsSheet
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />

          <Toaster />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App