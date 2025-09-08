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
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ text }}</slot>
    </span>
  </button>

  <!-- Link type -->
  <button
    v-else-if="buttonType === 'link'"
    :type="type"
    :disabled="disabled || loading || computedLoading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="computedLoading" class="loading-spinner"></span>
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ text }}</slot>
    </span>
  </button>

  <!-- Delete/Remove type -->
  <button
    v-else-if="buttonType === 'delete' || buttonType === 'remove'"
    @click="handleDelete"
    :class="buttonClasses"
    :disabled="isDeleteDisabled"
  >
    <span v-if="deleteLoading || computedLoading" class="loading-spinner"></span>
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': deleteLoading || computedLoading }">
      <span v-if="deleteLoading">{{ deleteLoadingText }}</span>
      <span v-else>{{ text }}</span>
    </span>
  </button>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../stores/http'
import { useAlert } from '../composables/useAlert'
import { BUTTON_ICONS } from '../models/ButtonIcons'

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
  iconType: {
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
    default: ''
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

// Icon class computation
const iconClass = computed(() => {
  if (props.iconType) {
    const upper = props.iconType.toUpperCase()
    return BUTTON_ICONS[upper] || props.iconType
  }
  return ''
})

// Try to inject form validation context for auto-loading state
const isSubmitting = inject('isSubmitting', null)

// Button/Submit functionality
const buttonClasses = computed(() => {
  // Map variants to CSS classes that match the role create page
  const variantClasses = {
    'primary': 'button primary',
    'secondary': 'button secondary',
    'success': 'button success',
    'danger': 'button danger',
    'warning': 'button warning',
    'info': 'button info'
  }

  // Map sizes to CSS classes
  const sizeClasses = {
    'small': 'small',
    'medium': 'medium',
    'large': 'large'
  }

  const classes = []

  // Add base button class
  classes.push('button')

  // Add variant class
  if (variantClasses[props.variant]) {
    classes.push(variantClasses[props.variant])
  } else {
    classes.push('primary')
  }

  // Add size class
  if (sizeClasses[props.size]) {
    classes.push(sizeClasses[props.size])
  }

  // Add block class if needed
  if (props.block) {
    classes.push('block')
  }

  // Add loading class
  if (computedLoading.value || deleteLoading.value) {
    classes.push('loading')
  }

  // Add disabled class
  if (props.disabled || isDeleteDisabled.value) {
    classes.push('disabled')
  }

  // Only add column class if col prop is provided
  if (props.col !== null && props.col !== undefined) {
    classes.push(`col-${props.col}`)
  } else {
    // Add flexible width class when no column is specified
    classes.push('flexible')
  }

  return classes.join(' ')
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

  // Handle navigation for link type
  if (props.buttonType === 'link' && props.to) {
    router.push(props.to)
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