/**
 * User Store - Modular User Management System
 *
 * Features:
 * - Modular API route configuration via composables
 * - Separated validation and form processing logic
 * - Fallback to mock data when API is unavailable
 * - Clean separation of concerns with composable helper functions
 * - Consistent error handling and response formatting
 */

import { defineStore } from 'pinia'
import { apiService } from './api'
import { useApiRoutes } from '../composables/useApiRoutes'
import { useUserHelpers } from '../composables/useUserHelpers'

// Initialize composables
const { API_ROUTES } = useApiRoutes()
const userHelpers = useUserHelpers()

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      total: 0
    }
  }),

  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },

    totalUsers: (state) => state.users.length,

    hasUsers: (state) => state.users.length > 0
  },

  actions: {
    // Fetch all users with pagination
    async fetchUsers(page = 1, perPage = 10, filters = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await this._makeApiRequest('GET', API_ROUTES.users.list, {
          params: {
            page,
            per_page: perPage,
            ...filters
          }
        })

        return this._handleApiResponse(response, page, perPage)
      } catch (error) {
        this.error = error.message
        return {
          success: false,
          error: error.message,
          errorData: error.response?.data
        }
      } finally {
        this.loading = false
      }
    },

    // Handle API response for user fetching
    _handleApiResponse(response, page, perPage) {
      if (response.data.data) {
        this.users = response.data.data
        this.pagination = {
          currentPage: response.data.current_page || page,
          totalPages: response.data.last_page || 1,
          perPage: response.data.per_page || perPage,
          total: response.data.total || response.data.data.length
        }
      } else {
        this.users = response.data || []
      }

      return { success: true, data: this.users }
    },

    // Get single user by ID
    async fetchUserById(id) {
      this.loading = true
      this.error = null

      console.log('Fetching user with ID:', id) // Debug log

      try {
        const response = await this._makeApiRequest('GET', API_ROUTES.users.show(id))
        console.log('API Response for user:', response) // Debug log

        // Check if response exists
        if (!response) {
          throw new Error('No response received from API')
        }

        // Check if response has data
        if (!response.data) {
          throw new Error('No data in API response')
        }

        const userData = response.data.data || response.data

        console.log('User data extracted:', userData) // Debug log

        this.selectedUser = userData

        // Update user in the list if it exists
        const userIndex = this.users.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          this.users[userIndex] = userData
        }

        const result = { success: true, data: userData }
        console.log('Returning result:', result) // Debug log
        return result
      } catch (error) {
        console.error('Error fetching user:', error) // Debug log
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        })

        this.error = error.message
        return {
          success: false,
          error: error.message,
          errorData: error.response?.data
        }
      } finally {
        this.loading = false
      }
    },

    // Create new user
    async createUser(formData) {
      this.loading = true
      this.error = null

      // Validate form data
      const validation = userHelpers.validateUserData(formData)
      if (!validation.isValid) {
        this.loading = false
        return {
          success: false,
          error: 'Validation failed',
          errorData: { errors: validation.errors }
        }
      }

      try {
        const userData = userHelpers.createUserFromForm(formData)
        const response = await this._makeApiRequest('POST', API_ROUTES.users.create, userData)

        const result = this._handleCreateUserSuccess(response)
        return { ...result, success: true }
      } catch (error) {
        this.error = error.message
        return {
          success: false,
          error: error.message,
          errorData: error.response?.data
        }
      } finally {
        this.loading = false
      }
    },

    // Handle successful API user creation
    _handleCreateUserSuccess(response) {
      const newUser = response.data.data || response.data
      this.users.unshift(newUser)
      this.pagination.total += 1
      return { success: true, data: newUser }
    },

    // Update existing user
    async updateUser(id, formData) {
      this.loading = true
      this.error = null

      // Validate form data
      const validation = userHelpers.validateUserData(formData)
      if (!validation.isValid) {
        this.loading = false
        return {
          success: false,
          error: 'Validation failed',
          errorData: { errors: validation.errors }
        }
      }

      try {
        const userData = userHelpers.createUserFromForm(formData)
        const response = await this._makeApiRequest('POST', API_ROUTES.users.update(id), userData)

        const result = this._handleUpdateUserSuccess(id, response)
        return { ...result, success: true }
      } catch (error) {
        this.error = error.message
        return {
          success: false,
          error: error.message,
          errorData: error.response?.data
        }
      } finally {
        this.loading = false
      }
    },

    // Handle successful API user update
    _handleUpdateUserSuccess(id, response) {
      const updatedUser = response.data.data || response.data

      const userIndex = this.users.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        this.users[userIndex] = updatedUser
      }

      if (this.selectedUser && this.selectedUser.id === id) {
        this.selectedUser = updatedUser
      }

      return { success: true, data: updatedUser }
    },

    // Delete user
    async deleteUser(id) {
      this.loading = true
      this.error = null

      try {
        await this._makeApiRequest('DELETE', API_ROUTES.users.delete(id))
        return this._handleDeleteUserSuccess(id)
      } catch (error) {
        this.error = error.message
        return {
          success: false,
          error: error.message,
          errorData: error.response?.data
        }
      } finally {
        this.loading = false
      }
    },

    // Handle successful API user deletion
    _handleDeleteUserSuccess(id) {
      this.users = this.users.filter(user => user.id !== id)
      this.pagination.total -= 1

      if (this.selectedUser && this.selectedUser.id === id) {
        this.selectedUser = null
      }

      return { success: true }
    },

    // Generic API request handler
    async _makeApiRequest(method, url, data = null, config = {}) {
      switch (method.toUpperCase()) {
        case 'GET':
          return await apiService.get(url, config)
        case 'POST':
          return await apiService.post(url, data, config)
        case 'PUT':
          return await apiService.put(url, data, config)
        case 'DELETE':
          return await apiService.delete(url, config)
        default:
          throw new Error(`Unsupported HTTP method: ${method}`)
      }
    },

    // Search users
    async searchUsers(searchTerm, page = 1, perPage = 10) {
      return await this.fetchUsers(page, perPage, { search: searchTerm })
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Set selected user
    setSelectedUser(user) {
      this.selectedUser = user
    },

    // Clear selected user
    clearSelectedUser() {
      this.selectedUser = null
    },

    // Reset store
    reset() {
      this.users = []
      this.selectedUser = null
      this.loading = false
      this.error = null
      this.pagination = {
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        total: 0
      }
    }
  }
})