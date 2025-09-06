<template>
  <div class="form-table-container">
    <form @submit.prevent="handleSearch" class="form-table-filter">
      <slot
        :formData="formData"
        :fieldErrors="fieldErrors"
        :isSubmitting="isSubmitting"
        :handleSearch="handleSearch"
      />

      <div class="form-table-actions">
        <FormButton
          type="submit"
          variant="primary"
          :text="isSubmitting ? 'Searching...' : 'Search'"
          :disabled="isSubmitting"
        />
        <FormButton
          type="button"
          variant="secondary"
          text="Reset"
          @click="handleReset"
        />
      </div>
    </form>

    <div class="form-table-content">
      <slot name="table" :data="tableData" :loading="loading" :selectedItems="selectedItems" :toggleSelectAll="toggleSelectAll" :isAllSelected="isAllSelected" />
    </div>

    <div v-if="pagination" class="form-table-pagination">
      <slot name="pagination" :pagination="pagination" :changePage="changePage">
        <nav class="pagination">
          <button
            :disabled="pagination.current_page <= 1 || loading"
            @click="changePage(pagination.current_page - 1)"
            class="pagination-btn"
          >
            Previous
          </button>

          <span class="pagination-info">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
          </span>

          <button
            :disabled="pagination.current_page >= pagination.last_page || loading"
            @click="changePage(pagination.current_page + 1)"
            class="pagination-btn"
          >
            Next
          </button>
        </nav>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../stores/http'
import FormButton from './FormButton.vue'

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
  deleteEndpoint: {
    type: [String, Function],
    default: null
  },
  batchDeleteEndpoint: {
    type: String,
    default: null
  }
})

// Define emits
const emit = defineEmits(['search', 'error', 'delete', 'delete-selected'])

// Reactive properties
const route = useRoute()
const router = useRouter()
const formData = reactive({ ...props.initialData })
const fieldErrors = ref({})
const isSubmitting = ref(false)
const tableData = ref([])
const loading = ref(false)
const pagination = ref(null)
const selectedItems = ref([])

// Computed property for check all functionality
const isAllSelected = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return false
  return selectedItems.value.length === tableData.value.length
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

// Toggle select all items
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all
    selectedItems.value = []
  } else {
    // Select all
    selectedItems.value = [...(tableData.value || [])].map(item => item.id)
  }
}

// Toggle selection of a single item
const toggleSelectItem = (id) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    // Remove from selected
    selectedItems.value.splice(index, 1)
  } else {
    // Add to selected
    selectedItems.value.push(id)
  }
}

// Handle search function
const handleSearch = async () => {
  isSubmitting.value = true
  fieldErrors.value = {}

  try {
    loading.value = true
    const params = {
      ...formData,
      page: route.query.page || 1
    }

    const response = await http.get(props.endpoint, { params })
    const data = response.data

    // Handle both direct array response and paginated response
    if (Array.isArray(data)) {
      tableData.value = data
      pagination.value = null
    } else if (data.data) {
      tableData.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
        from: data.from,
        to: data.to
      }
    } else {
      tableData.value = []
      pagination.value = null
    }

    // Reset selected items when data changes
    selectedItems.value = []

    // Update URL parameters
    updateUrlParams()

    // Emit search event with response data
    emit('search', response)
  } catch (error) {
    console.error('FormTable search error:', error)
    fieldErrors.value = error.response?.data?.errors || {}

    // Emit error event
    emit('error', error)
  } finally {
    isSubmitting.value = false
    loading.value = false
  }
}

// Expose methods to parent components
// refresh is an alias for handleSearch for more intuitive usage
defineExpose({
  handleSearch,
  refresh: handleSearch, // Alias for more intuitive usage
  selectedItems,
  toggleSelectAll,
  toggleSelectItem,
  handleDeleteSelected,
  deleteUser
})

// Handle reset function
const handleReset = () => {
  // Reset form data to initial values
  Object.keys(formData).forEach(key => {
    formData[key] = props.initialData[key] || ''
  })

  // Reset field errors
  fieldErrors.value = {}

  // Update URL parameters
  updateUrlParams()

  // Perform search with reset data
  handleSearch()
}

