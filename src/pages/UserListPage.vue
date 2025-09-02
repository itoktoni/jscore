/**
 * User List Page
 *
 * User management page with CRUD operations and mobile-optimized design
 */

<template>
  <div class="user-list-container">
    <!-- Header -->
    <div class="header">
      <h2>User Management</h2>
      <FormButton
        variant="success"
        @click="createUser"
        text="+ Create User"
      />
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <form @submit.prevent="handleSearch" class="search-form">
        <div class="search-inputs">
          <FormInput
            name="search"
            v-model="searchData.search"
            placeholder="Search users..."
            class="search-input-wrapper"
          />

          <FormSelect
            name="perPage"
            v-model="searchData.perPage"
            :options="perPageOptions"
            class="per-page-wrapper"
          />

          <FormButton
            type="submit"
            variant="primary"
            text="Search"
          />
        </div>
      </form>
    </div>

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

    <!-- User List -->
    <div v-else class="user-list">
      <div v-if="!userStore.hasUsers" class="no-users">
        <p>No users found.</p>
        <FormButton
          variant="success"
          @click="createUser"
          text="Create First User"
        />
      </div>

      <div v-else class="users-grid">
        <div
          v-for="user in userStore.users"
          :key="user.id"
          class="user-card"
        >
          <div class="user-info">
            <div class="user-avatar">
              {{ getInitials(user.name || user.username) }}
            </div>
            <div class="user-details">
              <h3>{{ user.name || user.username }}</h3>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-username">@{{ user.username }}</p>
              <p v-if="user.created_at" class="user-meta">
                Created: {{ formatDate(user.created_at) }}
              </p>
            </div>
          </div>

          <div class="user-actions">
            <FormButton
              variant="primary"
              @click="editUser(user)"
              text="Edit"
              size="small"
            />
            <FormButton
              variant="secondary"
              @click="viewUser(user)"
              text="View"
              size="small"
            />
            <FormButton
              variant="danger"
              @click="confirmDelete(user)"
              text="Delete"
              size="small"
            />
          </div>
        </div>
      </div>

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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'
import FormSelect from '../components/FormSelect.vue'
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

// Search data
const searchData = reactive({
  search: '',
  perPage: 10
})

// Options for FormSelect
const perPageOptions = [
  { label: '10 per page', value: 10 },
  { label: '25 per page', value: 25 },
  { label: '50 per page', value: 50 },
  { label: '100 per page', value: 100 }
]

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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header h2 {
  margin: 0;
  color: #333;
}

.filters-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-form {
  display: flex;
  flex-direction: column;
}

.search-inputs {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-input-wrapper {
  flex: 1;
  min-width: 200px;
}

.per-page-wrapper {
  min-width: 150px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.no-users {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-users p {
  font-size: 18px;
  margin-bottom: 20px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.user-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-details h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-details p {
  margin: 2px 0;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  color: #007bff !important;
}

.user-meta {
  font-size: 12px !important;
  color: #999 !important;
}

.user-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
}

.page-info {
  font-size: 14px;
  color: #666;
  text-align: center;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .user-list-container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    text-align: center;
  }

  .search-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-wrapper,
  .per-page-wrapper {
    min-width: auto;
  }

  .users-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
  }

  .user-actions {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .user-list-container {
    padding: 10px;
  }

  .filters-section {
    padding: 15px;
  }

  .user-card {
    padding: 15px;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .user-avatar {
    margin-right: 0;
    align-self: center;
  }

  .user-details {
    text-align: center;
  }
}
</style>