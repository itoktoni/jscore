/**
 * User List Page
 *
 * User management page with CRUD operations and mobile-optimized design
 */

<template>
  <div class="card">
    <!-- Header -->
    <div class="page-header">
      <h2>User Management</h2>
    </div>

    <!-- Card Container -->
    <div class="form-container">
      <!-- Search and Filters Row -->
      <div class="row">
        <div class="col">
          <p class="grouped">
            <label for="per-page-select">Per Page</label>
            <select name="perPage" id="per-page-select" v-model="searchData.perPage">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </p>
        </div>

        <div class="col">
          <p class="grouped">
            <label for="filter-input">Search Users</label>
            <input
              type="search"
              name="search"
              id="filter-input"
              placeholder="Search users..."
              v-model="searchData.search"
            >
            <button class="button icon-only" @click="handleSearch">
              <img src="https://icongr.am/feather/search.svg?size=16" alt="Search">
            </button>
          </p>
        </div>
      </div>

      <hr class="hr">

      <!-- Loading State -->
      <div v-if="userStore.loading" class="loading">
        Loading users...
      </div>

      <!-- Error State -->
      <ErrorMessage v-else-if="userStore.error" :message="userStore.error">
        <FormButton
          variant="primary"
          @click="loadUsers"
          text="Retry"
          size="small"
        />
      </ErrorMessage>

      <!-- No Users State -->
      <div v-else-if="!userStore.hasUsers" class="no-users">
        <p>No users found.</p>
        <FormButton
          variant="success"
          @click="createUser"
          text="Create First User"
        />
      </div>

      <!-- Users Table -->
      <div v-else>

        <table class="form-container data-table striped">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                >
              </th>
              <th class="action-header text-center">Actions</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users" :key="user.id">
              <td>
                <input
                  type="checkbox"
                  v-model="user.selected"
                  @change="updateSelectAll"
                >
              </td>
              <td class="column-action">
                <div class="action-table">
                  <button class="button primary" @click.stop="viewUser(user)" title="View">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="button secondary" @click.stop="editUser(user)" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="button error" @click.stop="confirmDelete(user)" title="Delete">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
              <td>
                <div class="user-name-cell">
                  <div class="user-avatar">
                    {{ getInitials(user.name || user.username) }}
                  </div>
                  <span>{{ user.name || user.username }}</span>
                </div>
              </td>
              <td>@{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="userStore.pagination.totalPages > 1" class="pagination">
          <FormButton
            @click="changePage(userStore.pagination.currentPage - 1)"
            :disabled="userStore.pagination.currentPage <= 1"
            variant="secondary"
            text="Previous"
          />

          <span class="page-info">
            Page {{ userStore.pagination.currentPage }} of {{ userStore.pagination.totalPages }}
            ({{ userStore.pagination.total }} total users)
          </span>

          <FormButton
            @click="changePage(userStore.pagination.currentPage + 1)"
            :disabled="userStore.pagination.currentPage >= userStore.pagination.totalPages"
            variant="secondary"
            text="Next"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="content-footer">
      <div class="footer-actions">
        <FormButton
          variant="secondary"
          @click="loadUsers"
          text="Refresh"
        />
        <FormButton
          variant="danger"
          @click="deleteSelected"
          text="Delete"
          :disabled="!hasSelectedUsers"
        />
        <FormButton
          variant="success"
          @click="createUser"
          text="+ Create"
        />
      </div>
    </footer>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Confirm Delete"
      :message="`Are you sure you want to delete user '${userToDelete?.name || userToDelete?.username}'?`"
      warning="This action cannot be undone."
      @confirm="deleteUser"
      @cancel="showDeleteConfirm = false"
    />

    <!-- User Detail Modal -->
    <Show
      v-if="showUserDetail"
      :user="selectedUser"
      @edit="editUser"
      @close="showUserDetail = false"
    />



  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useUserStore } from '../../stores/user'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import Show from './Show.vue'

const router = useRouter()
const userStore = useUserStore()

// Modal states
const showDeleteConfirm = ref(false)
const showUserDetail = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)

// Table selection states
const selectAll = ref(false)

// Search data
const searchData = reactive({
  search: '',
  perPage: 10
})

// Test functions for debugging
const testEditUser = () => {
  console.log('=== Test Edit User Function ===')
  // Use the first user in the list for testing
  if (userStore.users && userStore.users.length > 0) {
    const testUser = userStore.users[0]
    console.log('Testing with user:', testUser)
    editUser(testUser)
  } else {
    console.log('No users available for testing')
  }
}

