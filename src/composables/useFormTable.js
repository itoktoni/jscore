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
  const hasPerformedSearch = ref(false)

  // Handle search function
  const handleSearch = async (updateUrl = true) => {
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

      // Mark that a search has been performed
      hasPerformedSearch.value = true

      // Update URL parameters only if requested (for search button clicks)
      if (updateUrl) {
        updateUrlParams()
      }

      return response
    } catch (error) {
      fieldErrors.value = error.response?.data?.errors || {}
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // Handle reset function
  const handleReset = (updateUrl = true) => {
    // Reset form data to initial values
    Object.keys(formData).forEach(key => {
      formData[key] = initialData[key] || ''
    })

    // Ensure page is reset to 1
    formData.page = 1

    // Reset field errors
    fieldErrors.value = {}

    // Update URL parameters if requested
    if (updateUrl) {
      updateUrlParams()
    }

    // Perform search with reset data
    return handleSearch(updateUrl)
  }

  // Change page function
  const changePage = (page, updateUrl = true) => {
    // Update form data with new page
    formData.page = page

    // Update URL parameters if requested
    if (updateUrl) {
      updateUrlParams()
    }

    // Perform search with new page
    return handleSearch(updateUrl)
  }

  // Update URL parameters
  const updateUrlParams = () => {
    const query = {}

    // Add form data to query
    Object.keys(formData).forEach(key => {
      // Only include filter and search if a search has been performed
      if ((key === 'filter' || key === 'search') && hasPerformedSearch.value) {
        query[key] = formData[key] || ''
      }
      // For other fields, only include non-empty values and exclude page=1
      else if (formData[key] && (key !== 'page' || formData[key] !== 1)) {
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
        const hasQueryParams = !isBaseRoute;

        if (isBaseRoute) {
          // Reset form data to initial values when on base route
          Object.keys(formData).forEach(key => {
            formData[key] = initialData[key] || ''
          })
          // Ensure page is reset to 1
          formData.page = 1
          // Reset search flag
          hasPerformedSearch.value = false
        } else {
          // Update form data from query parameters (existing search)
          Object.keys(initialData).forEach(key => {
            if (route.query[key] !== undefined) {
              formData[key] = route.query[key]
            } else {
              formData[key] = initialData[key] || ''
            }
          })

          // Only reset page to 1 when navigating to the route if no page is specified in query
          if (route.query.page === undefined && !formData.page) {
            formData.page = 1
          }

          // Mark that a search has been performed since there are query parameters
          hasPerformedSearch.value = true
        }

        // Perform search when route changes
        // - If there are query params (existing search), perform search with URL update
        // - If it's the base route, perform initial search without URL update
        if (hasQueryParams) {
          handleSearch(true) // Update URL for existing search params
        } else if (isBaseRoute) {
          handleSearch(false) // Don't update URL for initial load
        }
      },
      { immediate: true }
    )
  }

  // Initialize component
  const initialize = () => {
    watchRouteChanges()
  }

  // Refresh method (alias for handleSearch)
  const refresh = (updateUrl = true) => handleSearch(updateUrl)

  // Delete item function
  const deleteItem = async (deleteUrl) => {
    try {
      // Perform GET request for deletion (as per project requirements)
      await http.get(deleteUrl)
      // Refresh the table after successful deletion
      await refresh(true)
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
      await refresh(true)
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