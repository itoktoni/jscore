import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import ProfilePage from '../pages/auth/ProfilePage.vue'

// Authentication route constants
export const AUTH_ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile'
}

export const authRoutes = [
  {
    path: '/login',
    name: AUTH_ROUTES.LOGIN,
    component: LoginPage,
    meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
  },
  {
    path: '/register',
    name: AUTH_ROUTES.REGISTER,
    component: RegisterPage,
    meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
  },
  {
    path: '/profile',
    name: AUTH_ROUTES.PROFILE,
    component: ProfilePage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  }
]