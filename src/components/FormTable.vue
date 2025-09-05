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
      <slot name="table" :data="tableData" :loading="loading" />
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
import { ref, provide, watch } from 'vue'
import { http } from '../stores/http'
import FormButton from './FormButton.vue'

const props = defineProps({
  endpoint: {
    type: String,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'error'])

// Form state
const formData = ref({ ...props.initialData })
const fieldErrors = ref({})
const isSubmitting = ref(false)
const loading = ref(false)

// Table data
const tableData = ref([])
const pagination = ref(null)

// Provide form context to child components
provide('formData', formData)
provide('fieldErrors', fieldErrors)

// Handle search submission
const handleSearch = async () => {
  isSubmitting.value = true
  loading.value = true
  fieldErrors.value = {}

  try {
    // Build query parameters from form data
    const params = new URLSearchParams()

    Object.keys(formData.value).forEach(key => {
      const value = formData.value[key]
      if (value !== null && value !== undefined && value !== '') {
        // Handle array values (for multiple selections)
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            params.append(`${key}[${index}]`, item)
          })
        } else {
          params.append(key, value)
        }
      }
    })

    // Add pagination parameter
    params.append('page', pagination.value?.current_page || 1)

    const url = `${props.endpoint}?${params.toString()}`
    console.log('FormTable: Making request to', url)
    const response = await http.get(url)

    console.log('FormTable: Received response', response)

    const data = response.data
    console.log('FormTable: Processing data', data)

    // Handle different response formats
    if (data && typeof data === 'object' && 'data' in data) {
      // Standard Laravel pagination format
      console.log('FormTable: Using Laravel pagination format')
      tableData.value = Array.isArray(data.data) ? data.data : []
      pagination.value = {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 10,
        total: data.total || tableData.value.length,
        from: data.from || 1,
        to: data.to || tableData.value.length
      }
    } else if (Array.isArray(data)) {
      // Simple array response
      console.log('FormTable: Using simple array format')
      tableData.value = data
      pagination.value = null
    } else {
      // Unexpected format, set empty array
      console.log('FormTable: Unexpected data format, setting empty array')
      tableData.value = []
      pagination.value = null
    }

    console.log('FormTable: Final tableData', tableData.value)

    emit('search', response)
  } catch (error) {
    console.error('FormTable search error:', error)

    // Handle validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {}
      Object.keys(errors).forEach(fieldName => {
        const errorMessages = errors[fieldName]
        fieldErrors.value[fieldName] = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages
      })
    }

    emit('error', error)
  } finally {
    isSubmitting.value = false
    loading.value = false
  }
}

// Handle pagination
const changePage = (page) => {
  if (pagination.value) {
    pagination.value.current_page = page
    handleSearch()
  }
}

// Reset form
const handleReset = () => {
  formData.value = { ...props.initialData }
  fieldErrors.value = {}
  // Reset to first page and search
  if (pagination.value) {
    pagination.value.current_page = 1
  }
  handleSearch()
}

// Initialize data on mount
watch(() => props.endpoint, () => {
  handleSearch()
}, { immediate: true })

// Expose methods
defineExpose({
  handleSearch,
  handleReset,
  changePage
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