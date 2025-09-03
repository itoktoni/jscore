import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import UserListPage from '../pages/user/List.vue'
import UserFormCreate from '../pages/user/Create.vue'
import UserFormEdit from '../pages/user/Edit.vue'
import SystemSettingsPage from '../pages/SystemSettingsPage.vue'
import TestSafeArea from '../components/TestSafeArea.vue'
import TestSafeAreaPage from '../pages/TestSafeAreaPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserListPage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/create',
    name: 'CreateUser',
    component: UserFormCreate,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: UserFormEdit,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
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