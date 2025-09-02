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

        <table class="form-containerdata-table striped">
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
                  <button class="button primary" @click="viewUser(user)" title="View">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="button secondary" @click="editUser(user)" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="button error" @click="confirmDelete(user)" title="Delete">
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
    <UserDetailModal
      v-if="showUserDetail"
      :user="selectedUser"
      @edit="editUser"
      @close="showUserDetail = false"
    />

    <!-- Footer -->
    <footer class="content-footer">
      <div class="footer-actions">
        <FormButton
          variant="danger"
          @click="deleteSelected"
          text="Delete Selected"
          :disabled="!hasSelectedUsers"
        />
        <FormButton
          variant="success"
          @click="createUser"
          text="+ Create User"
        />
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import UserDetailModal from '../components/UserDetailModal.vue'

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

const createUser = () => router.push('/users/create')

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
    const result = await userStore.deleteUser(userToDelete.value.id)
    if (result.success) {
      showDeleteConfirm.value = false
      userToDelete.value = null
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
  if (!table) return

  const headers = Array.from(table.querySelectorAll('thead th'))
  const rows = table.querySelectorAll('tbody tr')

  rows.forEach(row => {
    const cells = row.querySelectorAll('td')
    cells.forEach((cell, index) => {
      if (headers[index]) {
        const headerText = headers[index].textContent.trim()
        if (headerText !== '' && !headerText.includes('checkbox')) {
          cell.setAttribute('data-label', headerText)
        }
      }
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

  // You could show a confirmation modal here or implement bulk delete
  console.log('Delete selected users:', selectedUsers)
  // For now, just log - implement actual bulk delete based on your API
}

// Initialize
onMounted(() => {
  loadUsers()
  addDataLabelsToTable()
})
</script>

<style scoped>

</style>