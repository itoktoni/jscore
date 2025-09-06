<template>
  <button
    @click="handleDelete"
    :class="buttonClass"
    :disabled="loading"
  >
    <span v-if="loading">Deleting...</span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
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
    default: 'Delete'
  },
  confirmMessage: {
    type: String,
    default: 'Are you sure you want to delete this item?'
  },
  buttonClass: {
    type: String,
    default: 'btn btn-sm btn-outline-danger'
  },
  onSuccess: {
    type: Function,
    default: null
  },
  onError: {
    type: Function,
    default: null
  }
})

// Define emits
const emit = defineEmits(['success', 'error'])

// Reactive properties
const loading = ref(false)
const { alertConfirm, alertSuccess, alertError } = useAlert()

// Handle delete operation
const handleDelete = async () => {
  const result = await alertConfirm(
    'Confirm Delete',
    props.confirmMessage
  )

  if (result.isConfirmed) {
    try {
      loading.value = true

      // Perform GET request for deletion (as per project requirements)
      await http.get(props.url)

      // Show success message
      alertSuccess('Success', 'Item deleted successfully')

      // Emit success event
      emit('success', props.url)

      // Call onSuccess callback if provided
      if (props.onSuccess) {
        props.onSuccess(props.url)
      }
    } catch (error) {
      console.error('Delete error:', error)

      // Show error message
      alertError('Error', 'Failed to delete item')

      // Emit error event
      emit('error', error)

      // Call onError callback if provided
      if (props.onError) {
        props.onError(error)
      }
    } finally {
      loading.value = false
    }
  }
}

</script>

<style scoped>
/* Add any specific styles for the delete button if needed */
</style>
