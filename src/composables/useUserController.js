/**
 * User Controller - Functional ES6 Controller Implementation
 *
 * Implements Laravel-style RESTful methods for user management with integrated validation
 */

import { http } from '../stores/http'
import { useApiRoutes } from './useApiRoutes'

// Validation functions
const validators = {
  required: function(value) {
    return !value || value.toString().trim() === '' ? 'This field is required' : null
  },

  email: function(value) {
    if (!value) return null
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : 'Please enter a valid email address'
  },

  min: function(value, min) {
    if (!value) return null
    return value.length >= min
      ? null
      : `Must be at least ${min} characters`
  },

  confirmed: function(value, formData, field) {
    if (!value) return null
    const confirmField = field === 'password' ? 'password_confirmation' : field + '_confirmation'
    const confirmValue = formData[confirmField]
    return value === confirmValue
      ? null
      : 'Passwords do not match'
  }
}

// Parse rules string into validation functions
const parseRules = function(rulesString) {
  if (!rulesString) return []

  return rulesString.split('|').map(rule => {
    const [ruleName, ruleValue] = rule.split(':')
    return { name: ruleName, value: ruleValue }
  })
}

// Validate a field based on rules
const validateField = function(fieldName, value, rulesString, formData) {
  const rules = parseRules(rulesString)

  for (const rule of rules) {
    let error = null

    switch (rule.name) {
      case 'required':
        error = validators.required(value)
        break
      case 'email':
        error = validators.email(value)
        break
      case 'min':
        error = validators.min(value, parseInt(rule.value))
        break
      case 'confirmed':
        error = validators.confirmed(value, formData, fieldName)
        break
    }

    if (error) {
      return error
    }
  }

  return null
}

// Validate form data based on rules configuration
const validateForm = function(formData, rulesConfig) {
  const errors = {}

  for (const fieldName in rulesConfig) {
    const rulesString = rulesConfig[fieldName]
    const value = formData[fieldName]
    const error = validateField(fieldName, value, rulesString, formData)

    if (error) {
      errors[fieldName] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// User Controller functions
export function useUserController() {
  // Create new user
  async function createUser(formData) {
    try {
      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      // Define validation rules (matching the rules used in the form)
      const validationRules = {
        username: 'required',
        name: 'required',
        email: 'required|email',
        password: 'required|min:6',
        password_confirmation: 'required|confirmed:password'
      }

      // Validate form data
      const validation = validateForm(formData, validationRules)

      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          errorData: { errors: validation.errors }
        }
      }

      // Prepare user data for API (remove password_confirmation)
      const { password_confirmation, ...userData } = formData

      // Make API request
      const response = await http.post(API_ROUTES.users.create, userData)

      // Return success response
      const newUser = response.data.data || response.data
      return {
        success: true,
        data: newUser
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorData: error.response?.data
      }
    }
  }

  // Fetch all users with pagination
  async function fetchUsers(page = 1, perPage = 10, filters = {}) {
    try {
      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      const response = await http.get(API_ROUTES.users.list, {
        params: {
          page,
          per_page: perPage,
          ...filters
        }
      })

      return {
        success: true,
        data: response.data.data || response.data,
        pagination: {
          currentPage: response.data.current_page || page,
          totalPages: response.data.last_page || 1,
          perPage: response.data.per_page || perPage,
          total: response.data.total || (response.data.data ? response.data.data.length : 0)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorData: error.response?.data
      }
    }
  }

  // Get single user by ID
  async function fetchUserById(id) {
    try {
      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      const response = await http.get(API_ROUTES.users.show(id))

      const userData = response.data.data || response.data
      return {
        success: true,
        data: userData
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorData: error.response?.data
      }
    }
  }

  // Update existing user
  async function updateUser(id, formData) {
    try {
      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      // Prepare user data for API (for update, we might want to allow empty passwords)
      const { password_confirmation, ...userData } = formData

      // Make API request
      const response = await http.put(API_ROUTES.users.update(id), userData)

      // Return success response
      const updatedUser = response.data.data || response.data
      return {
        success: true,
        data: updatedUser
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorData: error.response?.data
      }
    }
  }

  // Delete user
  async function deleteUser(id) {
    try {
      // Initialize api routes inside the function to avoid circular dependency
      const { API_ROUTES } = useApiRoutes()

      await http.delete(API_ROUTES.users.delete(id))

      return {
        success: true,
        message: 'User deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorData: error.response?.data
      }
    }
  }

  return {
    createUser,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser
  }
}