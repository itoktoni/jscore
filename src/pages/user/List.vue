<template>
  <div class="card">
    <!-- Header -->
    <div class="page-header">
      <h2>User Management</h2>
    </div>

    <!-- Card Container -->
    <div class="form-container">
      <!-- Search and Filters Row -->
      <form @submit.prevent="handleFilterSubmit" ref="filterForm">
        <table class="filter data-table">

          <tr>
            <td class="col-4" data-label="Name">
              <p class="grouped">
                <label class="hide-mobile" for="">Name</label>
                <input type="text" name="name" placeholder="Filter by name...">
              </p>
            </td>
            <td class="col-4" data-label="Username">
              <p class="grouped">
                <label class="hide-mobile" for="">Username</label>
                <input type="text" name="username" placeholder="Filter by username...">
              </p>
            </td>
            <td class="col-4" data-label="System Role">
              <p class="grouped">
                <label class="hide-mobile" for="">Role</label>
                <input type="text" name="system_role_name" placeholder="Filter by role...">
              </p>
            </td>
          </tr>

           <tr>
            <td class="col-2" data-label="Per Page">
              <p class="grouped">
                <label class="hide-mobile" for="">Page</label>
                <select name="per_page" v-model="searchData.perPage" @change="handlePerPageChange"
                  class="per-page">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </p>
            </td>
            <td class="col-4" data-label="Filters">
              <p class="grouped">
                <label class="hide-mobile" for="">Filters</label>
                <select name="searchType" v-model="searchData.searchType">
                  <option v-for="option in searchOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </p>
            </td>
            <td class="col-6" data-label="Search">
              <p class="grouped">
                <label class="hide-mobile" for="">Search</label>
                <input type="search" name="search" id="filter-input" placeholder="Search users..."
                  v-model="searchData.search" @keyup.enter="handleSearch">
                <button class="button icon-only" @click="handleSearch">
                  Filter
                </button>
              </p>
            </td>
            <!-- Additional filter fields -->
          </tr>

        </table>
      </form>

      <hr>

      <!-- Loading State -->
      <div class="col-12" v-if="loading">
        <LoadingData />
      </div>

      <!-- Error State -->
      <ErrorMessage v-else-if="error" :message="error">
        <FormButton variant="primary" @click="loadUsers" text="Retry" size="small" />
      </ErrorMessage>

      <!-- No Users State -->
      <div v-else-if="!hasItems() && !loading" class="no-users">
        <p class="text-center">No users found.</p>
      </div>

      <!-- Users Table -->
      <div class="col-12" v-else>
        <div class="table-info mb-2">
          <p>
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users
          </p>

          <p class="select-all"> <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></input></p>

        </div>

        <!-- Table wrapper for horizontal scrolling -->
        <div class="table-wrapper">
          <table class="data-table striped">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                </th>
                <th class="action-header text-center">Actions</th>
                <th>No.</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user.id">
                <td data-label="Select">
                  <input type="checkbox" v-model="user.selected" @change="updateSelectAll">
                </td>
                <td class="column-action" data-label="Actions">
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
                <td data-label="No.">{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}</td>
                <td data-label="Name">
                  <div class="user-name-cell">
                    <span>{{ user.name || user.username }}</span>
                  </div>
                </td>
                <td data-label="Username">@{{ user.username }}</td>
                <td data-label="Email">{{ user.email }}</td>
                <td data-label="Role">{{ user.system_role_name || 'User' }}</td>
                <td data-label="Status">
                  <span :class="user.active ? 'status-active' : 'status-inactive'">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Component -->
        <PaginationComponent :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
          @change-page="changePage" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="content-footer">
      <div class="footer-actions">
        <FormButton variant="secondary" @click="loadUsers" text="Refresh" />
        <FormButton variant="danger" @click="deleteSelected" text="Delete" :disabled="!hasSelectedUsers" />
        <FormButton variant="success" @click="createUser" text="+ Create" />
      </div>
    </footer>

    <!-- User Detail Modal -->
    <Show v-if="showUserDetail" :user="selectedUser" @edit="editUser" @close="showUserDetail = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { USER_ROUTES } from '../../router/userRoutes'
import { USER_API_ROUTES } from '../../router/userRoutes'
import { usePagination } from '../../composables/usePagination'
import { useAlert } from '../../composables/useAlert'
import { http } from '../../stores/http'

import FormButton from '../../components/FormButton.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import Show from './Show.vue'
import LoadingData from '../../components/LoadingData.vue'
import PaginationComponent from '../../components/PaginationComponent.vue'

const router = useRouter()
const route = useRoute()
const filterForm = ref(null)
const { alertConfirm, alertSuccess, alertError } = useAlert()
const {
  items: users,
  loading,
  error,
  pagination,
  fetchItems: fetchUsers,
  searchItems: searchUsers,
  hasItems
} = usePagination(USER_API_ROUTES.list)

// Modal states
const showUserDetail = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)

// Table selection states
const selectAll = ref(false)

// Search data
const searchData = reactive({
  search: '',
  searchType: '', // This will be mapped to 'filter' when sending to server
  perPage: 10
})

