/**
 * API Routes Configuration Composable
 *
 * Centralized API endpoint configuration for the application
 */

export function useApiRoutes() {
  const API_ROUTES = {
    users: {
      list: '/api-user/data',
      create: '/api-user/create',
      update: (id) => `/api-user/update/${id}`,
      delete: (id) => `/api-user/delete/${id}`,
      show: (id) => `/api-user/${id}`
    },
    roles: '/roles',
    statuses: '/statuses'
  }

  // Helper function to get the full URL for an endpoint
  const get = (endpoint) => {
    // For function-based endpoints (like users.update), we return the function
    if (typeof endpoint === 'function') {
      return endpoint
    }

    // For string endpoints, we return the string
    return endpoint
  }

  return {
    API_ROUTES,
    get
  }
}