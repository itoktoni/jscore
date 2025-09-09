import { Preferences } from '@capacitor/preferences'
import { http } from './http'
import { useResponse } from '../composables/useResponse'
import { useUser, userState, loadProfile } from './user'

const { responseSuccess, responseError } = useResponse()

// State object to hold authentication data
const state = {
  token: null,
  isAuthenticated: false
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
    userState.user = user
    state.isAuthenticated = true

    http.setAuthToken(token)

    // Load full profile data
    await loadProfile()

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

async function register(userData) {
  try {
    const response = await http.post('/register', userData)

    const token = response.data.data.api_token
    const user = response.data.data

    await Preferences.set({
      key: 'auth_token',
      value: token
    })

    state.token = token
    userState.user = user
    state.isAuthenticated = true

    http.setAuthToken(token)

    // Load full profile data
    await loadProfile()

    return responseSuccess({ message: 'Registration successful' })
  } catch (error) {
    // Better error handling for Laravel-style validation responses
    let errorMessage = error.message || 'Registration failed'
    let fieldErrors = {}

    if (error.response?.status === 422) {
      // Laravel validation error
      const errorData = error.response.data
      errorMessage = errorData.message || errorMessage
      fieldErrors = errorData.errors || {}
    } else if (error.response?.data?.message) {
      // Other API error with message
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

async function logout() {
  await Preferences.remove({ key: 'auth_token' })
  state.token = null
  userState.user = null
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
        await loadProfile()
        return responseSuccess({ message: 'Authentication initialized' })
      } catch (error) {
        // If profile loading fails, logout
        await logout()
        return responseError(error)
      }
    }

    return responseSuccess({ message: 'No authentication token found' })

  } catch (error) {
    return responseError(error)
  }
}

// Handle authentication error - logout and prepare for redirect
async function handleAuthError() {
  await logout()
  // The actual redirect will be handled by the router guard or component
}

// Compatibility export for existing imports
export const useAuthStore = () => {
  const userStore = useUser()
  return {
    ...userStore,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    initAuth,
    handleAuthError
  }
}

// Export all functions and state getters
export {
  state,
  login,
  register,
  logout,
  initAuth,
  handleAuthError
}