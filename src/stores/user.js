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
import { http } from './http'
import { useApiRoutes } from '../composables/useApiRoutes'
import { useResponse } from '../composables/useResponse'

// Initialize response composable
const { responseSuccess, responseError } = useResponse()

// User helper functions (moved from useUserHelpers.js)
const userHelpers = {
  // Validate user data
  validateUserData: (userData) => {
    const errors = {}

    if (!userData.username?.trim()) {
      errors.username = 'Username is required'
    }

    if (!userData.name?.trim()) {
      errors.name = 'Name is required'
    }

    if (!userData.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Invalid email format'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Create user object from form data
  createUserFromForm: (formData) => {
    return { ...formData }
  },

  // Apply filters to user list
  applyFilters: (users, filters) => {
    let filtered = [...users]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  },

  // Apply pagination
  applyPagination: (users, page, perPage) => {
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedUsers = users.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(users.length / perPage),
        perPage: perPage,
        total: users.length
      }
    }
  }
}

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

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

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
        return responseError(error)
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

      return responseSuccess(this.users)
    },

    // Get single user by ID
    async fetchUserById(id) {
      this.loading = true
      this.error = null

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

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
        return responseSuccess(result)
      } catch (error) {
        console.error('Error fetching user:', error) // Debug log
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        })

        this.error = error.message
        return responseError(error)
      } finally {
        this.loading = false
      }
    },

    // Create new user
    async createUser(formData) {
      this.loading = true
      this.error = null

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      // Validate form data
      const validation = userHelpers.validateUserData(formData)
      if (!validation.isValid) {
        this.loading = false
        return responseError({
          message: 'Validation failed',
          errorData: { errors: validation.errors }
        })
      }

      try {
        const userData = userHelpers.createUserFromForm(formData)
        const response = await this._makeApiRequest('POST', API_ROUTES.users.create, userData)

        // Add new user to the list
        if (response.data) {
          const newUser = response.data.data || response.data
          this.users.unshift(newUser)
        }

        return responseSuccess({ message: 'User created successfully' })
      } catch (error) {
        this.error = error.message
        return responseError(error)
      } finally {
        this.loading = false
      }
    },

    // Update existing user
    async updateUser(id, formData) {
      this.loading = true
      this.error = null

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      // Validate form data
      const validation = userHelpers.validateUserData(formData)
      if (!validation.isValid) {
        this.loading = false
        return responseError({
          message: 'Validation failed',
          errorData: { errors: validation.errors }
        })
      }

      try {
        const userData = userHelpers.createUserFromForm(formData)
        const response = await this._makeApiRequest('PUT', API_ROUTES.users.update(id), userData)

        // Update user in the list
        if (response.data) {
          const updatedUser = response.data.data || response.data
          const userIndex = this.users.findIndex(user => user.id === id)
          if (userIndex !== -1) {
            this.users[userIndex] = updatedUser
          }
          this.selectedUser = updatedUser
        }

        return responseSuccess({ message: 'User updated successfully' })
      } catch (error) {
        this.error = error.message
        return responseError(error)
      } finally {
        this.loading = false
      }
    },

    // Delete user
    async deleteUser(id) {
      this.loading = true
      this.error = null

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      try {
        await this._makeApiRequest('DELETE', API_ROUTES.users.delete(id))

        // Remove user from the list
        this.users = this.users.filter(user => user.id !== id)

        // Clear selected user if it was the one being deleted
        if (this.selectedUser && this.selectedUser.id === id) {
          this.selectedUser = null
        }

        return responseSuccess({ message: 'User deleted successfully' })
      } catch (error) {
        this.error = error.message
        return responseError(error)
      } finally {
        this.loading = false
      }
    },

    // Search users
    async searchUsers(searchTerm, page = 1, perPage = 10) {
      this.loading = true
      this.error = null

      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      try {
        const response = await this._makeApiRequest('GET', API_ROUTES.users.list, {
          params: {
            search: searchTerm,
            page,
            per_page: perPage
          }
        })

        return this._handleApiResponse(response, page, perPage)
      } catch (error) {
        this.error = error.message
        return responseError(error)
      } finally {
        this.loading = false
      }
    },

    // Make API request with error handling
    async _makeApiRequest(method, url, data = null) {
      try {
        let response
        switch (method.toUpperCase()) {
          case 'GET':
            response = await http.get(url)
            break
          case 'POST':
            response = await http.post(url, data)
            break
          case 'PUT':
            response = await http.put(url, data)
            break
          case 'DELETE':
            response = await http.delete(url)
            break
          default:
            throw new Error(`Unsupported HTTP method: ${method}`)
        }
        return response
      } catch (error) {
        console.error(`API request failed: ${method} ${url}`, error)
        throw error
      }
    },

    // Reset store state
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