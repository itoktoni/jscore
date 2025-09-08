<template>
  <div class="card">
    <div class="page-header">
      <h2>{{ computedHeader }}</h2>
    </div>

    <div class="card-table">
      <div class="form-table-container">
        <form @submit.prevent="handleSearch(true)" class="form-table-filter">
          <slot name="filterForm" :formData="formData" :fieldErrors="fieldErrors" :isSubmitting="isSubmitting"
            :handleSearch="handleSearch">
          </slot>

            <div class="row">
              <FormSelect name="filter" label="Filter" :options="filterOptions" col="6" />
              <FormInput col="6" name="search" label="Search" placeholder="Enter search term" />
            </div>

          <div class="form-actions">
            <Button type="button" variant="secondary" text="Reset" @click="handleReset(true)" />
            <Button type="submit" variant="primary" :text="isSubmitting ? 'Searching...' : 'Search'"
              :disabled="isSubmitting" />
          </div>
        </form>

        <div class="form-table-content">
          <slot name="tableContent" :data="tableData"></slot>
        </div>

        <div v-if="pagination" class="form-table-pagination">
          <slot name="pagination" :pagination="pagination" :changePage="changePage">
            <nav class="pagination">
              <button :disabled="pagination.current_page <= 1" @click="changePage(pagination.current_page - 1)"
                class="button secondary">
                <i class="bi bi-arrow-left"></i>
              </button>

              <span class="pagination-info">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
              </span>

              <button :disabled="pagination.current_page >= pagination.last_page"
                @click="changePage(pagination.current_page + 1)" class="button secondary">
                <i class="bi bi-arrow-right"></i>
              </button>
            </nav>
          </slot>
        </div>
      </div>
    </div>

    <footer class="content-footer safe-area-bottom" v-if="hasFooterActions">
      <div class="form-actions">
        <slot name="footerActions"></slot>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, provide, computed } from 'vue'
import { useFormTable } from '../composables/useFormTable'
import Button from './Button.vue'
import FormSelect from './FormSelect.vue'
import FormInput from './FormInput.vue'

// Define props
const props = defineProps({
  endpoint: {
    type: String,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  // Add new props for delete endpoints
  delete: {
    type: String,
    default: null
  },
  // Header title
  header: {
    type: String,
    default: 'Current Configuration'
  },
  // Module name for default header
  module: {
    type: String,
    default: null
  },
  // Show footer actions
  hasFooterActions: {
    type: Boolean,
    default: false
  },
  // Dynamic filter options
  optionsFilter: {
    type: Array,
    default: () => []
  }
})

// Computed property for header - use module name if provided and no header is set
const computedHeader = computed(() => {
  if (props.header && props.header !== 'Current Configuration') {
    return props.header
  }
  if (props.module) {
    return props.module
  }
  return 'Current Configuration'
})

// Default filter options
const defaultFilterOptions = [
  { label: 'All Fields', value: '' },
  { label: 'Username', value: 'username' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' }
]

// Use dynamic options if provided, otherwise use defaults
const filterOptions = computed(() => {
  return props.optionsFilter.length > 0 ? props.optionsFilter : defaultFilterOptions
})


// Define emits
const emit = defineEmits(['search', 'error'])

// Set initial data with defaults for filter and search only
const initialDataWithDefaults = {
  ...props.initialData,
  filter: props.initialData.filter || '',
  search: props.initialData.search || ''
}

// Use the form table composable
const {
  formData,
  fieldErrors,
  isSubmitting,
  tableData,
  pagination,
  handleSearch,
  handleReset,
  changePage,
  updateUrlParams,
  refresh,
  deleteItem,
  batchDeleteItems,
  initialize
} = useFormTable({
  endpoint: props.endpoint,
  initialData: initialDataWithDefaults,
  deleteEndpoint: props.delete
})

// Create refs for providing to child components
const formDataRef = ref(formData)
const fieldErrorsRef = ref(fieldErrors)
const isSubmittingRef = ref(isSubmitting)

// Provide form context to child components
provide('formData', formDataRef)
provide('fieldErrors', fieldErrorsRef)
provide('isSubmitting', isSubmittingRef)

// Keep formDataRef in sync with formData changes
watch(
  () => formData,
  (newFormData) => {
    formDataRef.value = newFormData
  },
  { deep: true }
)

// Expose methods to parent components
// refresh is an alias for handleSearch for more intuitive usage
defineExpose({
  handleSearch,
  refresh, // Alias for more intuitive usage
  deleteItem,
  batchDeleteItems
})

// Initialize component
onMounted(() => {
  initialize()
})
</script>