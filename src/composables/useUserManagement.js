import { ref, reactive } from 'vue'
import { http } from '../stores/http'
import { USER_API_ROUTES } from '../router/userRoutes'

// User management composable
export function useUserManagement() {
  // State management
  const users = ref([])
  const selectedUser = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0
  })

  // User helper functions
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
    }
  }

  // Fetch all users with pagination
  const fetchUsers = async (page = 1, perPage = 10, filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const config = {
        params: {
          page,
          per_page: perPage,
          ...filters
        }
      }

      const response = await http.get(USER_API_ROUTES.list, config)

      // Handle the new pagination structure from the API
      if (response.data) {
        // New API structure with pagination metadata
        if (response.data.data) {
          users.value = response.data.data
        } else {
          // Fallback for simple array responses
          users.value = response.data
        }

        // Update pagination information
        pagination.currentPage = response.data.current_page || page
        pagination.totalPages = response.data.last_page || 1
        pagination.perPage = response.data.per_page || perPage
        pagination.total = response.data.total || users.value.length
        pagination.from = response.data.from || 1
        pagination.to = response.data.to || users.value.length
      } else {
        users.value = []
        pagination.currentPage = page
        pagination.totalPages = 1
        pagination.perPage = perPage
        pagination.total = 0
        pagination.from = 0
        pagination.to = 0
      }

      return { success: true, data: users.value }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Search users
  const searchUsers = async (searchTerm, page = 1, perPage = 10) => {
    loading.value = true
    error.value = null

    try {
      const config = {
        params: {
          search: searchTerm,
          page,
          per_page: perPage
        }
      }

      const response = await http.get(USER_API_ROUTES.list, config)

      // Handle the new pagination structure from the API
      if (response.data) {
        // New API structure with pagination metadata
        if (response.data.data) {
          users.value = response.data.data
        } else {
          // Fallback for simple array responses
          users.value = response.data
        }

        // Update pagination information
        pagination.currentPage = response.data.current_page || page
        pagination.totalPages = response.data.last_page || 1
        pagination.perPage = response.data.per_page || perPage
        pagination.total = response.data.total || users.value.length
        pagination.from = response.data.from || 1
        pagination.to = response.data.to || users.value.length
      } else {
        users.value = []
        pagination.currentPage = page
        pagination.totalPages = 1
        pagination.perPage = perPage
        pagination.total = 0
        pagination.from = 0
        pagination.to = 0
      }

      return { success: true, data: users.value }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get single user by ID
  const fetchUserById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await http.get(USER_API_ROUTES.show(id))

      // Check if response exists
      if (!response) {
        throw new Error('No response received from API')
      }

      // Check if response has data
      if (!response.data) {
        throw new Error('No data in API response')
      }

      const userData = response.data.data || response.data
      selectedUser.value = userData

      // Update user in the list if it exists
      const userIndex = users.value.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        users.value[userIndex] = userData
      }

      return { success: true, data: userData }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Create new user
  const createUser = async (formData) => {
    loading.value = true
    error.value = null

    // Validate form data
    const validation = userHelpers.validateUserData(formData)
    if (!validation.isValid) {
      loading.value = false
      return { success: false, error: 'Validation failed', errorData: { errors: validation.errors } }
    }

    try {
      const userData = userHelpers.createUserFromForm(formData)
      const response = await http.post(USER_API_ROUTES.create, userData)

      // Add new user to the list
      if (response.data) {
        const newUser = response.data.data || response.data
        users.value.unshift(newUser)
      }

      return { success: true, message: 'User created successfully' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Update existing user
  const updateUser = async (id, formData) => {
    loading.value = true
    error.value = null

    // Validate form data
    const validation = userHelpers.validateUserData(formData)
    if (!validation.isValid) {
      loading.value = false
      return { success: false, error: 'Validation failed', errorData: { errors: validation.errors } }
    }

    try {
      const userData = userHelpers.createUserFromForm(formData)
      const response = await http.put(USER_API_ROUTES.update(id), userData)

      // Update user in the list
      if (response.data) {
        const updatedUser = response.data.data || response.data
        const userIndex = users.value.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          users.value[userIndex] = updatedUser
        }
        selectedUser.value = updatedUser
      }

      return { success: true, message: 'User updated successfully' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Delete user
  const deleteUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      await http.delete(USER_API_ROUTES.delete(id))

      // Remove user from the list
      users.value = users.value.filter(user => user.id !== id)

      // Clear selected user if it was the one being deleted
      if (selectedUser.value && selectedUser.value.id === id) {
        selectedUser.value = null
      }

      return { success: true, message: 'User deleted successfully' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Reset store state
  const reset = () => {
    users.value = []
    selectedUser.value = null
    loading.value = false
    error.value = null
    pagination.currentPage = 1
    pagination.totalPages = 1
    pagination.perPage = 10
    pagination.total = 0
    pagination.from = 0
    pagination.to = 0
  }

  // Getters
  const getUserById = (id) => {
    return users.value.find(user => user.id === id)
  }

  const totalUsers = () => users.value.length

  const hasUsers = () => users.value.length > 0

  return {
    // State
    users,
    selectedUser,
    loading,
    error,
    pagination,

    // Getters
    getUserById,
    totalUsers,
    hasUsers,

    // Actions
    fetchUsers,
    searchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    reset
  }
}