<template>
  <div class="card">
    <div class="page-header">
      <h2>Filter Component Test</h2>
    </div>

    <div class="form-container">
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
            <td class="col-4" data-label="Email">
              <p class="grouped">
                <label class="hide-mobile" for="">Email</label>
                <input type="text" name="email" placeholder="Filter by email...">
              </p>
            </td>
            <td class="col-4" data-label="Status">
              <p class="grouped">
                <label class="hide-mobile" for="">Status</label>
                <select name="status">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </p>
            </td>
          </tr>
        </template>
      </FilterComponent>

      <hr>

      <div>
        <h3>Test Results</h3>
        <p>Search Data: {{ JSON.stringify(searchData) }}</p>
        <p>Last Event: {{ lastEvent }}</p>
        <p>Last Payload: {{ JSON.stringify(lastPayload) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FilterComponent from '../../components/FilterComponent.vue'

const filterComponent = ref(null)
const lastEvent = ref('')
const lastPayload = ref({})

// Search data
const searchData = reactive({
  search: '',
  searchType: '',
  perPage: 10
})

// Define search options
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' }
]

// Event handlers
function handleFilterSubmit(payload) {
  lastEvent.value = 'filter-submit'
  lastPayload.value = payload
  console.log('Filter submitted:', payload)
}

function handleSearch(payload) {
  lastEvent.value = 'search'
  lastPayload.value = payload
  console.log('Search triggered:', payload)
}

function handlePerPageChange(perPage) {
  lastEvent.value = 'per-page-change'
  lastPayload.value = { perPage }
  console.log('Per page changed:', perPage)
}
</script>