import { X, Volume2, Wifi, Download, Palette } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { usePlayerStore } from '@/store/player-store'
import { useState } from 'react'

interface SettingsSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { volume, setVolume, audioQuality, setAudioQuality } = usePlayerStore()

  const qualityOptions = [
    { value: 'low' as const, label: 'Low (96 kbps)', description: 'Save data' },
    { value: 'medium' as const, label: 'Medium (160 kbps)', description: 'Good quality' },
    { value: 'high' as const, label: 'High (320 kbps)', description: 'Best quality' },
    { value: 'auto' as const, label: 'Auto', description: 'Adapts to connection' },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-0 bg-card">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-foreground">Settings</SheetTitle>
            <button
              onClick={onClose}
              className="neomorph-button p-2 rounded-xl"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Volume Control */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Volume</h3>
            </div>
            <div className="px-2">
              <Slider
                value={[volume * 100]}
                onValueChange={([value]) => setVolume(value / 100)}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span>{Math.round(volume * 100)}%</span>
                <span>100%</span>
              </div>
            </div>
          </section>

          {/* Audio Quality */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Audio Quality</h3>
            </div>
            <div className="space-y-2">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAudioQuality(option.value)}
                  className={`w-full neomorph-card rounded-xl p-4 text-left transition-all ${
                    audioQuality === option.value
                      ? 'bg-primary/10 border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    {audioQuality === option.value && (
                      <div className="w-4 h-4 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Other Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Downloads</h3>
            </div>
            <div className="neomorph-card rounded-xl p-4 opacity-60">
              <p className="text-foreground font-medium">Download for offline listening</p>
              <p className="text-sm text-muted-foreground">Coming soon in future updates</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground">Appearance</h3>
            </div>
            <div className="neomorph-card rounded-xl p-4 opacity-60">
              <p className="text-foreground font-medium">Theme customization</p>
              <p className="text-sm text-muted-foreground">Light mode and color themes coming soon</p>
            </div>
          </section>

          {/* App Info */}
          <section className="neomorph-card rounded-xl p-4 text-center space-y-2">
            <h4 className="font-semibold text-foreground">MusicStream</h4>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              Premium music streaming experience
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}