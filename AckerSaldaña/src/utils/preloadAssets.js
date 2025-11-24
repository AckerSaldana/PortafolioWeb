/**
 * Preload Assets Configuration
 * Registers critical assets for enhanced loading experience
 */

import assetLoader from './assetLoader';

/**
 * Register all critical assets for preloading
 */
export const registerCriticalAssets = () => {
  // Register fonts
  assetLoader.register('fonts', [
    'JetBrains Mono',
    'Inter'
  ]);

  // Register 3D models (from public/models/)
  assetLoader.register('models', [
    '/models/earth.glb',
    '/models/mars.glb',
    '/models/neptune.glb',
    '/models/saturn.glb'
  ]);

  // Register critical images (add your actual image paths)
  // These are examples - update with your real asset paths
  assetLoader.register('images', [
    // Hero section images (if any)
    // Project images (if any)
    // Add more as needed
  ]);

  // Note: Scripts are loaded by Vite, so we don't need to register them here
};

/**
 * Start the asset loading process
 * @returns {Promise} Resolves when all assets are loaded
 */
export const preloadAssets = async () => {
  registerCriticalAssets();
  return await assetLoader.loadAll();
};

export default preloadAssets;
