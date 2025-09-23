/**
 * Saavn.dev API Integration
 * Base URL: https://saavn.dev/api
 */

const BASE_URL = 'https://saavn.dev/api';

// API Client for Saavn.dev
export class SaavnAPI {
  static async search(query, type = 'songs', limit = 20) {
    try {
      const response = await fetch(`${BASE_URL}/search/${type}?query=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return { data: { results: [] } };
    }
  }

  static async getSong(id) {
    try {
      const response = await fetch(`${BASE_URL}/songs/${id}`);
      if (!response.ok) throw new Error('Song fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Song fetch error:', error);
      return null;
    }
  }

  static async getAlbum(id) {
    try {
      const response = await fetch(`${BASE_URL}/albums/${id}`);
      if (!response.ok) throw new Error('Album fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Album fetch error:', error);
      return null;
    }
  }

  static async getTopCharts(language = 'hindi') {
    try {
      const response = await fetch(`${BASE_URL}/modules?language=${language}`);
      if (!response.ok) throw new Error('Charts fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Charts fetch error:', error);
      return { data: [] };
    }
  }

  static async getHomeData() {
    try {
      const response = await fetch(`${BASE_URL}/modules?language=hindi`);
      if (!response.ok) throw new Error('Home data fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Home data fetch error:', error);
      return { data: [] };
    }
  }

  // Helper to get high quality download URL
  static getDownloadUrl(song, quality = '320kbps') {
    if (song.downloadUrl && song.downloadUrl.length > 0) {
      const qualityUrl = song.downloadUrl.find(url => url.quality === quality);
      return qualityUrl ? qualityUrl.url : song.downloadUrl[song.downloadUrl.length - 1].url;
    }
    return song.url || '';
  }

  // Helper to format song data
  static formatSong(song) {
    return {
      id: song.id,
      title: song.name || song.title,
      artist: song.artists?.primary?.[0]?.name || song.artist || 'Unknown Artist',
      album: song.album?.name || 'Unknown Album',
      image: song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || '',
      duration: song.duration || 0,
      url: this.getDownloadUrl(song),
      year: song.year || new Date().getFullYear()
    };
  }

  // Helper to format album data
  static formatAlbum(album) {
    return {
      id: album.id,
      title: album.name || album.title,
      artist: album.artists?.primary?.[0]?.name || album.artist || 'Various Artists',
      image: album.image?.[2]?.url || album.image?.[1]?.url || album.image?.[0]?.url || '',
      year: album.year || new Date().getFullYear(),
      songCount: album.songCount || 0
    };
  }
}