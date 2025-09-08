<template>
  <div class="card">
    <div class="page-header">
      <h2>User Management</h2>
    </div>

    <div class="card-content">
      <!-- Filter Component -->
      <FilterComponent
        ref="filterComponent"
        :search-data="searchData"
        :search-options="searchOptions"
        @search="handleSearch"
        @filter-submit="handleFilterSubmit"
        @per-page-change="handlePerPageChange"
      >
        <template #actions>
          <Button button-type="button" variant="primary" @click="handleCreate(ROUTES.CREATE)" text="+ Create" />
        </template>
      </FilterComponent>

      <!-- Error Message -->
      <ErrorMessage :error="error" />

      <!-- Loading Indicator -->
      <LoadingData v-if="loading" />

      <!-- Table Component -->
      <div class="table-wrapper">
        <TableComponent
          :data="items"
          :columns="tableColumns"
          :selectable="true"
          :select-all="selectAll"
          :show-edit="true"
          :show-delete="true"
          @edit="handleEdit"
          @delete="confirmDelete"
          @select-all="toggleSelectAll"
          @sort="loadItems"
        >
          <template #actions="{ item, index }">
            <TableAction
              :item="item"
              :index="index"
              @edit="handleEdit"
              @view="handleView"
              @delete="confirmDelete"
              @print="handlePrint"
            />
          </template>
        </TableComponent>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !hasItems" class="table-info">
        No users found.
        <div class="select-all">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        </div>
      </div>

      <!-- Pagination Component -->
      <PaginationComponent
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @change-page="changePage"
      />
    </div>

    <!-- Footer -->
    <footer class="content-footer">
      <div class="form-actions">
        <Button button-type="button" variant="secondary" @click="refreshItems" text="Refresh" />
        <Button button-type="button" variant="danger" @click="deleteSelectedUsers" text="Delete" :disabled="!hasSelectedItems" />
        <Button button-type="button" variant="success" @click="handleCreate(ROUTES.CREATE)" text="+ Create" />
      </div>
    </footer>

    <!-- User Detail Modal -->
    <Show v-if="showModal" :user="selectedItem" @edit="handleEdit" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ROUTES, API } from '../../router/userRoutes'
import { usePagination } from '../../composables/usePagination'
import { useAlert } from '../../composables/useAlert'
import { useGlobalList } from '../../composables/useGlobalList'
import { http } from '../../stores/http'

import Button from '../../components/Button.vue'
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
} = useGlobalList(API, usePagination, useAlert)

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

// Table columns definition
const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'system_role_name', label: 'Role' }
]

// Refresh items function to ensure proper parameter passing
function refreshItems() {
  console.log('Refreshing items. Current HTTP baseURL:', http.baseURL)
  loadItems(pagination.currentPage)
}

// Delete selected users function (specific to user list)
async function deleteSelectedUsers() {
  await deleteSelected(http, API.REMOVE)
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