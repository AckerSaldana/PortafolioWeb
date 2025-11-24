/**
 * Asset Loader Utility
 * Tracks loading progress of various asset types for enhanced preloader experience
 * Mission-themed for space odyssey narrative
 */

class AssetLoader {
  constructor() {
    this.assets = {
      models: [],
      images: [],
      fonts: [],
      scripts: []
    };

    this.loaded = {
      models: 0,
      images: 0,
      fonts: 0,
      scripts: 0
    };

    this.total = {
      models: 0,
      images: 0,
      fonts: 0,
      scripts: 0
    };

    this.listeners = [];
    this.currentStage = 'initializing';
    this.startTime = Date.now();
  }

  /**
   * Register assets to load
   * @param {string} type - Asset type: 'models', 'images', 'fonts', 'scripts'
   * @param {Array<string>} urls - Array of asset URLs
   */
  register(type, urls) {
    if (!this.assets[type]) {
      console.warn(`Unknown asset type: ${type}`);
      return;
    }

    this.assets[type] = [...this.assets[type], ...urls];
    this.total[type] = this.assets[type].length;
  }

  /**
   * Start loading all registered assets
   * @returns {Promise} Resolves when all assets are loaded
   */
  async loadAll() {
    this.updateStage('initializing');

    const loadPromises = [];

    // Load fonts first (critical for text rendering)
    if (this.assets.fonts.length > 0) {
      this.updateStage('fonts');
      loadPromises.push(this.loadFonts());
    }

    // Load scripts
    if (this.assets.scripts.length > 0) {
      this.updateStage('scripts');
      loadPromises.push(this.loadScripts());
    }

    // Load images
    if (this.assets.images.length > 0) {
      this.updateStage('images');
      loadPromises.push(this.loadImages());
    }

    // Load 3D models
    if (this.assets.models.length > 0) {
      this.updateStage('models');
      loadPromises.push(this.loadModels());
    }

    await Promise.all(loadPromises);
    this.updateStage('complete');

    return {
      duration: Date.now() - this.startTime,
      totalAssets: this.getTotalAssets(),
      loadedAssets: this.getLoadedAssets()
    };
  }

  /**
   * Load font files
   */
  async loadFonts() {
    const promises = this.assets.fonts.map(async (fontName) => {
      try {
        // Check if font is already loaded
        if (document.fonts.check(`16px ${fontName}`)) {
          this.markLoaded('fonts');
          return;
        }

        // Wait for font to load
        await document.fonts.load(`16px ${fontName}`);
        this.markLoaded('fonts');
      } catch (error) {
        console.warn(`Failed to load font: ${fontName}`, error);
        this.markLoaded('fonts'); // Still increment to prevent blocking
      }
    });

    await Promise.all(promises);
  }

  /**
   * Load script files
   */
  async loadScripts() {
    const promises = this.assets.scripts.map(async (url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;

        script.onload = () => {
          this.markLoaded('scripts');
          resolve();
        };

        script.onerror = () => {
          console.warn(`Failed to load script: ${url}`);
          this.markLoaded('scripts');
          resolve(); // Resolve anyway to prevent blocking
        };

        document.head.appendChild(script);
      });
    });

    await Promise.all(promises);
  }

  /**
   * Load image files
   */
  async loadImages() {
    const promises = this.assets.images.map(async (url) => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          this.markLoaded('images');
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          this.markLoaded('images');
          resolve(); // Resolve anyway to prevent blocking
        };

        img.src = url;
      });
    });

    await Promise.all(promises);
  }

  /**
   * Load 3D model files
   * Note: Uses fetch for GLB files, actual loading handled by Three.js later
   */
  async loadModels() {
    const promises = this.assets.models.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Just check if file exists, don't parse
        await response.blob();
        this.markLoaded('models');
      } catch (error) {
        console.warn(`Failed to preload model: ${url}`, error);
        this.markLoaded('models');
      }
    });

    await Promise.all(promises);
  }

  /**
   * Mark an asset as loaded and notify listeners
   */
  markLoaded(type) {
    this.loaded[type]++;
    this.notifyProgress();
  }

  /**
   * Update current loading stage
   */
  updateStage(stage) {
    this.currentStage = stage;
    this.notifyProgress();
  }

  /**
   * Get total number of assets
   */
  getTotalAssets() {
    return Object.values(this.total).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Get number of loaded assets
   */
  getLoadedAssets() {
    return Object.values(this.loaded).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Get overall progress percentage (0-100)
   */
  getProgress() {
    const total = this.getTotalAssets();
    if (total === 0) return 100;

    const loaded = this.getLoadedAssets();
    return Math.round((loaded / total) * 100);
  }

  /**
   * Get mission-themed status message based on progress
   */
  getMissionStatus() {
    const progress = this.getProgress();

    if (progress < 20) {
      return {
        message: 'INITIALIZING MISSION SYSTEMS...',
        stage: 'init',
        icon: '🚀'
      };
    } else if (progress < 40) {
      return {
        message: 'LOADING 3D NAVIGATION MODELS...',
        stage: 'models',
        icon: '🛸'
      };
    } else if (progress < 60) {
      return {
        message: 'CALIBRATING PARTICLE FIELD...',
        stage: 'particles',
        icon: '✨'
      };
    } else if (progress < 80) {
      return {
        message: 'ESTABLISHING COMMUNICATIONS...',
        stage: 'comms',
        icon: '📡'
      };
    } else if (progress < 95) {
      return {
        message: 'FINAL SYSTEMS CHECK...',
        stage: 'check',
        icon: '⚡'
      };
    } else if (progress < 100) {
      return {
        message: 'LAUNCH SEQUENCE READY...',
        stage: 'ready',
        icon: '🎯'
      };
    } else {
      return {
        message: 'MISSION START',
        stage: 'complete',
        icon: '🌟'
      };
    }
  }

  /**
   * Add progress listener
   * @param {Function} callback - Called with progress data
   */
  onProgress(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of progress update
   */
  notifyProgress() {
    const data = {
      progress: this.getProgress(),
      loaded: this.getLoadedAssets(),
      total: this.getTotalAssets(),
      stage: this.currentStage,
      mission: this.getMissionStatus(),
      breakdown: {
        models: { loaded: this.loaded.models, total: this.total.models },
        images: { loaded: this.loaded.images, total: this.total.images },
        fonts: { loaded: this.loaded.fonts, total: this.total.fonts },
        scripts: { loaded: this.loaded.scripts, total: this.total.scripts }
      }
    };

    this.listeners.forEach(callback => callback(data));
  }

  /**
   * Reset loader state
   */
  reset() {
    this.assets = { models: [], images: [], fonts: [], scripts: [] };
    this.loaded = { models: 0, images: 0, fonts: 0, scripts: 0 };
    this.total = { models: 0, images: 0, fonts: 0, scripts: 0 };
    this.currentStage = 'initializing';
    this.startTime = Date.now();
  }
}

// Singleton instance
const assetLoader = new AssetLoader();

export default assetLoader;