// Define search options based on UserModel fields
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' }
]

// Methods
function buildFilterQuery() {
  const formData = new FormData(filterForm.value)
  const filterQuery = {}

  for (const [key, value] of formData.entries()) {
    // Skip empty values and the main search field
    if (value !== '' && key !== 'search' && key !== 'searchType' && key !== 'per_page') {
      filterQuery[key] = value
    }
  }

  // Map searchType to filter parameter
  if (searchData.searchType) {
    filterQuery.filter = searchData.searchType
  }

  return filterQuery
}

// Populate form fields from URL query parameters
function populateFormFromQuery() {
  if (!filterForm.value) return

  const formElements = filterForm.value.elements
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i]
    if (element.name && route.query[element.name]) {
      element.value = route.query[element.name]
    }
  }
}

async function handleFilterSubmit() {
  const filterQuery = buildFilterQuery()
  const page = 1 // Reset to first page when applying filters

  // Build query parameters
  const query = {
    ...route.query,
    page
  }

  // Add search parameters if they exist
  if (searchData.search.trim()) {
    query.search = searchData.search.trim()
    if (searchData.searchType) {
      query.filter = searchData.searchType
    }
  }

  // Add filter parameters
  Object.assign(query, filterQuery)

  // Remove empty filter parameters
  Object.keys(query).forEach(key => {
    if (query[key] === '') {
      delete query[key]
    }
  })

  // Remove searchType from query as it's mapped to filter
  delete query.searchType

  // Update URL
  router.push({ path: route.path, query }).catch(err => {
    console.warn('Router push failed:', err)
  })

  // Apply filters
  if (searchData.search.trim()) {
    await searchUsers(searchData.search.trim(), page, searchData.perPage, filterQuery)
  } else {
    await fetchUsers(page, searchData.perPage, filterQuery)
  }
}

async function handleSearch() {
  if (searchData.search.trim()) {
    // Reset to page 1 when searching
    const filterQuery = buildFilterQuery()

    // Build the search query to match the required format
    const searchParams = {
      ...filterQuery,
      search: searchData.search.trim()
    }

    // Map searchType to filter parameter
    if (searchData.searchType) {
      searchParams.filter = searchData.searchType
    }

    const result = await searchUsers(searchData.search.trim(), 1, searchData.perPage, searchParams)
    if (result.success) {
      // Update URL with search parameters
      const query = {
        ...route.query,
        search: searchData.search.trim(),
        page: 1
      }

      // Add filter parameter if searchType exists
      if (searchData.searchType) {
        query.filter = searchData.searchType
      }

      router.push({ path: route.path, query }).catch(err => {
        console.warn('Router push failed:', err)
      })
    }
  } else {
    await loadUsers(1)
    // Update URL
    const newQuery = { ...route.query }
    delete newQuery.search
    delete newQuery.filter
    if (Object.keys(newQuery).length === 0) {
      router.push({ path: route.path, query: {} }).catch(err => {
        console.warn('Router push failed:', err)
      })
    } else {
      router.push({ path: route.path, query: newQuery }).catch(err => {
        console.warn('Router push failed:', err)
      })
    }
  }
}

async function handlePerPageChange() {
  // Reset to first page when changing per page count
  await loadUsers(1)
}

function createUser() {
  router.push({ name: USER_ROUTES.CREATE_USER })
}

function editUser(user) {
  if (showUserDetail.value) showUserDetail.value = false
  router.push({ name: USER_ROUTES.EDIT_USER, params: { id: user.id } })
}

function viewUser(user) {
  selectedUser.value = user
  showUserDetail.value = true
}

// Delete user function - now handled directly with http client
async function confirmDelete(user) {
  userToDelete.value = user
  const result = await alertConfirm(
    'Confirm Delete',
    `Are you sure you want to delete user '${user.name || user.username}'? This action cannot be undone.`
  )

  if (result.isConfirmed) {
    await deleteUser()
  }
}

async function deleteUser() {
  if (userToDelete.value) {
    try {
      loading.value = true
      await http.get(USER_API_ROUTES.delete(userToDelete.value.id))

      // Remove user from the list
      users.value = users.value.filter(user => user.id !== userToDelete.value.id)

      userToDelete.value = null

      // Refresh the user list to ensure pagination is correct
      await loadUsers()

      alertSuccess('Success', 'User deleted successfully!')
    } catch (err) {
      error.value = err.message
      userToDelete.value = null
      await loadUsers()
      alertError('Error', 'Failed to delete user')
    } finally {
      loading.value = false
    }
  }
}

// Delete selected users function
async function deleteSelected() {
  if (!users.value) return

  const selectedUsers = users.value.filter(user => user.selected)
  if (selectedUsers.length === 0) return

  const result = await alertConfirm(
    'Confirm Delete',
    `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone.`
  )

  if (result.isConfirmed) {
    try {
      loading.value = true

      // Extract IDs from selected users
      const selectedIds = selectedUsers.map(user => user.id)

      // Send DELETE request with selected IDs in the request body
      await http.post(USER_API_ROUTES.remove, { code: selectedIds })

      // Refresh the user list
      await loadUsers()
      alertSuccess('Success', `${selectedUsers.length} user(s) deleted successfully!`)
    } catch (err) {
      error.value = err.message
      await loadUsers()
      alertError('Error', 'Failed to delete selected users')
    } finally {
      loading.value = false
    }
  }
}

