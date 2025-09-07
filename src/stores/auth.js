import { Preferences } from '@capacitor/preferences'
import { http } from './http'
import { useResponse } from '../composables/useResponse'

const { responseSuccess, responseError } = useResponse()

// State object to hold authentication data
const state = {
  user: null,
  token: null,
  isAuthenticated: false
}

// Getter functions
function isAdmin() {
  return state.user && (state.user.role === 'admin' || state.user.role === 'administrator')
}

function isModerator() {
  return state.user && (state.user.role === 'moderator' || state.user.role === 'admin' || state.user.role === 'administrator')
}

function hasRole(role) {
  return state.user && state.user.role === role
}

function canManageUsers() {
  return state.user && (state.user.role === 'admin' || state.user.role === 'administrator')
}

// Action functions
async function login(username, password) {
  try {
    const response = await http.post('/login', {
      username,
      password
    })

    const token = response.data.data.api_token
    const user = response.data.data

    await Preferences.set({
      key: 'auth_token',
      value: token
    })

    state.token = token
    state.user = user
    state.isAuthenticated = true

    http.setAuthToken(token)
    return responseSuccess({ message: 'Login successful' })

  } catch (error) {
    // Better error handling for Laravel-style validation responses
    let errorMessage = error.message || 'Login failed'
    let fieldErrors = {}

    if (error.response?.status === 422) {
      // Laravel validation error
      const errorData = error.response.data
      errorMessage = errorData.message || errorMessage
      fieldErrors = errorData.errors || {}
    } else if (error.response?.data?.message) {
      // Other API error with message
      errorMessage = error.response.data.message
    } else if (error.response?.status === 401) {
      // Unauthorized - usually wrong credentials
      errorMessage = 'Invalid username or password'
    }

    return responseError({
      ...error,
      message: errorMessage,
      response: {
        ...error.response,
        data: {
          ...error.response?.data,
          errors: fieldErrors
        }
      }
    })
  }
}

async function logout() {
  await Preferences.remove({ key: 'auth_token' })
  state.token = null
  state.user = null
  state.isAuthenticated = false
  http.removeAuthToken()

  return responseSuccess({ message: 'Logout successful' })

}

async function initAuth() {
  try {
    const { value: token } = await Preferences.get({ key: 'auth_token' })
    if (token) {
      state.token = token
      state.isAuthenticated = true
      http.setAuthToken(token)

      // Load user profile data
      try {
        console.log('Initializing auth with token, loading profile...')
        await loadProfile()
        return responseSuccess({ message: 'Authentication initialized' })
      } catch (error) {
        console.error('Error loading profile during init:', error)
        // If profile loading fails, logout
        await logout()
        return responseError(error)
      }
    }

    return responseSuccess({ message: 'No authentication token found' })

  } catch (error) {
    console.error('Error initializing auth:', error)
    return responseError(error)
  }
}

async function loadProfile() {
  try {
    console.log('Loading user profile...')
    const response = await http.get('/profile')
    state.user = response.data.data || response.data
    console.log('Profile loaded successfully:', state.user)

    return responseSuccess(state.user)

  } catch (error) {
    console.error('Error loading profile:', error)
    // Handle authentication errors
    if (error.response?.status === 401) {
      const message = error.response.data?.message || ''
      if (message.toLowerCase().includes('unauthenticated')) {
        // Token is invalid, logout and redirect to login
        await handleAuthError()
      }
    }

    return responseError(error)
  }
}

async function updateProfile(profileData) {
  try {
    const response = await http.post('/profile', profileData)
    state.user = response.data.data || response.data
    return responseSuccess({ message: 'Profile updated successfully' })
  } catch (error) {
    // Handle authentication errors
    if (error.response?.status === 401) {
      const message = error.response.data?.message || ''
      if (message.toLowerCase().includes('unauthenticated')) {
        // Token is invalid, logout and redirect to login
        await handleAuthError()
      }
    }

    // Better error handling for profile update
    let errorMessage = error.message || 'Profile update failed'
    let fieldErrors = {}

    if (error.response?.status === 422) {
      // Laravel validation error
      const errorData = error.response.data
      errorMessage = errorData.message || errorMessage
      fieldErrors = errorData.errors || {}
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    return responseError({
      ...error,
      message: errorMessage,
      response: {
        ...error.response,
        data: {
          ...error.response?.data,
          errors: fieldErrors
        }
      }
    })
  }
}

// Handle authentication error - logout and prepare for redirect
async function handleAuthError() {
  await logout()
  // The actual redirect will be handled by the router guard or component
  console.log('Authentication error - user logged out')
}

// Compatibility export for existing imports
export const useAuthStore = () => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
  isAdmin: isAdmin(),
  isModerator: isModerator(),
  hasRole,
  canManageUsers: canManageUsers(),
  login,
  logout,
  initAuth,
  loadProfile,
  updateProfile,
  handleAuthError
})

// Export all functions and state getters
export {
  state,
  isAdmin,
  isModerator,
  hasRole,
  canManageUsers,
  login,
  logout,
  initAuth,
  loadProfile,
  updateProfile,
  handleAuthError
}