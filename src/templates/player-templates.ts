// ===== Music45 Player Templates =====
// HTML templates for player components

/**
 * Compact footer player template
 */
export const getCompactFooterTemplate = (): string => {
  return `
    <div class="compact-footer" id="compact-footer" style="display: none;">
      <div class="footer-progress">
        <div class="footer-progress-fill" id="footer-progress-fill"></div>
      </div>
      <div class="footer-track-info" id="footer-open-banner">
        <div class="footer-track-image">
          <img id="footer-track-image" src="https://music45beta.vercel.app/music/music45.webp" alt="Cover">
        </div>
        <div class="footer-track-details">
          <h4 id="footer-track-title">No song</h4>
          <p id="footer-track-artist">—</p>
        </div>
      </div>
      <div class="footer-controls">
        <button class="footer-play-button" id="footer-btn-play">
          <i data-lucide="play" id="footer-play-icon"></i>
        </button>
        <button class="footer-next-button" id="footer-btn-next">
          <i data-lucide="skip-forward"></i>
        </button>
      </div>
    </div>
  `;
};

/**
 * Music banner (full-screen player) template
 */
export const getMusicBannerTemplate = (): string => {
  return `
    <div id="music-banner" class="music-banner" style="display:none;">
      <div class="player-container">
        <button id="close-banner-btn" class="close-btn">
          <i data-lucide="chevron-down"></i>
        </button>

        <!-- Flip Container for Album Cover / Lyrics -->
        <div class="flip-container">
          <div id="flip-inner" class="flip-inner">
            <!-- Front - Album Cover -->
            <div class="flip-front">
              <div class="album-cover">
                <img id="banner-cover-image" src="" alt="Album Cover">
                <button id="show-lyrics-btn" class="flip-btn overlay-btn">
                  <i class="fas fa-music"></i>
                </button>
              </div>
            </div>

            <!-- Back - Lyrics -->
            <div class="flip-back">
              <div class="lyrics-header">
                <h3>Lyrics</h3>
                <button id="show-cover-btn" class="flip-2-btn">
                  <i data-lucide="image"></i> Show Cover
                </button>
              </div>
              <div id="lyrics-container" class="lyrics-content">
                <!-- Synced lyrics lines will be added here -->
              </div>
              <div id="lyrics-text" class="lyrics-content" style="display: none;">
                <!-- Plain lyrics fallback -->
              </div>
            </div>
          </div>
        </div>

        <!-- Song Info -->
        <div class="song-info">
          <h2 id="banner-song-title">No song</h2>
          <p id="banner-artist-name">—</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-track" id="banner-progress-track">
              <div class="progress-fill" id="banner-progress-fill"></div>
              <div class="progress-handle-circle" id="progress-handle-circle"></div>
            </div>
          </div>
          <div class="time-stamps">
            <span id="current-time">00:00</span>
            <span id="duration">00:00</span>
          </div>
        </div>

        <!-- Main Controls -->
        <div class="main-controls">
          <button id="shuffle-btn" class="control-button">
            <i data-lucide="shuffle"></i>
          </button>
          <button id="banner-prev" class="control-button">
            <i data-lucide="skip-back"></i>
          </button>
          <button id="banner-play-pause" class="play-button">
            <i data-lucide="play" id="banner-play-icon"></i>
          </button>
          <button id="banner-next" class="control-button">
            <i data-lucide="skip-forward"></i>
          </button>
          <button id="repeat-btn" class="control-button">
            <i data-lucide="repeat"></i>
          </button>
          <div id="shuffle-popup" class="popup">
            Shuffle: <span id="shuffle-status">Off</span>
          </div>
          <div id="repeat-popup" class="popup">
            Repeat: <span id="repeat-status">Off</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Lyrics line template for synced lyrics
 */
export const getLyricsLineTemplate = (
  time: number,
  text: string,
  isActive: boolean = false
): string => {
  return `
    <div class="lyrics-line ${isActive ? 'active' : ''}" data-time="${time}">
      ${text}
    </div>
  `;
};

/**
 * Audio element template
 */
export const getAudioElementTemplate = (): string => {
  return `<audio id="audio"></audio>`;
};

/**
 * Update compact footer with track info
 */
export const updateCompactFooterTrack = (
  imageUrl: string,
  title: string,
  artist: string
): void => {
  const imageEl = document.getElementById('footer-track-image') as HTMLImageElement;
  const titleEl = document.getElementById('footer-track-title');
  const artistEl = document.getElementById('footer-track-artist');

  if (imageEl) imageEl.src = imageUrl;
  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;
};

/**
 * Update music banner with track info
 */
export const updateMusicBannerTrack = (
  imageUrl: string,
  title: string,
  artist: string
): void => {
  const imageEl = document.getElementById('banner-cover-image') as HTMLImageElement;
  const titleEl = document.getElementById('banner-song-title');
  const artistEl = document.getElementById('banner-artist-name');

  if (imageEl) imageEl.src = imageUrl;
  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;
};
