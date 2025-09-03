// Mock API data for testing purposes
export const mockRoles = [
  { id: 1, name: 'User' },
  { id: 2, name: 'Administrator' },
  { id: 3, name: 'Moderator' }
]

export const mockStatuses = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
  { id: 3, name: 'Suspended' }
]

// Mock API functions
export const fetchRoles = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRoles)
    }, 500)
  })
}

export const fetchStatuses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStatuses)
    }, 500)
  })
}