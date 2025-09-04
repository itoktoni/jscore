/**
 * Response Handler Composable
 *
 * Provides standardized response formatting for API calls
 */

export function useResponse() {
  /**
   * Format a successful response
   * @param {any} data - The response data
   * @returns {Object} Formatted success response
   */
  const responseSuccess = (data) => {
    const result = data?.data || data
    return {
      success: true,
      data: result
    }
  }

  /**
   * Format an error response
   * @param {Error} error - The error object
   * @returns {Object} Formatted error response
   */
  const responseError = (error) => {
    return {
      success: false,
      error: error.message,
      errorData: error.response?.data
    }
  }

  return {
    responseSuccess,
    responseError
  }
}