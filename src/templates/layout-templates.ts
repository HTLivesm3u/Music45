// ===== Music45 Layout Templates =====
// HTML templates for layout components (header, navigation, settings)

/**
 * Header template with greeting and action buttons
 */
export const getHeaderTemplate = (): string => {
  return `
    <div class="header">
      <h1 class="greeting" id="greeting">Good morning</h1>
      <div class="header-icons">
        <button class="icon-button" id="notification-btn" aria-label="Notifications">
          <i data-lucide="bell"></i>
        </button>
        <button class="icon-button" id="history-btn" aria-label="History">
          <i data-lucide="clock"></i>
        </button>
        <button class="icon-button" id="settings-btn" aria-label="Settings">
          <i data-lucide="settings"></i>
        </button>
      </div>
    </div>
  `;
};

/**
 * Bottom navigation template
 */
export const getBottomNavTemplate = (): string => {
  return `
    <div class="bottom-nav">
      <button class="nav-item active" data-tab="home" aria-label="Home">
        <i data-lucide="home"></i>
        <span>Home</span>
      </button>
      <button class="nav-item" data-tab="search" aria-label="Search">
        <i data-lucide="search"></i>
        <span>Search</span>
      </button>
      <button class="nav-item" data-tab="library" aria-label="Library">
        <i data-lucide="library"></i>
        <span>Your Library</span>
      </button>
    </div>
  `;
};

/**
 * Settings sheet/modal template
 */
export const getSettingsSheetTemplate = (): string => {
  return `
    <div id="settings-sheet" class="settings-sheet">
      <div class="sheet-header">
        <div class="drag-line"></div>
        <h2>Settings</h2>
        <button id="close-settings" aria-label="Close settings">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="sheet-body">
        <h3>Playback Quality</h3>
        <div class="quality-options">
          <button class="quality-btn" data-quality="Less_low">
            Less Low (48 kbps)
          </button>
          <button class="quality-btn" data-quality="low">
            Low (96 kbps)
          </button>
          <button class="quality-btn" data-quality="medium">
            Medium (160 kbps)
          </button>
          <button class="quality-btn" data-quality="high">
            High (320 kbps)
          </button>
          <button class="quality-btn active" data-quality="auto">
            Auto (Best)
          </button>
        </div>

        <div class="settings-section">
          <h3>About</h3>
          <p class="settings-info">
            Music45 - Your Mobile Music Player<br>
            Version 3.0
          </p>
        </div>
      </div>
    </div>
  `;
};

/**
 * Update greeting text based on time of day
 */
export const updateGreeting = (): void => {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting = 'Good morning';

  if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else if (hour >= 18) {
    greeting = 'Good evening';
  }

  greetingEl.textContent = greeting;
};

/**
 * Update active tab in bottom navigation
 */
export const updateActiveTab = (tabName: string): void => {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    const tab = item.getAttribute('data-tab');
    if (tab === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

/**
 * Show settings sheet
 */
export const showSettingsSheet = (): void => {
  const sheet = document.getElementById('settings-sheet');
  if (sheet) {
    sheet.style.display = 'flex';
    // Trigger animation
    setTimeout(() => {
      sheet.classList.add('show');
    }, 10);
  }
};

/**
 * Hide settings sheet
 */
export const hideSettingsSheet = (): void => {
  const sheet = document.getElementById('settings-sheet');
  if (sheet) {
    sheet.classList.remove('show');
    setTimeout(() => {
      sheet.style.display = 'none';
    }, 300); // Match CSS transition duration
  }
};

/**
 * Update active quality button in settings
 */
export const updateActiveQuality = (quality: string): void => {
  const qualityButtons = document.querySelectorAll('.quality-btn');
  qualityButtons.forEach((btn) => {
    const btnQuality = btn.getAttribute('data-quality');
    if (btnQuality === quality) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

/**
 * Toggle settings sheet visibility
 */
export const toggleSettingsSheet = (): void => {
  const sheet = document.getElementById('settings-sheet');
  if (sheet) {
    if (sheet.style.display === 'none' || !sheet.style.display) {
      showSettingsSheet();
    } else {
      hideSettingsSheet();
    }
  }
};
