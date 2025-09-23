import { useState, useEffect, useCallback } from 'react'
import { Search as SearchIcon, Music, Disc, User, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { usePlayerStore, type Track } from '@/store/player-store'
import { SaavnAPI } from '@/lib/api.js'

const quickSearchCategories = [
  { id: 'pop', name: 'Bollywood', icon: Music, color: 'from-pink-500 to-purple-500' },
  { id: 'rock', name: 'Punjabi', icon: Disc, color: 'from-red-500 to-orange-500' },
  { id: 'electronic', name: 'Tamil', icon: Music, color: 'from-blue-500 to-cyan-500' },
  { id: 'jazz', name: 'Telugu', icon: User, color: 'from-yellow-500 to-green-500' },
]

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const { playTrack } = usePlayerStore()

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.trim().length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      setError('')
      
      try {
        const results = await SaavnAPI.search(query, 'songs', 20)
        
        if (results.data && results.data.results) {
          const formattedResults: Track[] = results.data.results.map((song: any) => ({
            ...SaavnAPI.formatSong(song),
            isFavorite: false
          }))
          setSearchResults(formattedResults)
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to search. Please try again.')
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTrackPlay = async (track: Track) => {
    try {
      // Get full song details with download URL if needed
      if (!track.url || track.url === '') {
        const songDetails = await SaavnAPI.getSong(track.id)
        if (songDetails && songDetails.data && songDetails.data.length > 0) {
          const fullTrack = {
            ...SaavnAPI.formatSong(songDetails.data[0]),
            isFavorite: false
          }
          await playTrack(fullTrack, searchResults.length > 0 ? searchResults : [fullTrack])
          return
        }
      }
      
      // Use the track as-is
      await playTrack(track, searchResults.length > 0 ? searchResults : [track])
    } catch (error) {
      console.error('Error playing track:', error)
      // Fallback to original track data
      await playTrack(track, searchResults.length > 0 ? searchResults : [track])
    }
  }

  const handleCategorySearch = (category: string) => {
    setSearchQuery(category)
  }

  return (
    <div className="pt-20 pb-32 px-4 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Search</h2>
        
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="neomorph-inset pl-10 pr-12 py-3 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
          )}
        </div>
        
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {isSearching ? 'Searching...' : `Results for "${searchQuery}" (${searchResults.length})`}
          </h3>
          
          {isSearching ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="neomorph-card rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((track) => (
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
                    {track.album && track.album !== 'Unknown Album' && (
                      <p className="text-xs text-muted-foreground/70 truncate">{track.album}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="text-center py-8">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Try different keywords</p>
            </div>
          ) : null}
        </section>
      )}

      {/* Browse Categories */}
      {!searchQuery && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Browse Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickSearchCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySearch(category.name)}
                  className={`neomorph-card rounded-2xl p-4 text-left bg-gradient-to-br ${category.color} relative overflow-hidden hover:scale-[1.02] transition-transform`}
                >
                  <div className="relative z-10">
                    <Icon className="w-6 h-6 text-white mb-2" />
                    <p className="font-semibold text-white">{category.name}</p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/20 rounded-full" />
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Quick Access Message */}
      {!searchQuery && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Discover Music</h3>
          <div className="neomorph-card rounded-2xl p-6 text-center">
            <Music className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium">Search for your favorite songs</p>
            <p className="text-muted-foreground text-sm mt-1">
              Discover millions of songs from Bollywood, regional, and international artists
            </p>
          </div>
        </section>
      )}
    </div>
  )
}