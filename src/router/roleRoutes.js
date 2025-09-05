import RoleListPage from '../pages/role/List.vue'
import RoleFormCreate from '../pages/role/Create.vue'
import RoleFormEdit from '../pages/role/Edit.vue'

// Role route constants
export const ROLE_ROUTES = {
  ROLE_LIST: 'RoleList',
  CREATE_ROLE: 'CreateRole',
  EDIT_ROLE: 'EditRole'
}

// Role API routes
export const ROLE_API_ROUTES = {
  list: '/api-roles/data',
  create: '/api-roles/create',
  update: (id) => `/api-roles/update/${id}`,
  delete: (id) => `/api-roles/delete/?code=${id}`,
  remove: '/api-roles/delete',
  show: (id) => `/api-roles/${id}`
}

export const roleRoutes = [
  {
    path: '/roles',
    name: ROLE_ROUTES.ROLE_LIST,
    component: RoleListPage,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/roles/create',
    name: ROLE_ROUTES.CREATE_ROLE,
    component: RoleFormCreate,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  },
  {
    path: '/roles/:id/edit',
    name: ROLE_ROUTES.EDIT_ROLE,
    component: RoleFormEdit,
    meta: {
      requiresAuth: true, // Only accessible when authenticated
      requiresAdmin: true // Only accessible for admin users
    }
  }
]