// Change page function
const changePage = (page) => {
  // Update form data with new page
  formData.page = page

  // Update URL parameters
  updateUrlParams()

  // Perform search with new page
  handleSearch()
}

// Update URL parameters
const updateUrlParams = () => {
  const query = { ...route.query }

  // Add form data to query
  Object.keys(formData).forEach(key => {
    if (formData[key]) {
      query[key] = formData[key]
    } else {
      delete query[key]
    }
  })

  // Update URL without reload
  router.push({ query })
}

// Handle delete selected items
async function handleDeleteSelected() {
  if (selectedItems.value.length === 0) return

  // Check if batch delete endpoint is provided
  if (!props.batchDeleteEndpoint) {
    console.error('Batch delete endpoint not provided')
    emit('error', new Error('Batch delete endpoint not provided'))
    return
  }

  try {
    // Send selected item IDs as an array to the batch delete endpoint
    await http.post(props.batchDeleteEndpoint, {code : selectedItems.value})

    // Store the current selected items for potential use in events
    const deletedItems = [...selectedItems.value]

    // Clear selected items
    selectedItems.value = []

    // Refresh the table
    await handleSearch()

    console.log('Selected items deleted successfully')

    // Emit a custom event for successful deletion
    emit('delete-selected', deletedItems)
  } catch (error) {
    console.error('Error deleting selected items:', error)
    emit('error', error)

    // Re-throw the error so it can be handled by the caller
    throw error
  }
}

// Handle delete single item
async function deleteUser(userId, confirmFunction, successFunction, errorFunction) {
  // Check if delete endpoint is provided
  if (!props.deleteEndpoint) {
    console.error('Delete endpoint not provided')
    if (errorFunction) {
      errorFunction('Error', 'Delete endpoint not provided')
    }
    return
  }

  // Use the provided confirm function or a default one
  const result = await confirmFunction(
    'Confirm Delete',
    'Are you sure you want to delete this item?'
  )

  if (result.isConfirmed) {
    try {
      // Construct the delete URL with the user ID
      // If deleteEndpoint contains a placeholder, replace it
      let deleteUrl = props.deleteEndpoint
      if (typeof props.deleteEndpoint === 'function') {
        deleteUrl = props.deleteEndpoint(userId)
      } else if (deleteUrl.includes('{id}')) {
        deleteUrl = deleteUrl.replace('{id}', userId)
      } else if (deleteUrl.includes(':id')) {
        deleteUrl = deleteUrl.replace(':id', userId)
      } else {
        // Assume it's a simple endpoint that needs the ID appended
        deleteUrl = `${props.deleteEndpoint}/${userId}`
      }

      await http.get(deleteUrl)

      // Refresh the table after deletion
      await handleSearch()

      // Call success function if provided
      if (successFunction) {
        successFunction('Success', 'Item deleted successfully')
      }

      // Emit delete event
      emit('delete', userId)
    } catch (error) {
      // Call error function if provided
      if (errorFunction) {
        errorFunction('Error', 'Failed to delete item')
      }
      console.error('Delete item error:', error)

      // Re-throw the error so it can be handled by the caller
      throw error
    }
  }
}

// Watch for route changes
watch(
  () => route.query,
  () => {
    // Update form data from query parameters
    Object.keys(props.initialData).forEach(key => {
      if (route.query[key] !== undefined) {
        formData[key] = route.query[key]
      } else {
        formData[key] = props.initialData[key] || ''
      }
    })

    // Perform search when route changes
    handleSearch()
  },
  { immediate: true }
)

// Initialize component
onMounted(() => {
  console.log('FormTable component mounted')
})
</script>

<style scoped>
.form-table-container {
  background-color: var(--bg-white, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-table-filter {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-table-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.form-table-content {
  padding: 1.5rem;
}

.form-table-pagination {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-table-filter,
  .form-table-content,
  .form-table-pagination {
    padding: 1rem;
  }

  .form-table-actions {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>