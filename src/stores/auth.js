import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'
import { http } from './http'
import { useResponse } from '../composables/useResponse'

const { responseSuccess, responseError } = useResponse()

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
        const response = await http.post('/login', {
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

        http.setAuthToken(token)
        return responseSuccess({ message: 'Login successful' })
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

        return responseError({
          ...error,
          message: errorMessage,
          response: {
            ...error.response,
            data: {
              ...error.response?.data,
              errors: fieldErrors
            }
          }
        })
      }
    },

    async logout() {
      await Preferences.remove({ key: 'auth_token' })
      this.token = null
      this.user = null
      this.isAuthenticated = false
      http.removeAuthToken()
      return responseSuccess({ message: 'Logout successful' })
    },

    async initAuth() {
      try {
        const { value: token } = await Preferences.get({ key: 'auth_token' })
        if (token) {
          this.token = token
          this.isAuthenticated = true
          http.setAuthToken(token)

          // Load user profile data
          try {
            console.log('Initializing auth with token, loading profile...')
            await this.loadProfile()
            return responseSuccess({ message: 'Authentication initialized' })
          } catch (error) {
            console.error('Error loading profile during init:', error)
            // If profile loading fails, logout
            await this.logout()
            return responseError(error)
          }
        }
        return responseSuccess({ message: 'No authentication token found' })
      } catch (error) {
        console.error('Error initializing auth:', error)
        return responseError(error)
      }
    },

    async loadProfile() {
      try {
        console.log('Loading user profile...')
        const response = await http.get('/profile')
        this.user = response.data.data || response.data
        console.log('Profile loaded successfully:', this.user)
        return responseSuccess(this.user)
      } catch (error) {
        console.error('Error loading profile:', error)
        // Handle authentication errors
        if (error.response?.status === 401) {
          const message = error.response.data?.message || ''
          if (message.toLowerCase().includes('unauthenticated')) {
            // Token is invalid, logout and redirect to login
            await this.handleAuthError()
          }
        }
        return responseError(error)
      }
    },

    async updateProfile(profileData) {
      try {
        const response = await http.post('/profile', profileData)
        this.user = response.data.data || response.data
        return responseSuccess({ message: 'Profile updated successfully' })
      } catch (error) {
        // Handle authentication errors
        if (error.response?.status === 401) {
          const message = error.response.data?.message || ''
          if (message.toLowerCase().includes('unauthenticated')) {
            // Token is invalid, logout and redirect to login
            await this.handleAuthError()
          }
        }

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

        return responseError({
          ...error,
          message: errorMessage,
          response: {
            ...error.response,
            data: {
              ...error.response?.data,
              errors: fieldErrors
            }
          }
        })
      }
    },

    // Handle authentication error - logout and prepare for redirect
    async handleAuthError() {
      await this.logout()
      // The actual redirect will be handled by the router guard or component
      console.log('Authentication error - user logged out')
    }
  }
})