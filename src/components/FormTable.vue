<template>
  <div class="form-table-container">
    <form @submit.prevent="handleSearch" class="form-table-filter">
      <slot name="filterForm" :formData="formData" :fieldErrors="fieldErrors" :isSubmitting="isSubmitting" :handleSearch="handleSearch"></slot>

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
      <slot name="tableContent" :data="tableData"></slot>
    </div>

    <div v-if="pagination" class="form-table-pagination">
      <slot name="pagination" :pagination="pagination" :changePage="changePage">
        <nav class="pagination">
          <button
            :disabled="pagination.current_page <= 1"
            @click="changePage(pagination.current_page - 1)"
            class="pagination-btn"
          >
            Previous
          </button>

          <span class="pagination-info">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
          </span>

          <button
            :disabled="pagination.current_page >= pagination.last_page"
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
import { useFormTable } from '../composables/useFormTable'
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
  delete: {
    type: String,
    default: null
  }
})

// Define emits
const emit = defineEmits(['search', 'error'])

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
  initialData: props.initialData,
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

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
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