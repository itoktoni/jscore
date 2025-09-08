import { ref, reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../stores/http'

/**
 * Composable for managing table functionality
 * Provides reactive state and methods for handling table data, pagination, and search
 */
export function useFormTable(options = {}) {
  const {
    endpoint,
    initialData = {},
    deleteEndpoint = null
  } = options

  // Router and route
  const route = useRoute()
  const router = useRouter()

  // Reactive properties
  const formData = reactive({ ...initialData })
  const fieldErrors = ref({})
  const isSubmitting = ref(false)
  const tableData = ref([])
  const pagination = ref(null)

  // Handle search function
  const handleSearch = async () => {
    isSubmitting.value = true
    fieldErrors.value = {}

    try {
      const params = {
        ...formData,
        page: formData.page || route.query.page || 1
      }

      const response = await http.get(endpoint, { params })
      const data = response.data

      // Handle both direct array response and paginated response
      if (Array.isArray(data)) {
        tableData.value = data
        pagination.value = null
      } else if (data.data) {
        tableData.value = data.data
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          from: data.from,
          to: data.to
        }
      } else {
        tableData.value = []
        pagination.value = null
      }

      // Update URL parameters
      updateUrlParams()

      return response
    } catch (error) {
      fieldErrors.value = error.response?.data?.errors || {}
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // Handle reset function
  const handleReset = () => {
    // Reset form data to initial values
    Object.keys(formData).forEach(key => {
      formData[key] = initialData[key] || ''
    })

    // Ensure page is reset to 1
    formData.page = 1

    // Reset field errors
    fieldErrors.value = {}

    // Update URL parameters
    updateUrlParams()

    // Perform search with reset data
    return handleSearch()
  }

  // Change page function
  const changePage = (page) => {
    // Update form data with new page
    formData.page = page

    // Update URL parameters
    updateUrlParams()

    // Perform search with new page
    return handleSearch()
  }

  // Update URL parameters
  const updateUrlParams = () => {
    const query = {}

    // Add form data to query, but only include non-empty values
    // Also exclude page=1 to keep URLs clean
    Object.keys(formData).forEach(key => {
      if (formData[key] && (key !== 'page' || formData[key] !== 1)) {
        query[key] = formData[key]
      }
    })

    // Update URL without reload
    router.push({ query })
  }

  // Watch for route changes
  const watchRouteChanges = () => {
    watch(
      () => route.query,
      () => {
        // Check if we're on the base route with no query parameters
        const isBaseRoute = Object.keys(route.query).length === 0;

        if (isBaseRoute) {
          // Reset form data to initial values when on base route
          Object.keys(formData).forEach(key => {
            formData[key] = initialData[key] || ''
          })
          // Ensure page is reset to 1
          formData.page = 1
        } else {
          // Update form data from query parameters
          Object.keys(initialData).forEach(key => {
            if (route.query[key] !== undefined) {
              formData[key] = route.query[key]
            } else {
              formData[key] = initialData[key] || ''
            }
          })

          // Only reset page to 1 when navigating to the route if no page is specified in query
          // This ensures that when users navigate to /users, they start on page 1
          // but preserves page parameter when it's explicitly set
          if (route.query.page === undefined && !formData.page) {
            formData.page = 1
          }
        }

        // Perform search when route changes
        handleSearch()
      },
      { immediate: true }
    )
  }

  // Initialize component
  const initialize = () => {
    watchRouteChanges()
  }

  // Refresh method (alias for handleSearch)
  const refresh = handleSearch

  // Delete item function
  const deleteItem = async (deleteUrl) => {
    try {
      // Perform GET request for deletion (as per project requirements)
      await http.get(deleteUrl)
      // Refresh the table after successful deletion
      await refresh()
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // Batch delete items function
  const batchDeleteItems = async (selectedItems) => {
    if (!deleteEndpoint) {
      throw new Error('No delete endpoint provided')
    }

    try {
      // Perform the deletion for selected items
      await http.post(deleteEndpoint, { code: selectedItems })
      // Refresh the table after successful deletion
      await refresh()
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  return {
    // State
    formData,
    fieldErrors,
    isSubmitting,
    tableData,
    pagination,

    // Methods
    handleSearch,
    handleReset,
    changePage,
    updateUrlParams,
    refresh,
    deleteItem,
    batchDeleteItems,
    initialize
  }
}