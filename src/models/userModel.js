/**
 * User Model - Defines the structure and default values for user data
 */

export const UserModel = {
  // Default empty user object
  createEmpty() {
    return {
      username: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: ''
    }
  },

  // Default user object with example values
  createDefault() {
    return {
      username: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: ''
    }
  }
}

export default UserModel