// ===== Music45 App HTML Templates =====
// Main app template composition using modular templates

import {
  getHeaderTemplate,
  getBottomNavTemplate,
  getSettingsSheetTemplate,
} from "./layout-templates";
import {
  getCompactFooterTemplate,
  getMusicBannerTemplate,
  getAudioElementTemplate,
} from "./player-templates";
import {
  getHomeTabTemplate,
  getSearchTabTemplate,
  getLibraryTabTemplate,
} from "./tab-templates";

/**
 * Main app container template
 * Composes all sub-templates into the complete app structure
 */
export const getAppTemplate = (): string => {
  return `
    <div class="app">
      ${getHeaderTemplate()}

      <!-- Main Content -->
      <div class="main-content" id="main">
        ${getHomeTabTemplate()}
        ${getSearchTabTemplate()}
        ${getLibraryTabTemplate()}
      </div>

      ${getCompactFooterTemplate()}
      ${getMusicBannerTemplate()}
      ${getBottomNavTemplate()}
    </div>

    ${getSettingsSheetTemplate()}
    ${getAudioElementTemplate()}
  `;
};

/**
 * Export individual templates for direct use if needed
 */
export {
  getHeaderTemplate,
  getBottomNavTemplate,
  getSettingsSheetTemplate,
  getCompactFooterTemplate,
  getMusicBannerTemplate,
  getAudioElementTemplate,
  getHomeTabTemplate,
  getSearchTabTemplate,
  getLibraryTabTemplate,
};

/**
 * Export template utility functions
 */
export {
  updateGreeting,
  updateActiveTab,
  showSettingsSheet,
  hideSettingsSheet,
  updateActiveQuality,
  toggleSettingsSheet,
} from "./layout-templates";

export {
  updateCompactFooterTrack,
  updateMusicBannerTrack,
  getLyricsLineTemplate,
} from "./player-templates";

export {
  getMusicCardTemplate,
  getTrackItemTemplate,
  getSearchResultTemplate,
  getEmptyStateTemplate,
  getLoadingTemplate,
  showTab,
  showAlbumView,
  hideAlbumView,
  clearSearchResults,
  getSearchInputValue,
  clearSearchInput,
} from "./tab-templates";