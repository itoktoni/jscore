import { ref, reactive } from 'vue'
import { http } from '../stores/http'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useAlert } from './useAlert'

/**
 * Generic pagination composable for handling paginated data
 * @param {string} baseUrl - The base API URL for the entity
 * @returns {Object} - Pagination state and methods
 */
export function usePagination(baseUrl) {
  // State management
  const items = ref([])
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

  // Fetch all items with pagination
  const fetchItems = async (page = 1, perPage = 10, filters = {}) => {
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

      console.log('Making API request to:', baseUrl, 'with config:', config)
      const response = await http.get(baseUrl, config)
      console.log('API response received:', response)

      // Handle the pagination structure from the API
      if (response.data) {
        // API structure with pagination metadata
        if (response.data.data) {
          items.value = response.data.data
        } else {
          // Fallback for simple array responses
          items.value = response.data
        }

        // Update pagination information
        pagination.currentPage = response.data.current_page || page
        pagination.totalPages = response.data.last_page || 1
        pagination.perPage = response.data.per_page || perPage
        pagination.total = response.data.total || items.value.length
        pagination.from = response.data.from || 1
        pagination.to = response.data.to || items.value.length
      } else {
        items.value = []
        pagination.currentPage = page
        pagination.totalPages = 1
        pagination.perPage = perPage
        pagination.total = 0
        pagination.from = 0
        pagination.to = 0
      }

      return { success: true, data: items.value }
    } catch (err) {
      // Handle authentication errors
      if (err.response?.status === 401) {
        const message = err.response.data?.message || ''
        if (message.toLowerCase().includes('unauthenticated')) {
          await handleAuthError()
        }
      }

      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Search items
  const searchItems = async (searchTerm, page = 1, perPage = 10, filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const config = {
        params: {
          search: searchTerm,
          page,
          per_page: perPage,
          ...filters // Include additional filters like 'filter'
        }
      }

      const response = await http.get(baseUrl, config)

      // Handle the pagination structure from the API
      if (response.data) {
        // API structure with pagination metadata
        if (response.data.data) {
          items.value = response.data.data
        } else {
          // Fallback for simple array responses
          items.value = response.data
        }

        // Update pagination information
        pagination.currentPage = response.data.current_page || page
        pagination.totalPages = response.data.last_page || 1
        pagination.perPage = response.data.per_page || perPage
        pagination.total = response.data.total || items.value.length
        pagination.from = response.data.from || 1
        pagination.to = response.data.to || items.value.length
      } else {
        items.value = []
        pagination.currentPage = page
        pagination.totalPages = 1
        pagination.perPage = perPage
        pagination.total = 0
        pagination.from = 0
        pagination.to = 0
      }

      return { success: true, data: items.value }
    } catch (err) {
      // Handle authentication errors
      if (err.response?.status === 401) {
        const message = err.response.data?.message || ''
        if (message.toLowerCase().includes('unauthenticated')) {
          await handleAuthError()
        }
      }

      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Handle authentication error - logout and redirect to login
  const handleAuthError = async () => {
    try {
      const authStore = useAuthStore()
      const router = useRouter()
      const { alertError } = useAlert()

      // Logout user
      await authStore.logout()

      // Show alert
      alertError('Session Expired', 'Your session has expired. Please login again.')

      // Redirect to login
      if (router) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error handling authentication error:', error)
    }
  }

  // Reset state
  const reset = () => {
    items.value = []
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
  const totalItems = () => items.value.length

  const hasItems = () => items.value.length > 0

  return {
    // State
    items,
    loading,
    error,
    pagination,

    // Getters
    totalItems,
    hasItems,

    // Pagination Actions
    fetchItems,
    searchItems,
    reset
  }
}