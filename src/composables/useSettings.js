import { useSettingsStore } from '../stores/settings'

/**
 * Composable for managing application settings
 * Provides a simple interface to access and modify settings
 */
export function useSettings() {
  const settingsStore = useSettingsStore()

  /**
   * Get the current website name
   * @returns {string} The website name from settings or .env
   */
  const getWebsiteName = () => {
    return settingsStore.getWebsiteName
  }

  /**
   * Get the current website URL
   * @returns {string} The website URL from settings or .env
   */
  const getWebsiteUrl = () => {
    return settingsStore.getWebsiteUrl
  }

  /**
   * Check if dark mode is enabled
   * @returns {boolean} True if dark mode is enabled
   */
  const isDarkMode = () => {
    return settingsStore.isDarkMode
  }

  /**
   * Set the website name
   * @param {string} name - The website name to set
   */
  const setWebsiteName = async (name) => {
    await settingsStore.setWebsiteName(name)
  }

  /**
   * Set the website URL
   * @param {string} url - The website URL to set
   */
  const setWebsiteUrl = async (url) => {
    await settingsStore.setWebsiteUrl(url)
  }

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = async () => {
    await settingsStore.toggleDarkMode()
  }

  /**
   * Set dark mode
   * @param {boolean} enabled - Whether to enable dark mode
   */
  const setDarkMode = async (enabled) => {
    await settingsStore.setDarkMode(enabled)
  }

  /**
   * Reset all settings to defaults
   */
  const resetToDefaults = async () => {
    await settingsStore.resetToDefaults()
  }

  /**
   * Load settings from storage
   */
  const loadSettings = async () => {
    await settingsStore.loadSettings()
  }

  return {
    // Getters
    getWebsiteName,
    getWebsiteUrl,
    isDarkMode,

    // Actions
    setWebsiteName,
    setWebsiteUrl,
    toggleDarkMode,
    setDarkMode,
    resetToDefaults,
    loadSettings
  }
}