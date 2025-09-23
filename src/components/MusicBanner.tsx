import { useState } from 'react'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Repeat, 
  Shuffle, 
  ChevronDown,
  MoreHorizontal,
  Loader2,
  Volume2
} from 'lucide-react'
import { usePlayerStore } from '@/store/player-store'
import { Slider } from '@/components/ui/slider'

interface MusicBannerProps {
  isExpanded: boolean
  onCollapse: () => void
}

export function MusicBanner({ isExpanded, onCollapse }: MusicBannerProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  
  const { 
    currentTrack, 
    isPlaying,
    isLoading,
    progress,
    currentTime,
    duration,
    volume,
    isShuffleOn,
    repeatMode,
    togglePlayPause, 
    nextTrack,
    previousTrack,
    toggleFavorite,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    seekTo
  } = usePlayerStore()

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    seekTo(newTime)
  }

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background transition-all duration-500 ${
        isExpanded ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <button
          onClick={onCollapse}
          className="neomorph-button p-2 rounded-xl"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Playing from</p>
          <p className="text-sm font-medium text-foreground">Search Results</p>
        </div>
        
        <button className="neomorph-button p-2 rounded-xl">
          <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Album Art */}
      <div className="px-12 py-8">
        <div className="aspect-square max-w-sm mx-auto neomorph-card rounded-3xl overflow-hidden relative">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="w-full h-full object-cover bg-muted"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop`
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 py-4 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2 truncate">
          {currentTrack.title}
        </h1>
        <p className="text-lg text-muted-foreground truncate">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Section */}
      <div className="px-8 py-4">
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={isLoading || duration === 0}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-center gap-6">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`neomorph-button p-3 rounded-xl transition-colors ${
              isShuffleOn ? 'text-primary' : 'text-muted-foreground'
            }`}
            disabled={isLoading}
          >
            <Shuffle className="w-6 h-6" />
          </button>

          {/* Previous */}
          <button
            onClick={previousTrack}
            className="neomorph-button p-4 rounded-xl"
            disabled={isLoading}
          >
            <SkipBack className="w-7 h-7 text-muted-foreground" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="neomorph-button p-6 rounded-full bg-primary hover:bg-primary/90 transition-colors min-w-[72px] min-h-[72px] flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="neomorph-button p-4 rounded-xl"
            disabled={isLoading}
          >
            <SkipForward className="w-7 h-7 text-muted-foreground" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`neomorph-button p-3 rounded-xl transition-colors ${
              repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground'
            }`}
            disabled={isLoading}
          >
            <Repeat className="w-6 h-6" />
            {repeatMode === 'one' && (
              <span className="text-xs font-bold absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="neomorph-button p-3 rounded-xl"
            disabled={isLoading}
          >
            <Heart 
              className={`w-6 h-6 ${
                currentTrack.isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-muted-foreground'
              }`} 
            />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="neomorph-button p-3 rounded-xl"
            >
              <Volume2 className="w-6 h-6 text-muted-foreground" />
            </button>
            
            {showVolumeSlider && (
              <div className="flex items-center gap-2 min-w-[120px]">
                <Slider
                  value={[volume * 100]}
                  onValueChange={([value]) => setVolume(value / 100)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-[32px]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quality Indicator */}
      <div className="px-8 py-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground/70">
            Quality: High • Streaming from Saavn
          </p>
        </div>
      </div>
    </div>
  )
}