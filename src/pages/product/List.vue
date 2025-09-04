<template>
  <div class="card">
    <!-- Header -->
    <div class="page-header">
      <h2>Product Management</h2>
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
            <td class="col-4" data-label="Category">
              <p class="grouped">
                <label class="hide-mobile" for="">Category</label>
                <input type="text" name="category" placeholder="Filter by category...">
              </p>
            </td>
            <td class="col-4" data-label="Brand">
              <p class="grouped">
                <label class="hide-mobile" for="">Brand</label>
                <input type="text" name="brand" placeholder="Filter by brand...">
              </p>
            </td>
          </tr>
        </template>

        <template #custom-filters>
          <tr>
            <td class="col-6" data-label="Price Range">
              <p class="grouped">
                <label class="hide-mobile" for="">Min Price</label>
                <input type="number" name="min_price" placeholder="Min price">
              </p>
            </td>
            <td class="col-6" data-label="Max Price">
              <p class="grouped">
                <label class="hide-mobile" for="">Max Price</label>
                <input type="number" name="max_price" placeholder="Max price">
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

      <!-- No Products State -->
      <div v-else-if="!hasItems() && !loading" class="no-products">
        <p class="text-center">No products found.</p>
      </div>

      <!-- Products Table -->
      <div class="col-12" v-else>
        <TableComponent
          :items="items"
          :pagination="pagination"
          :select-all="selectAll"
          :columns="tableColumns"
          entity-name="products"
          @toggle-select-all="toggleSelectAll"
          @update-select-all="updateSelectAll"
        >
          <template #actions="{ item }">
            <button class="button primary" @click.stop="handleView(item)" title="View">
              <i class="bi bi-eye"></i>
            </button>
            <button class="button secondary" @click.stop="handleEdit(item, PRODUCT_ROUTES.EDIT_PRODUCT)" title="Edit">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="button info" @click.stop="handlePrint(item)" title="Print">
              <i class="bi bi-printer"></i>
            </button>
            <button class="button error" @click.stop="confirmDelete(item, 'name')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </template>

          <template #price="{ item }">
            ${{ item.price }}
          </template>
          <template #status="{ item }">
            <span :class="item.active ? 'status-active' : 'status-inactive'">
              {{ item.active ? 'Active' : 'Inactive' }}
            </span>
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
        <FormButton variant="secondary" @click="loadItems" text="Refresh" />
        <FormButton variant="danger" @click="deleteSelectedProducts" text="Delete" :disabled="!hasSelectedItems" />
        <FormButton variant="success" @click="handleCreate(PRODUCT_ROUTES.CREATE_PRODUCT)" text="+ Create" />
      </div>
    </footer>

    <!-- Product Detail Modal -->
    <ProductShow v-if="showModal" :product="selectedItem" @edit="handleEdit" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeRouteUpdate } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PRODUCT_ROUTES } from '../../router/productRoutes'
import { PRODUCT_API_ROUTES } from '../../router/productRoutes'
import { usePagination } from '../../composables/usePagination'
import { useAlert } from '../../composables/useAlert'
import { useGlobalList } from '../../composables/useGlobalList'
import { http } from '../../stores/http'

import FormButton from '../../components/FormButton.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import ProductShow from './Show.vue'
import LoadingData from '../../components/LoadingData.vue'
import PaginationComponent from '../../components/PaginationComponent.vue'
import FilterComponent from '../../components/FilterComponent.vue'
import TableComponent from '../../components/TableComponent.vue'

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
  hasItems,
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
} = useGlobalList(PRODUCT_API_ROUTES, usePagination, useAlert)

// Define search options for products
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'brand', label: 'Brand' }
]

// Define table columns
const tableColumns = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'price', label: 'Price', type: 'custom' },
  { key: 'active', label: 'Status', type: 'status' }
]

// Delete selected products function (specific to product list)
async function deleteSelectedProducts() {
  await deleteSelected(http, PRODUCT_API_ROUTES.remove)
}

// Print product function
function handlePrint(product) {
  // Implement print functionality
  console.log('Printing product:', product)
  // You can implement actual print functionality here
  // For example, open a print-friendly view or generate a PDF
  window.print()
}

// Refresh data when route is updated (e.g. when navigating back from product form)
onBeforeRouteUpdate(handleRouteUpdate)

// Initialize
onMounted(() => {
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