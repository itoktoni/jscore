import { http } from './http'
import { useResponse } from '../composables/useResponse'

const { responseSuccess, responseError } = useResponse()

// State object to hold user data
const state = {
  user: null
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
async function loadProfile() {
  try {
    const response = await http.get('/profile')
    state.user = response.data.data || response.data
    return responseSuccess(state.user)
  } catch (error) {
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

// Handle authentication error - clear user data
async function handleAuthError() {
  state.user = null
  // The actual logout will be handled by the auth store
}

// useUser composable
export const useUser = () => ({
  user: state.user,
  isAdmin: isAdmin(),
  isModerator: isModerator(),
  hasRole,
  canManageUsers: canManageUsers(),
  loadProfile,
  updateProfile
})

// Export all functions and state getters
export {
  state as userState,
  isAdmin,
  isModerator,
  hasRole,
  canManageUsers,
  loadProfile,
  updateProfile,
  handleAuthError
}