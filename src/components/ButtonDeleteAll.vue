<template>
  <button
    @click="handleDelete"
    :class="buttonClass"
    :disabled="isDisabled"
  >
    <span v-if="loading">Deleting...</span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { http } from '../stores/http'
import { useAlert } from '../composables/useAlert'

// Define props
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: 'Delete Selected'
  },
  confirmMessage: {
    type: String,
    default: 'Are you sure you want to delete the selected items?'
  },
  buttonClass: {
    type: String,
    default: 'btn btn-danger'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  // New prop to support FormTable batch deletion
  formTableRef: {
    type: Object,
    default: null
  }
})

// Define emits
const emit = defineEmits(['success', 'error'])

// Reactive properties
const loading = ref(false)
const { alertConfirm, alertError } = useAlert()

// Computed property for disabled state
const isDisabled = computed(() => {
  return props.disabled || loading.value || !props.selectedItems || props.selectedItems.length === 0
})

// Handle delete operation
const handleDelete = async () => {
  // Check if any items are selected
  if (!props.selectedItems || props.selectedItems.length === 0) {
    alertError('Error', 'You must select items first before deleting')
    return
  }

  // Use Swal confirmation dialog
  const result = await alertConfirm(
    'Confirm Delete',
    `Are you sure you want to delete ${props.selectedItems.length} selected items?`,
    'Yes, delete them!',
    'Cancel'
  )

  if (result.isConfirmed) {
    try {
      loading.value = true

      // If formTableRef is provided, handle batch deletion manually
      if (props.formTableRef) {
        // Perform the deletion for selected items using the FormTable's delete endpoint
        await http.post(props.formTableRef.$props.delete, { code: props.selectedItems });

        // Refresh the table after successful deletion
        if (props.formTableRef.refresh) {
          props.formTableRef.refresh();
        }
      } else {
        // Fallback to direct API call if no formTableRef
        await http.post(props.url, { code: props.selectedItems });
      }

      // Emit success event
      emit('success', props.url);
    } catch (error) {
      console.error('Delete error:', error);
      alertError('Error', 'Failed to delete selected items');

      // Emit error event
      emit('error', error);
    } finally {
      loading.value = false;
    }
  }
}
</script>

<style scoped>
/* Add any specific styles for the delete button if needed */
</style>