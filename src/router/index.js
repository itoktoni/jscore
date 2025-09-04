import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SystemSettingsPage from '../pages/SystemSettingsPage.vue'
import TestSafeArea from '../components/TestSafeArea.vue'
import TestSafeAreaPage from '../pages/TestSafeAreaPage.vue'
import { userRoutes } from './userRoutes'
import { authRoutes } from './authRoutes'

const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  // Authentication routes
  ...authRoutes,
  // User routes
  ...userRoutes,
  {
    path: '/system/settings',
    name: 'SystemSettings',
    component: SystemSettingsPage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/test-safe-area',
    name: 'TestSafeArea',
    component: TestSafeArea,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/test-safe-area-page',
    name: 'TestSafeAreaPage',
    component: TestSafeAreaPage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.isAuthenticated && !authStore.token) {
    await authStore.initAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'administrator')

  if (requiresAuth && !isAuthenticated) {
    // Route requires authentication but user is not authenticated
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Route requires guest (not authenticated) but user is authenticated
    next('/profile')
  } else if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    // Route requires admin access but user is not admin
    next('/profile')
  } else {
    // Route is accessible
    next()
  }
})

// Add after each hook for debugging
router.afterEach((to, from) => {
})

export default router