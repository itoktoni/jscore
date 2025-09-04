<template>
  <div class="card">
    <div class="page-header">
      <h2>Product Management</h2>
    </div>

    <div class="form-container">
      <!-- Reusable Filter Component -->
      <FilterComponent
        :search-data="searchData"
        :search-options="searchOptions"
        @filter-submit="handleFilterSubmit"
        @search="handleSearch"
        @per-page-change="handlePerPageChange"
        ref="filterComponent"
      >
        <!-- Custom filters for products -->
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

        <!-- Additional custom filters -->
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

      <!-- Product Table would go here -->
      <div v-if="loading">
        Loading products...
      </div>
      <div v-else>
        <p>Products would be displayed here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import FilterComponent from './FilterComponent.vue'

const filterComponent = ref(null)
const loading = ref(false)

// Search data
const searchData = reactive({
  search: '',
  searchType: '',
  perPage: 10
})

// Define search options for products
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'brand', label: 'Brand' }
]

// Event handlers - URL routing is handled by FilterComponent
async function handleFilterSubmit({ filterQuery, searchData }) {
  console.log('Filter submitted:', filterQuery, searchData)
  // Apply filters to fetch products
  await fetchProducts(1, searchData.perPage, filterQuery)
}

async function handleSearch({ filterQuery, searchData }) {
  console.log('Search triggered:', filterQuery, searchData)
  // Apply search to fetch products
  await searchProducts(searchData.search, 1, searchData.perPage, filterQuery)
}

function handlePerPageChange(perPage) {
  console.log('Per page changed:', perPage)
  searchData.perPage = perPage
  // Fetch products with new per page count
  fetchProducts(1)
}

// Mock API functions
async function fetchProducts(page = 1, perPage = 10, filters = {}) {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 500)
}

async function searchProducts(searchTerm, page = 1, perPage = 10, filters = {}) {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// Initialize
onMounted(() => {
  console.log('Product list mounted')
  fetchProducts()
})
</script>

<style scoped>
/* Product-specific styles */
</style>