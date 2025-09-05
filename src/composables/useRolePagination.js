import { ref } from 'vue'
import { roleService } from '../services/roleService'

/**
 * Role pagination composable for handling paginated role data
 * @returns {Object} - Role pagination state and methods
 */
export function useRolePagination() {
  // State management
  const roles = ref([])
  const loading = ref(false)
  const page = ref(1)
  const perPage = ref(10)
  const totalRecords = ref(0)

  // Fetch all roles with pagination
  const fetchRoles = async (currentPage = page.value, itemsPerPage = perPage.value) => {
    loading.value = true
    try {
      const response = await roleService.getAllRoles(currentPage, itemsPerPage)

      // Handle different response structures
      if (response) {
        if (Array.isArray(response)) {
          // Simple array response
          roles.value = response
          totalRecords.value = response.length
        } else if (response.data) {
          // Paginated response with data property
          roles.value = Array.isArray(response.data) ? response.data : []
          totalRecords.value = response.total || response.data.length || 0
        } else {
          // Unexpected response structure
          roles.value = []
          totalRecords.value = 0
        }
      } else {
        roles.value = []
        totalRecords.value = 0
      }

      page.value = currentPage
      perPage.value = itemsPerPage
    } catch (error) {
      console.error('Error fetching roles:', error)
      roles.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    roles,
    loading,
    page,
    perPage,
    totalRecords,

    // Methods
    fetchRoles
  }
}