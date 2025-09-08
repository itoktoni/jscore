import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    websiteName: null,
    websiteUrl: null,
    darkMode: false
  }),

  getters: {
    // Get website name, fallback to .env if not set
    getWebsiteName: (state) => {
      return state.websiteName || import.meta.env.VITE_APP_NAME || 'ASSET MANAGEMENT'
    },

    // Get website URL, fallback to .env if not set
    getWebsiteUrl: (state) => {
      return state.websiteUrl || import.meta.env.VITE_API_URL || 'https://newcore.nexeratech.co.id'
    },

    // Get dark mode preference
    isDarkMode: (state) => {
      return state.darkMode
    }
  },

  actions: {
    // Load settings from storage
    async loadSettings() {
      try {
        const { value: websiteName } = await Preferences.get({ key: 'website_name' })
        const { value: websiteUrl } = await Preferences.get({ key: 'website_url' })
        const { value: darkMode } = await Preferences.get({ key: 'dark_mode' })

        console.log('Loaded settings from storage:', { websiteName, websiteUrl, darkMode });

        if (websiteName !== null) this.websiteName = websiteName
        if (websiteUrl !== null) this.websiteUrl = websiteUrl
        if (darkMode !== null) this.darkMode = darkMode === 'true'

        console.log('Settings store updated:', {
          websiteName: this.websiteName,
          websiteUrl: this.websiteUrl,
          darkMode: this.darkMode
        });
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    },

    // Save settings to storage
    async saveSettings() {
      try {
        console.log('Saving settings to storage:', {
          websiteName: this.websiteName,
          websiteUrl: this.websiteUrl,
          darkMode: this.darkMode
        });

        if (this.websiteName !== null && this.websiteName !== undefined) {
          await Preferences.set({ key: 'website_name', value: this.websiteName })
        } else {
          await Preferences.remove({ key: 'website_name' })
        }

        if (this.websiteUrl !== null && this.websiteUrl !== undefined) {
          await Preferences.set({ key: 'website_url', value: this.websiteUrl })
        } else {
          await Preferences.remove({ key: 'website_url' })
        }

        await Preferences.set({ key: 'dark_mode', value: this.darkMode.toString() })
        console.log('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error)
        throw error // Re-throw the error so it can be handled by the caller
      }
    },

    // Update website name
    async setWebsiteName(name) {
      this.websiteName = name
      await this.saveSettings()
    },

    // Update website URL
    async setWebsiteUrl(url) {
      this.websiteUrl = url
      await this.saveSettings()
    },

    // Toggle dark mode
    async toggleDarkMode() {
      this.darkMode = !this.darkMode
      await this.saveSettings()
      this.applyDarkMode()
    },

    // Set dark mode
    async setDarkMode(enabled) {
      this.darkMode = enabled
      await this.saveSettings()
      this.applyDarkMode()
    },

    // Apply dark mode to the document
    applyDarkMode() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      console.log('Dark mode applied to document. Dark mode enabled:', this.darkMode);
    },

    // Reset to defaults (use .env values)
    async resetToDefaults() {
      this.websiteName = null
      this.websiteUrl = null
      this.darkMode = false
      this.applyDarkMode()
      // Clear stored preferences
      try {
        await Preferences.remove({ key: 'website_name' })
        await Preferences.remove({ key: 'website_url' })
        await Preferences.remove({ key: 'dark_mode' })
      } catch (error) {
        console.error('Error clearing settings:', error)
        throw error // Re-throw the error so it can be handled by the caller
      }
    }
  }
})