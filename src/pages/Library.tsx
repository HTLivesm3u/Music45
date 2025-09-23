import { Heart, Clock, Download, Music } from 'lucide-react'
import { usePlayerStore, type Track } from '@/store/player-store'

export function Library() {
  const { favorites, recentlyPlayed, playTrack } = usePlayerStore()

  const handleTrackPlay = (track: Track, playlist: Track[]) => {
    playTrack(track, playlist)
  }

  const libraryItems = [
    {
      id: 'favorites',
      name: 'Liked Songs',
      description: `${favorites.length} songs`,
      icon: Heart,
      iconColor: 'text-red-500',
      tracks: favorites,
    },
    {
      id: 'recent',
      name: 'Recently Played',
      description: `${recentlyPlayed.length} songs`,
      icon: Clock,
      iconColor: 'text-primary',
      tracks: recentlyPlayed,
    },
    {
      id: 'downloads',
      name: 'Downloaded',
      description: 'Coming soon',
      icon: Download,
      iconColor: 'text-green-500',
      tracks: [],
    },
    {
      id: 'playlists',
      name: 'Your Playlists',
      description: 'Coming soon',
      icon: Music,
      iconColor: 'text-accent',
      tracks: [],
    },
  ]

  return (
    <div className="pt-20 pb-32 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your Library</h2>
        <p className="text-muted-foreground">Your music collection</p>
      </div>

      {/* Library Categories */}
      <section className="space-y-3">
        {libraryItems.map((item) => {
          const Icon = item.icon
          const hasContent = item.tracks.length > 0
          
          return (
            <div key={item.id} className="space-y-3">
              <div className="neomorph-card rounded-2xl p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-card ${item.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>

              {/* Show tracks if available */}
              {hasContent && (
                <div className="ml-4 space-y-2">
                  {item.tracks.slice(0, 5).map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackPlay(track, item.tracks)}
                      className="w-full neomorph-card rounded-xl p-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={track.image}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </button>
                  ))}
                  
                  {item.tracks.length > 5 && (
                    <button className="w-full p-3 text-center text-sm text-primary hover:text-primary/80 transition-colors">
                      View all {item.tracks.length} songs
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Stats */}
      <section className="neomorph-card rounded-2xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{favorites.length}</p>
            <p className="text-sm text-muted-foreground">Liked Songs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{recentlyPlayed.length}</p>
            <p className="text-sm text-muted-foreground">Recently Played</p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {favorites.length === 0 && recentlyPlayed.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Building Your Library</h3>
          <p className="text-muted-foreground mb-6">Like songs and explore music to see them here</p>
        </div>
      )}
    </div>
  )
}