import axios from 'axios'
import { Capacitor } from '@capacitor/core'
import { useSettingsStore } from './settings'
import { useAuthStore } from './auth'

// We can't directly import useRouter here because this is not a Vue component
// We'll handle routing and alerts differently

class Http {
  constructor() {
    // Initialize with default values
    this.updateBaseURL()

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Add response interceptor to handle authentication errors
    this.setupResponseInterceptor()
  }

  // Update baseURL based on settings
  updateBaseURL() {
    // Start with default URL
    let apiUrl = import.meta.env.VITE_API_URL || 'https://newcore.nexeratech.co.id'

    try {
      // Try to get settings store
      const settingsStore = useSettingsStore()

      // Check if settings store is initialized and has a website URL
      if (settingsStore && typeof settingsStore.getWebsiteUrl !== 'undefined') {
        const settingsUrl = settingsStore.getWebsiteUrl

        // Only use settings URL if it's not null/undefined/empty
        if (settingsUrl && settingsUrl.trim() !== '') {
          apiUrl = settingsUrl
        }
      }
    } catch (error) {
      console.warn('Settings store not available or not initialized, using environment variables')
    }

    // Check if we should bypass the proxy in development mode
    const defaultEnvUrl = import.meta.env.VITE_API_URL || 'https://newcore.nexeratech.co.id'
    const shouldBypassProxy = import.meta.env.DEV &&
      apiUrl !== defaultEnvUrl

    // For development mode:
    // - If using default URL, use proxy for convenience
    // - If using custom URL, bypass proxy and use full URL directly
    // For production/native, always use full URL
    if (Capacitor.isNativePlatform()) {
      this.baseURL = `${apiUrl}/api`
    } else if (import.meta.env.DEV) {
      if (shouldBypassProxy) {
        // Bypass proxy and use full URL directly
        this.baseURL = apiUrl
      } else {
        // Use proxy
        this.baseURL = '/api'
      }
    } else {
      // Production mode
      this.baseURL = `${apiUrl}/api`
    }

    // Update the axios instance baseURL if it exists
    if (this.api) {
      this.api.defaults.baseURL = this.baseURL
    }

  }

  // Setup response interceptor to handle authentication errors
  setupResponseInterceptor() {
    this.api.interceptors.response.use(
      (response) => {
        // Return successful responses as-is
        return response
      },
      (error) => {
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
          // Check if the response contains "Unauthenticated" message
          const message = error.response.data?.message || ''
          if (message.toLowerCase().includes('unauthenticated')) {
            // Handle auth error - this will be caught by the calling function
          }
        }

        // Return the error to be handled by the calling function
        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization']
  }

  async get(url, config = {}) {
    return this.api.get(url, config)
  }

  async post(url, data = {}, config = {}) {
    return this.api.post(url, data, config)
  }

  async put(url, data = {}, config = {}) {
    return this.api.put(url, data, config)
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config)
  }

  async testConnection() {
    try {
      // Try to make a simple request to test connectivity
      const response = await this.get('/health') // Using a common health check endpoint
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // If we get a network error, we're offline
      if (!error.response) {
        return {
          success: false,
          error: 'Network error - no connection'
        }
      }

      // If we get a response (even an error response), we're online
      return {
        success: true,
        data: error.response.data
      }
    }
  }
}

export const http = new Http()
export default http