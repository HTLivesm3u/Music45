import { Play, Pause, SkipForward, Heart, Loader2 } from 'lucide-react'
import { usePlayerStore } from '@/store/player-store'

interface MiniPlayerProps {
  onExpand: () => void
}

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const { 
    currentTrack, 
    isPlaying,
    isLoading, 
    progress,
    currentTime,
    duration,
    togglePlayPause, 
    nextTrack,
    toggleFavorite 
  } = usePlayerStore()

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className="fixed bottom-16 left-2 right-2 z-40 neomorph-card rounded-2xl p-3 cursor-pointer"
      onClick={onExpand}
    >
      {/* Progress bar */}
      <div className="progress-track h-1 mb-3">
        <div 
          className="progress-fill h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Album Art */}
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 neomorph-card relative">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="w-full h-full object-cover bg-muted"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop`
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
          {duration > 0 && (
            <p className="text-xs text-muted-foreground/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(currentTrack.id)
            }}
            className="neomorph-button p-2 rounded-xl"
            disabled={isLoading}
          >
            <Heart 
              className={`w-4 h-4 ${
                currentTrack.isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-muted-foreground'
              }`} 
            />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
            className="neomorph-button p-2 rounded-xl min-w-[36px] min-h-[36px] flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-primary" />
            ) : (
              <Play className="w-5 h-5 text-primary ml-0.5" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextTrack()
            }}
            className="neomorph-button p-2 rounded-xl"
            disabled={isLoading}
          >
            <SkipForward className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}