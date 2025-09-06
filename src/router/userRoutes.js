import UserListPage from '../pages/user/List.vue'
import UserFormCreate from '../pages/user/Create.vue'
import UserFormEdit from '../pages/user/Edit.vue'
import DashboardPage from '../pages/dashboard/DashboardPage.vue'
import UserTablePage from '../pages/user/Table.vue'

// User route constants
export const USER_ROUTES = {
  USER_LIST: 'UserList',
  USER_TABLE: 'UserTable',
  CREATE_USER: 'CreateUser',
  EDIT_USER: 'EditUser',
  DASHBOARD: 'Dashboard'
}

// User API routes
export const USER_API_ROUTES = {
  list: '/api-user/data',
  create: '/api-user/create',
  update: (id) => `/api-user/update/${id}`,
  delete: (id) => `/api-user/delete/?code=${id}`,
  remove: '/api-user/delete',
  show: (id) => `/api-user/${id}`
}

export const userRoutes = [
  {
    path: '/dashboard',
    name: USER_ROUTES.DASHBOARD,
    component: DashboardPage,
    meta: {
      requiresAuth: true // Only accessible when authenticated
    }
  },
  {
    path: '/users',
    name: USER_ROUTES.USER_LIST,
    component: UserTablePage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/table',
    name: USER_ROUTES.USER_TABLE,
    component: UserTablePage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/create',
    name: USER_ROUTES.CREATE_USER,
    component: UserFormCreate,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/users/:id/edit',
    name: USER_ROUTES.EDIT_USER,
    component: UserFormEdit,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  }
]