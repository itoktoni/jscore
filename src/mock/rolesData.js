// Mock roles data for testing
export const mockRoles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['user_management', 'role_management', 'system_settings'],
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Can edit content',
    permissions: ['content_edit', 'content_view'],
    created_at: '2023-02-20T14:15:00Z',
    updated_at: '2023-02-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Viewer',
    description: 'Can view content only',
    permissions: ['content_view'],
    created_at: '2023-03-10T09:45:00Z',
    updated_at: '2023-03-10T09:45:00Z'
  },
  {
    id: 4,
    name: 'Manager',
    description: 'Can manage users and content',
    permissions: ['user_view', 'content_edit', 'content_view'],
    created_at: '2023-04-05T16:20:00Z',
    updated_at: '2023-04-05T16:20:00Z'
  }
]

// Mock API functions
export const mockRoleApi = {
  // Get all roles with pagination
  getAllRoles: (page = 1, perPage = 10, filters = {}) => {
    let filteredRoles = [...mockRoles]

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredRoles = filteredRoles.filter(role =>
        role.name.toLowerCase().includes(searchTerm) ||
        (role.description && role.description.toLowerCase().includes(searchTerm))
      )
    }

    // Apply pagination
    const total = filteredRoles.length
    const totalPages = Math.ceil(total / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const data = filteredRoles.slice(startIndex, endIndex)

    return {
      data: data,
      current_page: page,
      last_page: totalPages,
      per_page: perPage,
      total: total,
      from: startIndex + 1,
      to: Math.min(endIndex, total)
    }
  },

  // Get role by ID
  getRoleById: (id) => {
    return mockRoles.find(role => role.id === parseInt(id))
  },

  // Create new role
  createRole: (roleData) => {
    const newRole = {
      id: mockRoles.length + 1,
      ...roleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockRoles.push(newRole)
    return newRole
  },

  // Update role
  updateRole: (id, roleData) => {
    const index = mockRoles.findIndex(role => role.id === parseInt(id))
    if (index !== -1) {
      mockRoles[index] = {
        ...mockRoles[index],
        ...roleData,
        updated_at: new Date().toISOString()
      }
      return mockRoles[index]
    }
    return null
  },

  // Delete role
  deleteRole: (id) => {
    const index = mockRoles.findIndex(role => role.id === parseInt(id))
    if (index !== -1) {
      mockRoles.splice(index, 1)
      return true
    }
    return false
  },

  // Delete multiple roles
  deleteRoles: (ids) => {
    const idArray = Array.isArray(ids) ? ids : [ids]
    const deletedCount = idArray.reduce((count, id) => {
      const index = mockRoles.findIndex(role => role.id === parseInt(id))
      if (index !== -1) {
        mockRoles.splice(index, 1)
        return count + 1
      }
      return count
    }, 0)
    return deletedCount
  }
}