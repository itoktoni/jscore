import CreatePage from '../pages/user/Create.vue'
import EditPage from '../pages/user/Edit.vue'
import DashboardPage from '../pages/dashboard/DashboardPage.vue'
import TablePage from '../pages/user/Table.vue'

// User route constants - new simplified names
export const ROUTES = {
  LIST: 'UserList',
  TABLE: 'UserTable',
  CREATE: 'UserCreate',
  EDIT: 'UserEdit',
  DASHBOARD: 'UserDashboard'
}

// Module name
export const MODULE = 'Users'
export const MODULE_LINK = 'users'

// User API routes - new simplified names
export const API = {
  LIST: '/api-user/data',
  CREATE: '/api-user/create',
  UPDATE: (id) => `/api-user/update/${id}`,
  DELETE: (id) => `/api-user/delete/?code=${id}`,
  REMOVE: '/api-user/delete',
  SHOW: (id) => `/api-user/${id}`
}

export const userRoutes = [
  {
    path: '/dashboard',
    name: ROUTES.DASHBOARD,
    component: DashboardPage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/users',
    name: ROUTES.LIST,
    component: TablePage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/table',
    name: ROUTES.TABLE,
    component: TablePage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/create',
    name: ROUTES.CREATE,
    component: CreatePage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/:id/edit',
    name: ROUTES.EDIT,
    component: EditPage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  }
]