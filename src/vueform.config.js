import { defineConfig } from '@vueform/vueform'
import vueform from '@vueform/vueform/dist/vueform'
import axios from 'axios'
import { Preferences } from '@capacitor/preferences'

import '@vueform/vueform/dist/vueform.css'

// Setup axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true

// Add a request interceptor to include the token
axios.interceptors.request.use(
  async (config) => {
    try {
      // Get token from Capacitor Preferences
      const { value: token } = await Preferences.get({ key: 'auth_token' })

      // If token exists, add it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting token from preferences:', error)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default defineConfig({
  theme: vueform,
  locales: { en: 'en' },
  locale: 'en',

  // Add axios configuration for Vueform
  axios: axios,

  // API configuration
  api: {
    baseUrl: '/api', // Adjust this to match your API base URL
    endpoints: {
      submit: '/submit',
      upload: '/upload',
      remove: '/remove',
      download: '/download',
      list: '/list'
    }
  }
})