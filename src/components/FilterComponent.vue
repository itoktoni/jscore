<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  searchData: {
    type: Object,
    required: true
  },
  searchOptions: {
    type: Array,
    default: () => [
      { value: '', label: 'All Fields' }
    ]
  },
  perPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  }
})

const emit = defineEmits(['filter-change', 'search', 'per-page-change', 'filter-submit'])

const route = useRoute()
const router = useRouter()
const filterForm = ref(null)
const localSearchData = reactive({ ...props.searchData })

// Watch for changes in props and update local data
watch(() => props.searchData, (newVal) => {
  Object.assign(localSearchData, newVal)
}, { deep: true })

// Methods
function buildFilterQuery() {
  if (!filterForm.value) return {}

  const formData = new FormData(filterForm.value)
  const filterQuery = {}

  for (const [key, value] of formData.entries()) {
    // Skip empty values and the main search field
    if (value !== '' && key !== 'search' && key !== 'searchType' && key !== 'per_page') {
      filterQuery[key] = value
    }
  }

  // Map searchType to filter parameter
  if (localSearchData.searchType) {
    filterQuery.filter = localSearchData.searchType
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
  const updatedSearchData = { ...localSearchData }

  // Emit event before handling URL updates
  emit('filter-submit', { filterQuery, searchData: updatedSearchData })

  // Handle URL routing and query parameter management
  const page = 1 // Reset to first page when applying filters

  // Build query parameters
  const query = {
    ...route.query,
    page
  }

  // Add search parameters if they exist
  if (updatedSearchData.search.trim()) {
    query.search = updatedSearchData.search.trim()
    if (updatedSearchData.searchType) {
      query.filter = updatedSearchData.searchType
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
  await router.push({ path: route.path, query }).catch(err => {
    console.warn('Router push failed:', err)
  })
}

async function handleSearch() {
  const filterQuery = buildFilterQuery()
  const updatedSearchData = { ...localSearchData }

  // Emit event before handling URL updates
  emit('search', { filterQuery, searchData: updatedSearchData })

  if (updatedSearchData.search.trim()) {
    // Reset to page 1 when searching
    // Build the search query to match the required format
    const searchParams = {
      ...filterQuery,
      search: updatedSearchData.search.trim()
    }

    // Map searchType to filter parameter
    if (updatedSearchData.searchType) {
      searchParams.filter = updatedSearchData.searchType
    }

    // Update URL with search parameters
    const query = {
      ...route.query,
      search: updatedSearchData.search.trim(),
      page: 1
    }

    // Add filter parameter if searchType exists
    if (updatedSearchData.searchType) {
      query.filter = updatedSearchData.searchType
    }

    await router.push({ path: route.path, query }).catch(err => {
      console.warn('Router push failed:', err)
    })
  } else {
    // Update URL
    const newQuery = { ...route.query }
    delete newQuery.search
    delete newQuery.filter
    if (Object.keys(newQuery).length === 0) {
      await router.push({ path: route.path, query: {} }).catch(err => {
        console.warn('Router push failed:', err)
      })
    } else {
      await router.push({ path: route.path, query: newQuery }).catch(err => {
        console.warn('Router push failed:', err)
      })
    }
  }
}

function handlePerPageChange() {
  emit('per-page-change', localSearchData.perPage)
}

// Watch for route changes to populate form fields
watch(() => route.query, () => {
  // Update localSearchData from route query
  localSearchData.search = route.query.search || ''
  localSearchData.searchType = route.query.filter || ''
  localSearchData.perPage = route.query.per_page || props.perPageOptions[0]

  // Populate form fields after DOM update
  setTimeout(() => {
    populateFormFromQuery()
  }, 0)
}, { immediate: true })

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

  // Reset localSearchData
  localSearchData.search = ''
  localSearchData.searchType = ''
  localSearchData.perPage = props.perPageOptions[0]
}

// Initialize
onMounted(() => {
  // Check URL for initial parameters
  const search = route.query.search || ''
  const filter = route.query.filter || ''

  localSearchData.search = search
  localSearchData.searchType = filter
  localSearchData.perPage = route.query.per_page || props.perPageOptions[0]

  // If no query parameters, reset form fields
  if (Object.keys(route.query).length === 0) {
    resetFormFields()
  } else {
    // Populate form fields
    setTimeout(() => {
      populateFormFromQuery()
    }, 0)
  }
})

// Expose methods to parent component
defineExpose({
  buildFilterQuery,
  resetFormFields,
  populateFormFromQuery
})
</script>

<template>
  <form @submit.prevent="handleFilterSubmit" class="row col-12" ref="filterForm">
    <table class="filter data-table col-12">
      <slot name="default-filters"></slot>

      <tr>
        <td class="col-2" data-label="Per Page">
          <p class="grouped">
            <label class="hide-mobile" for="">Page</label>
            <select
              name="per_page"
              v-model="localSearchData.perPage"
              @change="handlePerPageChange"
              class="per-page"
            >
              <option
                v-for="option in perPageOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </p>
        </td>
        <td class="col-4" data-label="Filters">
          <p class="grouped">
            <label class="hide-mobile" for="">Filters</label>
            <select
              name="searchType"
              v-model="localSearchData.searchType"
            >
              <option
                v-for="option in searchOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </p>
        </td>
        <td class="col-6" data-label="Search">
          <p class="grouped">
            <label class="hide-mobile" for="">Search</label>
            <input
              type="search"
              name="search"
              id="filter-input"
              placeholder="Search..."
              v-model="localSearchData.search"
              @keyup.enter="handleSearch"
            >
            <button class="button icon-only" @click="handleSearch">
              Filter
            </button>
          </p>
        </td>
      </tr>

      <!-- Slot for additional custom filters -->
      <slot name="custom-filters"></slot>
    </table>
  </form>
</template>

<style scoped>
@media (max-width: 768px) {
    .hide-mobile {
    display: none;
    }
}
</style>