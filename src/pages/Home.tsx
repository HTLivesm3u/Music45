import { useEffect, useState } from 'react'
import { Clock, TrendingUp, Star, Loader2 } from 'lucide-react'
import { usePlayerStore, type Track } from '@/store/player-store'
import { SaavnAPI } from '@/lib/api.js'

interface Album {
  id: string
  title: string
  artist: string
  image: string
  songCount?: number
  year?: number
}

export function Home() {
  const [greeting, setGreeting] = useState('')
  const [trendingAlbums, setTrendingAlbums] = useState<Album[]>([])
  const [popularTracks, setPopularTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { recentlyPlayed, playTrack } = usePlayerStore()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true)
      try {
        // Load trending charts/modules
        const homeData = await SaavnAPI.getHomeData()
        
        if (homeData.data && homeData.data.length > 0) {
          // Extract albums and playlists from the modules
          const albums: Album[] = []
          const tracks: Track[] = []
          
          homeData.data.forEach((module: any) => {
            // Process albums
            if (module.albums && module.albums.length > 0) {
              const moduleAlbums = module.albums.slice(0, 6).map(SaavnAPI.formatAlbum)
              albums.push(...moduleAlbums)
            }
            
            // Process playlists as albums
            if (module.playlists && module.playlists.length > 0) {
              const playlistAlbums = module.playlists.slice(0, 4).map((playlist: any) => ({
                id: playlist.id,
                title: playlist.name || playlist.title,
                artist: 'Various Artists',
                image: playlist.image?.[2]?.url || playlist.image?.[1]?.url || playlist.image?.[0]?.url || '',
                songCount: playlist.songCount || 0,
                year: new Date().getFullYear()
              }))
              albums.push(...playlistAlbums)
            }
          })
          
          // Get some popular songs for the week
          try {
            const searchResults = await SaavnAPI.search('bollywood hits', 'songs', 10)
            if (searchResults.data && searchResults.data.results) {
              const formattedTracks = searchResults.data.results.slice(0, 8).map((song: any) => ({
                ...SaavnAPI.formatSong(song),
                isFavorite: false
              }))
              tracks.push(...formattedTracks)
            }
          } catch (error) {
            console.error('Error loading popular tracks:', error)
          }
          
          setTrendingAlbums(albums.slice(0, 10))
          setPopularTracks(tracks)
        }
      } catch (error) {
        console.error('Error loading home data:', error)
        // Fallback to empty arrays
        setTrendingAlbums([])
        setPopularTracks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const handleAlbumPlay = async (album: Album) => {
    try {
      // Get album details to play first track
      const albumDetails = await SaavnAPI.getAlbum(album.id)
      if (albumDetails && albumDetails.data && albumDetails.data.songs && albumDetails.data.songs.length > 0) {
        const tracks = albumDetails.data.songs.map((song: any) => ({
          ...SaavnAPI.formatSong(song),
          isFavorite: false
        }))
        await playTrack(tracks[0], tracks)
      }
    } catch (error) {
      console.error('Error playing album:', error)
    }
  }

  const handleTrackPlay = async (track: Track) => {
    try {
      // Get full song details if needed
      if (!track.url || track.url === '') {
        const songDetails = await SaavnAPI.getSong(track.id)
        if (songDetails && songDetails.data && songDetails.data.length > 0) {
          const fullTrack = {
            ...SaavnAPI.formatSong(songDetails.data[0]),
            isFavorite: false
          }
          await playTrack(fullTrack, popularTracks.length > 0 ? popularTracks : [fullTrack])
          return
        }
      }
      
      await playTrack(track, popularTracks.length > 0 ? popularTracks : [track])
    } catch (error) {
      console.error('Error playing track:', error)
      await playTrack(track, popularTracks.length > 0 ? popularTracks : [track])
    }
  }

  return (
    <div className="pt-20 pb-32 px-4 space-y-8">
      {/* Greeting */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{greeting}</h2>
        <p className="text-muted-foreground">What would you like to listen to?</p>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recently Played</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {recentlyPlayed.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="flex-shrink-0 w-32 neomorph-card rounded-2xl p-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover bg-muted"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
                    }}
                  />
                </div>
                <p className="font-medium text-sm text-foreground truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Trending Albums */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Trending Albums</h3>
        </div>
        
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-40 neomorph-card rounded-2xl p-4">
                <div className="w-full aspect-square rounded-xl bg-muted animate-pulse mb-3" />
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : trendingAlbums.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
            {trendingAlbums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumPlay(album)}
                className="flex-shrink-0 w-40 neomorph-card rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                  <img
                    src={album.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                    alt={album.title}
                    className="w-full h-full object-cover bg-muted"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
                    }}
                  />
                </div>
                <h4 className="font-semibold text-sm text-foreground truncate">{album.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
                {album.year && (
                  <p className="text-xs text-muted-foreground/70">{album.year}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to load trending albums</p>
          </div>
        )}
      </section>

      {/* Popular Tracks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-foreground">Popular This Week</h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="neomorph-card rounded-2xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : popularTracks.length > 0 ? (
          <div className="space-y-2">
            {popularTracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handleTrackPlay(track)}
                className="w-full neomorph-card rounded-2xl p-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={track.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                    alt={track.title}
                    className="w-full h-full object-cover bg-muted"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-primary font-bold">#{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to load popular tracks</p>
          </div>
        )}
      </section>
    </div>
  )
}