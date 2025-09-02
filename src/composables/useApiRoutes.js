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
      show: (id) => `/api-user/update/${id}`
    }
  }

  return {
    API_ROUTES
  }
}