const testCreateUser = () => {
  console.log('=== Test Create User Function ===')
  createUser()
}

// Methods
const loadUsers = async (page = 1) => {
  await userStore.fetchUsers(page, searchData.perPage)
}

const handleSearch = async () => {
  if (searchData.search.trim()) {
    await userStore.searchUsers(searchData.search.trim(), 1, searchData.perPage)
  } else {
    await loadUsers(1)
  }
}

const changePage = async (page) => {
  if (searchData.search.trim()) {
    await userStore.searchUsers(searchData.search.trim(), page, searchData.perPage)
  } else {
    await loadUsers(page)
  }
}

const createUser = () => {
  router.push('/users/create')
}

const editUser = (user) => {
  if (showUserDetail.value) showUserDetail.value = false
  router.push(`/users/${user.id}/edit`)
}

const viewUser = (user) => {
  selectedUser.value = user
  showUserDetail.value = true
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const deleteUser = async () => {
  if (userToDelete.value) {
    try {
      const result = await userStore.deleteUser(userToDelete.value.id)
      if (result.success) {
        showDeleteConfirm.value = false
        userToDelete.value = null
        // Refresh the user list after successful deletion
        await loadUsers()
      } else {
        // Handle error case - still refresh the list to ensure consistency
        showDeleteConfirm.value = false
        userToDelete.value = null
        // Refresh the user list even after failed deletion to ensure UI consistency
        await loadUsers()
      }
    } catch (error) {
      showDeleteConfirm.value = false
      userToDelete.value = null
      // Refresh the user list even after error to ensure UI consistency
      await loadUsers()
    }
  }
}

// Table selection methods
const toggleSelectAll = () => {
  if (userStore.users) {
    userStore.users.forEach(user => {
      user.selected = selectAll.value
    })
  }
}

const updateSelectAll = () => {
  if (userStore.users) {
    const selectedUsers = userStore.users.filter(user => user.selected)
    selectAll.value = selectedUsers.length === userStore.users.length
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Add data labels for mobile responsiveness
const addDataLabelsToTable = () => {
  const table = document.querySelector('.data-table')
  if (!table) {
    // Try again after a longer delay
    setTimeout(() => {
      const retryTable = document.querySelector('.data-table')
      if (!retryTable) {
        return
      }
      processTable(retryTable)
    }, 500)
    return
  }

  processTable(table)
}

const processTable = (table) => {
  const headers = Array.from(table.querySelectorAll('thead th'))
  const rows = table.querySelectorAll('tbody tr')

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td')
    cells.forEach((cell, cellIndex) => {
      if (headers[cellIndex]) {
        const headerText = headers[cellIndex].textContent.trim()
        if (headerText !== '' && !headerText.includes('checkbox')) {
          cell.setAttribute('data-label', headerText)
        } else {
        }
      } else {
      }
    })
  })

}

// Debug function to check if data labels are present
const checkDataLabels = () => {
  const table = document.querySelector('.data-table')
  if (!table) {
    return
  }

  const rows = table.querySelectorAll('tbody tr')
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td')
    cells.forEach((cell, cellIndex) => {
      const dataLabel = cell.getAttribute('data-label')
    })
  })
}

// Footer functionality
const hasSelectedUsers = computed(() => {
  if (!userStore.users) return false
  return userStore.users.some(user => user.selected)
})

const deleteSelected = async () => {
  if (!userStore.users) return

  const selectedUsers = userStore.users.filter(user => user.selected)
  if (selectedUsers.length === 0) return

  try {
    // Implement bulk delete logic here

    // For now, just refresh the user list
    await loadUsers()
  } catch (error) {
    // Refresh the user list even after error to ensure UI consistency
    await loadUsers()
  }
}

// Watch for user data changes
watch(
  () => userStore.users,
  (newUsers) => {
    if (newUsers && newUsers.length > 0) {
      // Add a small delay to ensure DOM is updated with new data
      setTimeout(() => {
        addDataLabelsToTable()
      }, 100)
    }
  },
  { deep: true }
)

// Refresh data when route is updated (e.g. when navigating back from user form)
onBeforeRouteUpdate((to, from) => {
  if (to.path === '/users') {
    loadUsers()
  }
})

// Initialize
onMounted(async () => {
  await loadUsers()
  // Add a small delay to ensure DOM is fully rendered
  setTimeout(() => {
    addDataLabelsToTable()
  }, 100)
})


</script>

<style scoped>

</style>