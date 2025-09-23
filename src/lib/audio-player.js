/**
 * Enhanced Audio Player Service for Background Music Playback
 */

export class AudioPlayerService {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.audioQuality = 'auto'; // 'low', 'medium', 'high', 'auto'
    this.listeners = new Set();

    this.setupEventListeners();
    this.setupMediaSession();
  }

  setupEventListeners() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.notifyListeners('metadataLoaded');
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.notifyListeners('timeUpdate');
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners('play');
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners('pause');
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyListeners('ended');
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.notifyListeners('error', e);
    });

    this.audio.addEventListener('loadstart', () => {
      this.notifyListeners('loading');
    });

    this.audio.addEventListener('canplay', () => {
      this.notifyListeners('canPlay');
    });
  }

  setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.notifyListeners('previoustrack');
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.notifyListeners('nexttrack');
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        this.seekTo(details.seekTime);
      });
    }
  }

  updateMediaSessionMetadata(track) {
    if ('mediaSession' in navigator && track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.image, sizes: '300x300', type: 'image/jpeg' }
        ]
      });
    }
  }

  async loadTrack(track) {
    return this.loadTrackWithQuality(track);
  }

  async play() {
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.error('Play error:', error);
      this.notifyListeners('error', error);
      return false;
    }
  }

  pause() {
    this.audio.pause();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seekTo(time) {
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.duration));
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
  }

  setQuality(quality) {
    this.audioQuality = quality;
    console.log(`Audio quality set to: ${quality}`);
    
    // If currently playing, apply quality to current track
    if (this.currentTrack && this.isPlaying) {
      const currentTime = this.currentTime;
      this.loadTrackWithQuality(this.currentTrack).then(() => {
        this.seekTo(currentTime);
        this.play();
      });
    }
  }

  async loadTrackWithQuality(track) {
    if (!track || !track.url) {
      console.error('Invalid track data:', track);
      return false;
    }

    try {
      this.currentTrack = track;
      
      // Apply quality-based URL selection
      let audioUrl = track.url;
      
      // Map quality to Saavn quality parameters
      const qualityParams = {
        'low': '96',
        'medium': '160', 
        'high': '320',
        'auto': '320' // Default to high for auto
      };
      
      const qualityParam = qualityParams[this.audioQuality] || '320';
      
      // If Saavn URL, append quality parameter
      if (audioUrl.includes('saavn')) {
        const separator = audioUrl.includes('?') ? '&' : '?';
        audioUrl = `${audioUrl}${separator}quality=${qualityParam}`;
      }
      
      this.audio.src = audioUrl;
      this.audio.preload = 'metadata';
      
      this.updateMediaSessionMetadata(track);
      this.notifyListeners('trackLoaded', track);
      
      return true;
    } catch (error) {
      console.error('Error loading track with quality:', error);
      this.notifyListeners('error', error);
      return false;
    }
  }

  getProgress() {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Event listener management
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data = null) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data, this.getState());
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  getState() {
    return {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      progress: this.getProgress(),
      volume: this.volume,
      formattedCurrentTime: this.formatTime(this.currentTime),
      formattedDuration: this.formatTime(this.duration)
    };
  }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
    this.listeners.clear();
  }
}

// Create singleton instance
export const audioPlayer = new AudioPlayerService();