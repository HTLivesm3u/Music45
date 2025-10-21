// ===== Music45 Tab Templates =====
// HTML templates for tab views (home, search, library)

/**
 * Home tab template
 */
export const getHomeTabTemplate = (): string => {
  return `
    <div class="tab-view" id="tab-home">
      <!-- Album Detail View (hidden by default) -->
      <div class="album-view" id="album-view" style="display:none;">
        <div class="album-topbar">
          <button id="album-back" class="album-back" aria-label="Back to home">
            <i data-lucide="arrow-left"></i>
          </button>
        </div>
        <div class="album-header">
          <img id="album-cover" src="" alt="Album Cover">
          <h2 id="album-title">Album Title</h2>
          <p id="album-artist">Album Artist</p>
          <button id="album-play" class="play-button" aria-label="Play album">
            <i data-lucide="play"></i>
          </button>
        </div>
        <div class="album-tracks" id="album-tracks"></div>
      </div>

      <!-- Albums Section -->
      <div class="section">
        <h2 class="section-title">Albums</h2>
        <div class="horizontal-scroll" id="albums"></div>
      </div>

      <!-- Recently Played Section -->
      <div class="section">
        <h2 class="section-title">Recently played</h2>
        <div class="horizontal-scroll" id="recently"></div>
      </div>

      <!-- New Releases Section -->
      <div class="section">
        <h2 class="section-title">New releases for you</h2>
        <div class="horizontal-scroll" id="new-releases"></div>
      </div>
    </div>
  `;
};

/**
 * Search tab template
 */
export const getSearchTabTemplate = (): string => {
  return `
    <div class="tab-view" id="tab-search" style="display:none;">
      <div class="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search songs, artists, albums..."
          aria-label="Search"
        />
        <button id="search-btn" aria-label="Search">
          <i data-lucide="search"></i>
        </button>
      </div>
      <div class="search-results" id="search-results"></div>
    </div>
  `;
};

/**
 * Library tab template
 */
export const getLibraryTabTemplate = (): string => {
  return `
    <div class="tab-view" id="tab-library" style="display:none;">
      <h2 class="section-title">Your Library</h2>
      <p style="color:var(--foreground-muted);padding:12px;">
        No saved songs yet.
      </p>
    </div>
  `;
};

/**
 * Album detail view template (for updating album view content)
 */
export const getAlbumDetailTemplate = (
  coverUrl: string,
  title: string,
  artist: string
): string => {
  return `
    <div class="album-topbar">
      <button id="album-back" class="album-back" aria-label="Back to home">
        <i data-lucide="arrow-left"></i>
      </button>
    </div>
    <div class="album-header">
      <img id="album-cover" src="${coverUrl}" alt="${title} cover">
      <h2 id="album-title">${title}</h2>
      <p id="album-artist">${artist}</p>
      <button id="album-play" class="play-button" aria-label="Play album">
        <i data-lucide="play"></i>
      </button>
    </div>
    <div class="album-tracks" id="album-tracks"></div>
  `;
};

/**
 * Music card template (for albums, recently played)
 */
export const getMusicCardTemplate = (
  imageUrl: string,
  title: string,
  dataId?: string
): string => {
  const idAttr = dataId ? `data-id="${dataId}"` : '';
  return `
    <div class="music-card" ${idAttr}>
      <img src="${imageUrl}" alt="${title}" loading="lazy">
      <span>${title}</span>
    </div>
  `;
};

/**
 * Track item template for album tracks
 */
export const getTrackItemTemplate = (
  index: number,
  imageUrl: string,
  title: string,
  artist: string,
  dataId?: string
): string => {
  const idAttr = dataId ? `data-id="${dataId}"` : '';
  return `
    <div class="track-item" ${idAttr}>
      <div class="track-number">${index + 1}</div>
      <img src="${imageUrl}" alt="${title}" class="track-image" loading="lazy">
      <div class="track-info">
        <h4 class="track-title">${title}</h4>
        <p class="track-artist">${artist}</p>
      </div>
      <button class="track-play-btn" aria-label="Play ${title}">
        <i data-lucide="play"></i>
      </button>
    </div>
  `;
};

/**
 * Search result item template
 */
export const getSearchResultTemplate = (
  imageUrl: string,
  title: string,
  artist: string,
  dataId?: string
): string => {
  const idAttr = dataId ? `data-id="${dataId}"` : '';
  return `
    <div class="search-result-item" ${idAttr}>
      <div class="result-image">
        <img src="${imageUrl}" alt="${title}" loading="lazy">
        <div class="result-play-overlay">
          <i data-lucide="play"></i>
        </div>
      </div>
      <div class="result-info">
        <h4 class="result-title">${title}</h4>
        <p class="result-artist">${artist}</p>
      </div>
      <button class="result-more-btn" aria-label="More options">
        <i data-lucide="more-vertical"></i>
      </button>
    </div>
  `;
};

/**
 * Empty state template
 */
export const getEmptyStateTemplate = (
  icon: string,
  title: string,
  message: string
): string => {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        <i data-lucide="${icon}"></i>
      </div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
};

/**
 * Loading state template
 */
export const getLoadingTemplate = (message: string = 'Loading...'): string => {
  return `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
};

/**
 * Show/hide tab by ID
 */
export const showTab = (tabId: string): void => {
  const tabs = document.querySelectorAll('.tab-view');
  tabs.forEach((tab) => {
    if (tab.id === `tab-${tabId}`) {
      (tab as HTMLElement).style.display = 'block';
    } else {
      (tab as HTMLElement).style.display = 'none';
    }
  });
};

/**
 * Show album detail view
 */
export const showAlbumView = (): void => {
  const albumView = document.getElementById('album-view');
  const sections = document.querySelectorAll('#tab-home > .section');

  if (albumView) {
    albumView.style.display = 'block';
  }

  sections.forEach((section) => {
    (section as HTMLElement).style.display = 'none';
  });
};

/**
 * Hide album detail view (show home sections)
 */
export const hideAlbumView = (): void => {
  const albumView = document.getElementById('album-view');
  const sections = document.querySelectorAll('#tab-home > .section');

  if (albumView) {
    albumView.style.display = 'none';
  }

  sections.forEach((section) => {
    (section as HTMLElement).style.display = 'block';
  });
};

/**
 * Clear search results
 */
export const clearSearchResults = (): void => {
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.innerHTML = '';
  }
};

/**
 * Update search input value
 */
export const getSearchInputValue = (): string => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  return searchInput ? searchInput.value.trim() : '';
};

/**
 * Clear search input
 */
export const clearSearchInput = (): void => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }
};
