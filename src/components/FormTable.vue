<template>
  <div class="form-table-container">
    <form @submit.prevent="handleSearch" class="form-table-filter">
      <slot name="filterForm" :formData="formData" :fieldErrors="fieldErrors" :isSubmitting="isSubmitting" :handleSearch="handleSearch"></slot>

      <div class="form-actions">
        <Button
          button-type="submit"
          variant="primary"
          :text="isSubmitting ? 'Searching...' : 'Search'"
          :disabled="isSubmitting"
        />
        <Button
          button-type="button"
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
import Button from './Button.vue'

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