// Table selection methods
function toggleSelectAll() {
  if (users.value) {
    users.value.forEach(user => {
      user.selected = selectAll.value
    })
  }
}

function updateSelectAll() {
  if (users.value) {
    const selectedUsers = users.value.filter(user => user.selected)
    selectAll.value = selectedUsers.length === users.value.length
  }
}

// Footer functionality
const hasSelectedUsers = computed(() => {
  if (!users.value) return false
  return users.value.some(user => user.selected)
})

// Watch for route changes to populate form fields
watch(() => route.query, () => {
  // Update searchData from route query
  searchData.search = route.query.search || ''
  searchData.searchType = route.query.filter || ''
  searchData.perPage = route.query.per_page || 10

  // Populate form fields after DOM update
  setTimeout(() => {
    populateFormFromQuery()
  }, 0)
}, { immediate: true })

// Refresh data when route is updated (e.g. when navigating back from user form)
onBeforeRouteUpdate((to, from) => {
  if (to.path === '/users') {
    const page = parseInt(to.query.page) || 1

    // Reset form fields if no query parameters
    if (Object.keys(to.query).length === 0) {
      resetFormFields()
    }

    loadUsers(page)
  }
})

// Reset form fields to empty values
function resetFormFields() {
  if (!filterForm.value) return

  const formElements = filterForm.value.elements
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i]
    if (element.name && element.type !== 'submit' && element.type !== 'button') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = false
      } else {
        element.value = ''
      }
    }
  }

  // Reset searchData
  searchData.search = ''
  searchData.searchType = ''
  searchData.perPage = 10
}

// Initialize
onMounted(async () => {
  // Check URL for initial page and search parameters
  const page = parseInt(route.query.page) || 1
  const search = route.query.search || ''
  const filter = route.query.filter || ''

  searchData.search = search
  searchData.searchType = filter // Map filter parameter back to searchType
  searchData.perPage = route.query.per_page || 10

  // If no query parameters, reset form fields
  if (Object.keys(route.query).length === 0) {
    resetFormFields()
  } else {
    // Populate form fields
    setTimeout(() => {
      populateFormFromQuery()
    }, 0)
  }

  // Apply filters from URL query parameters
  const filterQuery = { ...route.query }
  delete filterQuery.page
  delete filterQuery.search
  delete filterQuery.filter
  delete filterQuery.per_page

  if (search.trim()) {
    // Ensure filter parameter is included in the query
    const searchParams = {
      ...filterQuery,
      search: search.trim()
    }

    if (filter) {
      searchParams.filter = filter
    }

    await searchUsers(search.trim(), page, searchData.perPage, searchParams)
  } else {
    await loadUsers(page, filterQuery)
  }
})

// Simplified changePage function for better performance
function changePage(page) {
  // Ensure page is within valid range
  const validPage = Math.max(1, Math.min(page, pagination.totalPages))

  // Update URL with page parameter
  const query = { ...route.query, page: validPage }
  if (validPage === 1) {
    delete query.page // Remove page param if it's page 1 (default)
  }

  // Navigate to the new page
  router.push({ path: route.path, query }).catch(err => {
    console.warn('Router push failed:', err)
  })
}

// Simplified loadUsers function
async function loadUsers(page = 1, filterQuery = {}) {
  // Build filter query from form if not provided
  const filters = Object.keys(filterQuery).length > 0 ? filterQuery : buildFilterQuery()
  await fetchUsers(page, searchData.perPage, filters)
}
</script>

<style scoped>

.flex-end {
  justify-content: end;
  border-bottom: 1px solid red;
}

.filter {
  border: none;
  margin-top: unset;
  padding-bottom: 20px;
}

.filter tr {
  border: none;
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter tr td {
  border: none;
  border-width: 0;
  border-color: unset;
  flex: 1;
  min-width: 150px;
}

/* Add wrapper for table with horizontal scrolling */
.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.table-info {
  border-top: 1px solid lightgray;
  font-size: 1.5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  color: #666;
  position: relative;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.select-all {
  display: none;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
}

.pt-2 {
  padding-top: 1rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.hide-lg{
  display: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-info {
    text-align: center;
  }

  .select-all {
    display: block;
  }

  .hide-mobile{
    display: none;
  }

  td:not([data-label]) {
    display: none;
  }

  .filter .grouped{
    width: 100%;
  }

  .filter .grouped select,
  .filter .grouped input {
    width: 100%;
  }

  .filter td::before{
    width: 35%;
    text-align: right;
  }

  .filter tr {
    display: flex;
    flex-direction: column;
  }

  .filter tr td {
    min-width: 100%;
  }
}
</style>