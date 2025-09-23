import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { audioPlayer } from '../lib/audio-player.js'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  image: string
  url: string
  isFavorite: boolean
  year?: number
}

export type AudioQuality = 'low' | 'medium' | 'high' | 'auto'
export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
  // Current playback
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  
  // Queue management
  queue: Track[]
  currentIndex: number
  
  // Shuffle & repeat
  isShuffleOn: boolean
  repeatMode: RepeatMode
  
  // Audio quality
  audioQuality: AudioQuality
  
  // Favorites & history
  favorites: Track[]
  recentlyPlayed: Track[]
  
  // Actions
  setCurrentTrack: (track: Track) => void
  togglePlayPause: () => Promise<void>
  setProgress: (progress: number) => void
  setCurrentTime: (time: number) => void
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleFavorite: (trackId: string) => void
  addToQueue: (tracks: Track[]) => void
  playTrack: (track: Track, queue?: Track[]) => Promise<void>
  updateFromAudioPlayer: (audioState: any) => void
  setAudioQuality: (quality: AudioQuality) => void
}

// Initialize audio player listener
let storeInstance: any = null

const setupAudioPlayerListener = (store: any) => {
  if (storeInstance === store) return // Already set up
  storeInstance = store

  audioPlayer.addListener((event, data, audioState) => {
    const state = store.getState()
    
    switch (event) {
      case 'play':
        store.setState({ isPlaying: true, isLoading: false })
        break
      case 'pause':
        store.setState({ isPlaying: false })
        break
      case 'timeUpdate':
        store.setState({ 
          currentTime: audioState.currentTime,
          progress: audioState.progress 
        })
        break
      case 'metadataLoaded':
        store.setState({ 
          duration: audioState.duration,
          isLoading: false 
        })
        break
      case 'loading':
        store.setState({ isLoading: true })
        break
      case 'ended':
        store.setState({ isPlaying: false })
        // Auto play next track
        state.nextTrack()
        break
      case 'error':
        store.setState({ isPlaying: false, isLoading: false })
        console.error('Audio playback error:', data)
        break
    }
  })
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => {
      const store = {
        // Initial state
        currentTrack: null,
        isPlaying: false,
        progress: 0,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isLoading: false,
        queue: [],
        currentIndex: 0,
        isShuffleOn: false,
        repeatMode: 'off' as RepeatMode,
        audioQuality: 'auto' as AudioQuality,
        favorites: [],
        recentlyPlayed: [],

        // Actions
        setCurrentTrack: (track: Track) => {
          set({ currentTrack: track })
          
          // Add to recently played (avoid duplicates)
          const { recentlyPlayed } = get()
          const filtered = recentlyPlayed.filter(t => t.id !== track.id)
          set({
            recentlyPlayed: [track, ...filtered].slice(0, 20) // Keep last 20
          })
        },

        togglePlayPause: async () => {
          const { currentTrack, isPlaying } = get()
          
          if (!currentTrack) return
          
          if (isPlaying) {
            audioPlayer.pause()
          } else {
            if (audioPlayer.currentTrack?.id !== currentTrack.id) {
              await audioPlayer.loadTrack(currentTrack)
            }
            await audioPlayer.play()
          }
        },

        setProgress: (progress: number) => set({ progress }),

        setCurrentTime: (currentTime: number) => set({ currentTime }),

        seekTo: (time: number) => {
          audioPlayer.seekTo(time)
        },

        nextTrack: async () => {
          const { queue, currentIndex, repeatMode, isShuffleOn } = get()
          if (queue.length === 0) return

          let nextIndex = currentIndex + 1

          if (repeatMode === 'one') {
            nextIndex = currentIndex
          } else if (nextIndex >= queue.length) {
            nextIndex = repeatMode === 'all' ? 0 : currentIndex
          }

          if (isShuffleOn && repeatMode !== 'one') {
            nextIndex = Math.floor(Math.random() * queue.length)
          }

          const nextTrack = queue[nextIndex]
          if (nextTrack) {
            set({
              currentIndex: nextIndex,
              currentTrack: nextTrack,
              progress: 0,
              currentTime: 0,
              isLoading: true
            })

            await audioPlayer.loadTrack(nextTrack)
            await audioPlayer.play()
          }
        },

        previousTrack: async () => {
          const { queue, currentIndex } = get()
          if (queue.length === 0) return

          const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1
          const prevTrack = queue[prevIndex]
          
          if (prevTrack) {
            set({
              currentIndex: prevIndex,
              currentTrack: prevTrack,
              progress: 0,
              currentTime: 0,
              isLoading: true
            })

            await audioPlayer.loadTrack(prevTrack)
            await audioPlayer.play()
          }
        },

        setVolume: (volume: number) => {
          set({ volume })
          audioPlayer.setVolume(volume)
        },

        toggleShuffle: () => set((state) => ({ isShuffleOn: !state.isShuffleOn })),

        toggleRepeat: () => {
          set((state) => ({
            repeatMode: 
              state.repeatMode === 'off' 
                ? 'all' 
                : state.repeatMode === 'all' 
                  ? 'one' 
                  : 'off'
          }))
        },

        setAudioQuality: (quality: AudioQuality) => {
          set({ audioQuality: quality })
          // Apply quality to current playback and future tracks
          audioPlayer.setQuality(quality)
        },

        toggleFavorite: (trackId: string) => {
          set((state) => {
            const isFavorite = state.favorites.some(t => t.id === trackId)
            const favorites = isFavorite
              ? state.favorites.filter(t => t.id !== trackId)
              : [...state.favorites, state.queue.find(t => t.id === trackId)!].filter(Boolean)

            // Update current track if it's the one being favorited
            const currentTrack = state.currentTrack?.id === trackId
              ? { ...state.currentTrack, isFavorite: !isFavorite }
              : state.currentTrack

            return { favorites, currentTrack }
          })
        },

        addToQueue: (tracks: Track[]) => {
          set((state) => ({
            queue: [...state.queue, ...tracks]
          }))
        },

        playTrack: async (track: Track, queue: Track[] = []) => {
          const newQueue = queue.length > 0 ? queue : [track]
          const index = newQueue.findIndex(t => t.id === track.id)
          
          set({
            currentTrack: track,
            queue: newQueue,
            currentIndex: index >= 0 ? index : 0,
            progress: 0,
            currentTime: 0,
            isLoading: true
          })

          // Add to recently played
          const { recentlyPlayed } = get()
          const filtered = recentlyPlayed.filter(t => t.id !== track.id)
          set({
            recentlyPlayed: [track, ...filtered].slice(0, 20)
          })

          // Load and play through audio service
          const success = await audioPlayer.loadTrack(track)
          if (success) {
            await audioPlayer.play()
          }
        },

        updateFromAudioPlayer: (audioState: any) => {
          set({
            currentTime: audioState.currentTime,
            duration: audioState.duration,
            progress: audioState.progress,
            isPlaying: audioState.isPlaying
          })
        }
      }

      // Set up audio player listener after store creation
      setTimeout(() => setupAudioPlayerListener({ getState: get, setState: set }), 0)

      return store
    },
    {
      name: 'player-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyPlayed: state.recentlyPlayed,
        volume: state.volume,
        isShuffleOn: state.isShuffleOn,
        repeatMode: state.repeatMode,
        audioQuality: state.audioQuality,
      }),
    }
  )
)