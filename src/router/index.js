import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SettingsPage from '../pages/system/SettingsPage.vue'
import CapacitorPluginsTest from '../pages/test/CapacitorPluginsTest.vue'
import PluginTestsNavigation from '../pages/test/PluginTestsNavigation.vue'
import PluginsByPackage from '../pages/test/PluginsByPackage.vue' // Added import for plugins by package page
import { userRoutes } from './userRoutes'
import { authRoutes } from './authRoutes'
import { pluginTestRoutes } from '../pages/test/plugins/index.js'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  // Authentication routes
  ...authRoutes,
  // User routes
  ...userRoutes,
  // Role routes
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/test/capacitor-plugins',
    name: 'CapacitorPluginsTest',
    component: CapacitorPluginsTest,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/test/plugin-tests',
    name: 'PluginTestsNavigation',
    component: PluginTestsNavigation,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/test/plugins-by-package',
    name: 'PluginsByPackage',
    component: PluginsByPackage, // Added route for plugins by package page
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  // Individual plugin test routes
  ...pluginTestRoutes,
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
  let authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.isAuthenticated) {
    const result = await authStore.initAuth()

    // Re-get the auth store to get updated values
    authStore = useAuthStore()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'administrator')

  // Route guard logic

  if (requiresAuth && !isAuthenticated) {
    // Route requires authentication but user is not authenticated
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Route requires guest (not authenticated) but user is authenticated
    next('/dashboard')
  } else if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    // Route requires admin access but user is not admin
    next('/dashboard')
  } else {
    // Route is accessible
    next()
  }
})

// Add after each hook for debugging
router.afterEach((to, from) => {
})

// Global error handler for authentication errors
router.onError(async (error) => {
  console.error('Router error:', error)

  // Check if this is an authentication error
  if (error.message && error.message.includes('Unauthenticated')) {
    const authStore = useAuthStore()
    await authStore.logout()
    router.push('/login')
  }
})

export default router