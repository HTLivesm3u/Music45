import { Home, Search, Library, Settings } from 'lucide-react'
import { useState } from 'react'

interface NavigationProps {
  activeTab: 'home' | 'search' | 'library'
  onTabChange: (tab: 'home' | 'search' | 'library') => void
  onSettingsClick: () => void
}

export function Navigation({ activeTab, onTabChange, onSettingsClick }: NavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'library' as const, icon: Library, label: 'Library' },
  ]

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MusicStream
            </h1>
          </div>
          <button
            onClick={onSettingsClick}
            className="neomorph-button p-2 rounded-xl"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}