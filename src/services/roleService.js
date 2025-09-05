import { http } from '../stores/http'

// Role service
export const roleService = {
  // Get all roles with pagination
  async getAllRoles(page = 1, perPage = 10, filters = {}) {
    try {
      const config = {
        params: {
          page,
          per_page: perPage,
          ...filters
        }
      }

      const response = await http.get('/api-roles/data', config)
      return response.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  },

  // Get role by ID
  async getRoleById(id) {
    try {
      const response = await http.get(`/api-roles/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching role with ID ${id}:`, error)
      throw error
    }
  },

  // Create new role
  async createRole(roleData) {
    try {
      const response = await http.post('/api-roles/create', roleData)
      return response.data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  },

  // Update role
  async updateRole(id, roleData) {
    try {
      const response = await http.put(`/api-roles/update/${id}`, roleData)
      return response.data
    } catch (error) {
      console.error(`Error updating role with ID ${id}:`, error)
      throw error
    }
  },

  // Delete role
  async deleteRole(id) {
    try {
      const response = await http.delete(`/api-roles/delete/?code=${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting role with ID ${id}:`, error)
      throw error
    }
  },

  // Delete multiple roles
  async deleteRoles(ids) {
    try {
      const response = await http.post('/api-roles/delete', { code: ids })
      return response.data
    } catch (error) {
      console.error('Error deleting roles:', error)
      throw error
    }
  }
}