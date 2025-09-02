/**
 * User Management Composables
 *
 * Provides reusable helper functions for user management
 */

// User helper functions
export function useUserHelpers() {
  // Validate user data
  const validateUserData = (userData) => {
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
  }

  // Create user object from form data
  const createUserFromForm = (formData) => {
    return { ...formData }
  }

  // Apply filters to user list
  const applyFilters = (users, filters) => {
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
  }

  // Apply pagination
  const applyPagination = (users, page, perPage) => {
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

  return {
    validateUserData,
    createUserFromForm,
    applyFilters,
    applyPagination
  }
}