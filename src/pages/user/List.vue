<template>
  <div class="card">
    <!-- Header -->
    <div class="page-header">
      <h2>User Management2</h2>
    </div>

    <!-- Card Container -->
    <div class="form-container">
      <!-- Search and Filters Row -->
      <FilterComponent
        :search-data="searchData"
        :search-options="searchOptions"
        @filter-submit="handleFilterSubmit"
        @search="handleSearch"
        @per-page-change="handlePerPageChange"
        ref="filterComponent"
      >
        <template #default-filters>
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
        </template>
      </FilterComponent>

      <hr>

      <!-- Loading State -->
      <div class="col-12" v-if="loading">
        <LoadingData />
      </div>

      <!-- Error State -->
      <ErrorMessage v-else-if="error" :message="error">
        <FormButton variant="primary" @click="loadItems" text="Retry" size="small" />
      </ErrorMessage>

      <!-- No Users State -->
      <div v-else-if="!hasItems && !loading" class="no-users">
        <p class="text-center">No users found.</p>
      </div>

      <!-- Users Table -->
      <div class="col-12" v-else>
        <TableComponent
          :items="items"
          :pagination="pagination"
          :select-all="selectAll"
          :columns="[]"
          entity-name="users"
          @toggle-select-all="toggleSelectAll"
          @update-select-all="updateSelectAll"
        >
          <template #header>
            <th>
              <input
                type="checkbox"
                :checked="selectAll"
                @change="toggleSelectAll"
              >
            </th>
            <th class="action-header text-center">Actions</th>
            <th>No.</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
          </template>

          <template #default="{ item, index }">
            <td data-label="Select">
              <input
                type="checkbox"
                :checked="item.selected"
                @change="() => updateSelectAll(item)"
              >
            </td>
            <td class="column-action" data-label="Actions">
              <div class="action-table">
                <TableAction
                  variant="primary"
                  icon="bi bi-eye"
                  title="View"
                  @click="handleView(item)"
                />
                <TableAction
                  variant="secondary"
                  icon="bi bi-pencil-square"
                  title="Edit"
                  @click="handleEdit(item, USER_ROUTES.EDIT_USER)"
                />
                <TableAction
                  variant="info"
                  icon="bi bi-printer"
                  title="Print"
                  @click="handlePrint(item)"
                />
                <TableAction
                  variant="danger"
                  icon="bi bi-trash"
                  title="Delete"
                  @click="confirmDelete(item)"
                />
              </div>
            </td>
            <td data-label="No.">{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}</td>
            <td data-label="Name">{{ item.name || item.username || 'N/A' }}</td>
            <td data-label="Username">@{{ item.username }}</td>
            <td data-label="Email">{{ item.email }}</td>
            <td data-label="Status">
              <span :class="item.active ? 'status-active' : 'status-inactive'">
                {{ item.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </template>
        </TableComponent>

        <!-- Pagination Component -->
        <PaginationComponent
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          @change-page="changePage"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="content-footer">
      <div class="footer-actions">
        <FormButton variant="secondary" @click="refreshItems" text="Refresh" />
        <FormButton variant="danger" @click="deleteSelectedUsers" text="Delete" :disabled="!hasSelectedItems" />
        <FormButton variant="success" @click="handleCreate(USER_ROUTES.CREATE_USER)" text="+ Create" />
      </div>
    </footer>

    <!-- User Detail Modal -->
    <Show v-if="showModal" :user="selectedItem" @edit="handleEdit" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { USER_ROUTES } from '../../router/userRoutes'
import { USER_API_ROUTES } from '../../router/userRoutes'
import { usePagination } from '../../composables/usePagination'
import { useAlert } from '../../composables/useAlert'
import { useGlobalList } from '../../composables/useGlobalList'
import { http } from '../../stores/http'

import FormButton from '../../components/FormButton.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import Show from './Show.vue'
import LoadingData from '../../components/LoadingData.vue'
import PaginationComponent from '../../components/PaginationComponent.vue'
import FilterComponent from '../../components/FilterComponent.vue'
import TableComponent from '../../components/TableComponent.vue'
import TableAction from '../../components/TableAction.vue'

const router = useRouter()
const route = useRoute()

// Use the global list composable
const {
  filterComponent,
  items,
  loading,
  error,
  pagination,
  showModal,
  selectedItem,
  selectAll,
  searchData,
  hasItems: hasItemsFunction, // Rename the imported function to avoid conflict
  hasSelectedItems,
  handleFilterSubmit,
  handleSearch,
  handlePerPageChange,
  handleCreate,
  handleEdit,
  handleView,
  confirmDelete,
  deleteSelected,
  toggleSelectAll,
  updateSelectAll,
  changePage,
  loadItems,
  handleRouteUpdate,
  initialize
} = useGlobalList(USER_API_ROUTES, usePagination, useAlert)

// Redefine hasItems as a computed property to ensure it works correctly
const hasItems = computed(() => {
  return hasItemsFunction && typeof hasItemsFunction === 'function'
    ? hasItemsFunction()
    : items.value && items.value.length > 0
})

// Define search options based on UserModel fields
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' }
]

// Refresh items function to ensure proper parameter passing
function refreshItems() {
  console.log('Refreshing items. Current HTTP baseURL:', http.baseURL)
  loadItems(pagination.currentPage)
}

// Delete selected users function (specific to user list)
async function deleteSelectedUsers() {
  await deleteSelected(http, USER_API_ROUTES.remove)
}

// Print user function
function handlePrint(user) {
  // Implement print functionality
  console.log('Printing user:', user)
  // You can implement actual print functionality here
  // For example, open a print-friendly view or generate a PDF
  window.print()
}

// Refresh data when route is updated (e.g. when navigating back from user form)
onBeforeRouteUpdate(handleRouteUpdate)

// Initialize
onMounted(() => {
  console.log('User list mounted. Current HTTP baseURL:', http.baseURL)
  initialize(searchOptions)
})
</script>

<style scoped>
.flex-end {
  justify-content: end;
  border-bottom: 1px solid red;
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
}
</style>