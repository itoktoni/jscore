<template>
  <!-- Submit/Button type -->
  <button
    v-if="buttonType === 'submit' || buttonType === 'button'"
    :type="type"
    :disabled="disabled || loading || computedLoading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="computedLoading" class="loading-spinner"></span>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ text }}</slot>
    </span>
  </button>

  <!-- Link type -->
  <div v-else-if="buttonType === 'link'" class="form-link">
    <p>
      {{ text }}
      <router-link :to="to" class="link">
        {{ linkText }}
      </router-link>
    </p>
  </div>

  <!-- Delete/Remove type -->
  <button
    v-else-if="buttonType === 'delete' || buttonType === 'remove'"
    @click="handleDelete"
    :class="buttonClass"
    :disabled="isDeleteDisabled"
  >
    <span v-if="deleteLoading">{{ deleteLoadingText }}</span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../stores/http'
import { useAlert } from '../composables/useAlert'

// Define props
const props = defineProps({
  // Common props
  buttonType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'link', 'delete', 'remove'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },

  // Button/Submit specific props
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  },
  col: {
    type: [String, Number],
    default: null
  },

  // Link specific props
  to: {
    type: [String, Object],
    default: ''
  },
  linkText: {
    type: String,
    default: ''
  },

  // Delete/Remove specific props
  url: {
    type: String,
    default: ''
  },
  confirmMessage: {
    type: String,
    default: ''
  },
  buttonClass: {
    type: String,
    default: 'btn btn-sm btn-outline-danger'
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  formTableRef: {
    type: Object,
    default: null
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

const emit = defineEmits(['click', 'success', 'error'])

// Router and alert
const router = useRouter()
const { alertConfirm, alertSuccess, alertError } = useAlert()

// Try to inject form validation context for auto-loading state
const isSubmitting = inject('isSubmitting', null)

// Button/Submit functionality
const buttonClasses = computed(() => {
  // If this is a delete button, use the provided buttonClass
  if (props.buttonType === 'delete' || props.buttonType === 'remove') {
    return props.buttonClass
  }

  const classes = {
    'button': true,
    [`button ${props.variant}`]: true,
    [`button ${props.size}`]: true,
    'button block': props.block,
    'button loading': computedLoading.value,
    'button disabled': props.disabled
  }

  // Only add column class if col prop is provided
  if (props.col !== null && props.col !== undefined) {
    classes[`col-${props.col}`] = true
  } else {
    // Add flexible width class when no column is specified
    classes['form-button--flexible'] = true
  }

  return classes
})

// Auto-detect loading state from form context if submit button
const computedLoading = computed(() => {
  if (props.loading) return true
  if (props.type === 'submit' && isSubmitting?.value) return true
  return false
})

// Handle click event - don't prevent default for submit buttons
const handleClick = (event) => {
  // For submit buttons, let the form handle the submission
  if (props.type !== 'submit') {
    event.preventDefault()
  }
  emit('click', event)
}

// Delete/Remove functionality
const deleteLoading = ref(false)

const isDeleteDisabled = computed(() => {
  if (props.buttonType === 'delete') {
    return props.disabled || deleteLoading.value
  } else if (props.buttonType === 'remove') {
    return props.disabled || deleteLoading.value || !props.selectedItems || props.selectedItems.length === 0
  }
  return props.disabled || deleteLoading.value
})

const deleteLoadingText = computed(() => {
  return props.buttonType === 'delete' ? 'Deleting...' : 'Deleting...'
})

const defaultConfirmMessage = computed(() => {
  if (props.confirmMessage) return props.confirmMessage
  if (props.buttonType === 'delete') {
    return 'Are you sure you want to delete this item?'
  } else if (props.buttonType === 'remove') {
    if (!props.selectedItems || props.selectedItems.length === 0) {
      return 'You must select items first before deleting'
    }
    return `Are you sure you want to delete ${props.selectedItems.length} selected items?`
  }
  return 'Are you sure?'
})

// Handle delete operation
const handleDelete = async () => {
  // Check if any items are selected for remove type
  if (props.buttonType === 'remove' && (!props.selectedItems || props.selectedItems.length === 0)) {
    alertError('Error', 'You must select items first before deleting')
    return
  }

  // Use Swal confirmation dialog
  const result = await alertConfirm(
    'Confirm Delete',
    defaultConfirmMessage.value,
    'Yes, delete it!',
    'Cancel'
  )

  if (result.isConfirmed) {
    try {
      deleteLoading.value = true

      if (props.buttonType === 'delete') {
        // Perform GET request for deletion (as per project requirements)
        await http.get(props.url)

        // Emit success event
        emit('success', props.url)

        // Call onSuccess callback if provided
        if (props.onSuccess) {
          props.onSuccess(props.url)
        }
      } else if (props.buttonType === 'remove') {
        // If formTableRef is provided, handle batch deletion manually
        if (props.formTableRef) {
          // Perform the deletion for selected items using the FormTable's delete endpoint
          await http.post(props.formTableRef.$props.delete, { code: props.selectedItems })

          // Refresh the table after successful deletion
          if (props.formTableRef.refresh) {
            props.formTableRef.refresh()
          }
        } else {
          // Fallback to direct API call if no formTableRef
          await http.post(props.url, { code: props.selectedItems })
        }

        // Emit success event
        emit('success', props.url)
      }
    } catch (error) {
      console.error('Delete error:', error)

      // Show error message
      alertError('Error', `Failed to delete ${props.buttonType === 'delete' ? 'item' : 'selected items'}`)

      // Emit error event
      emit('error', error)

      // Call onError callback if provided
      if (props.onError) {
        props.onError(error)
      }
    } finally {
      deleteLoading.value = false
    }
  }
}
</script>

<style scoped>
/* Button styles from FormButton */
.form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  text-decoration: none;
  position: relative;
  padding: 10px 20px;
  min-width: fit-content;
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.with-spinner {
  opacity: 0.7;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Link styles from FormLink */
.form-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.form-link p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Mobile optimizations for link */
@media (max-width: 480px) {
  .form-link {
    margin-top: 15px;
    padding-top: 12px;
  }

  .form-link p {
    font-size: 13px;
  }
}
</style>