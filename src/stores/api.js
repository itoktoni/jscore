import { http } from './http'

class ApiService {
  async testConnection() {
    try {
      // Try to make a simple request to test connectivity
      const response = await http.get('/health') // Using a common health check endpoint
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // If we get a network error, we're offline
      if (!error.response) {
        return {
          success: false,
          error: 'Network error - no connection'
        }
      }

      // If we get a response (even an error response), we're online
      return {
        success: true,
        data: error.response.data
      }
    }
  }
}

export const apiService = new ApiService()
export default apiService