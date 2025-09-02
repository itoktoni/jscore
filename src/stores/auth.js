import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'
import { apiService } from './api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    isAdmin: (state) => {
      return state.user && (state.user.role === 'admin' || state.user.role === 'administrator')
    },

    isModerator: (state) => {
      return state.user && (state.user.role === 'moderator' || state.user.role === 'admin' || state.user.role === 'administrator')
    },

    hasRole: (state) => (role) => {
      return state.user && state.user.role === role
    },

    canManageUsers: (state) => {
      return state.user && (state.user.role === 'admin' || state.user.role === 'administrator')
    }
  },

  actions: {
    async login(username, password) {
      try {
        const response = await apiService.post('/login', {
          username,
          password
        })

        const token = response.data.data.api_token
        const user = response.data.data

        await Preferences.set({
          key: 'auth_token',
          value: token
        })

        this.token = token
        this.user = user
        this.isAuthenticated = true

        apiService.setAuthToken(token)
        return { success: true }
      } catch (error) {
        // Better error handling for Laravel-style validation responses
        let errorMessage = error.message || 'Login failed'
        let fieldErrors = {}

        if (error.response?.status === 422) {
          // Laravel validation error
          const errorData = error.response.data
          errorMessage = errorData.message || errorMessage
          fieldErrors = errorData.errors || {}
        } else if (error.response?.data?.message) {
          // Other API error with message
          errorMessage = error.response.data.message
        } else if (error.response?.status === 401) {
          // Unauthorized - usually wrong credentials
          errorMessage = 'Invalid username or password'
        }

        return {
          success: false,
          error: errorMessage,
          errors: fieldErrors,
          errorData: error.response?.data
        }
      }
    },

    async logout() {
      await Preferences.remove({ key: 'auth_token' })
      this.token = null
      this.user = null
      this.isAuthenticated = false
      apiService.removeAuthToken()
    },

    async initAuth() {
      const { value: token } = await Preferences.get({ key: 'auth_token' })
      if (token) {
        this.token = token
        this.isAuthenticated = true
        apiService.setAuthToken(token)

        // Load user profile data
        try {
          await this.loadProfile()
        } catch (error) {
          // If profile loading fails, logout
          await this.logout()
        }
      }
    },

    async loadProfile() {
      const response = await apiService.get('/profile')
      this.user = response.data.data || response.data
    },

    async updateProfile(profileData) {
      try {
        const response = await apiService.post('/profile', profileData)
        this.user = response.data.data || response.data
        return { success: true }
      } catch (error) {
        // Better error handling for profile update
        let errorMessage = error.message || 'Profile update failed'
        let fieldErrors = {}

        if (error.response?.status === 422) {
          // Laravel validation error
          const errorData = error.response.data
          errorMessage = errorData.message || errorMessage
          fieldErrors = errorData.errors || {}
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }

        return {
          success: false,
          error: errorMessage,
          errors: fieldErrors,
          errorData: error.response?.data
        }
      }
    }
  }
})