<template>
  <!-- Submit/Button type -->
  <button
    v-if="type === 'submit' || type === 'button'"
    :type="buttonTypeAttr"
    :disabled="disabled || loading || computedLoading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="computedLoading" class="loading-spinner"></span>
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ displayText }}</slot>
    </span>
  </button>

  <!-- Link type -->
  <button
    v-else-if="type === 'link'"
    :type="buttonTypeAttr"
    :disabled="disabled || loading || computedLoading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="computedLoading" class="loading-spinner"></span>
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ displayText }}</slot>
    </span>
  </button>

  <!-- Delete/Remove type -->
  <button
    v-else-if="type === 'delete' || type === 'remove'"
    @click="handleDelete"
    :class="buttonClasses"
    :disabled="isDeleteDisabled"
  >
    <span v-if="deleteLoading || computedLoading" class="loading-spinner"></span>
    <i v-if="iconClass" :class="iconClass"></i>
    <span :class="{ 'with-spinner': deleteLoading || computedLoading }">
      <span v-if="deleteLoading">{{ deleteLoadingText }}</span>
      <span v-else>{{ displayText }}</span>
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
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'link', 'delete', 'remove'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  loadingText: {
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
  buttonType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
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
  if (props.text && props.text.startsWith('Button.')) {
    const parts = props.text.split('.')
    const action = parts[1].split(':')[0].toUpperCase() // Handle "Button.edit:icon" format
    return BUTTON_ICONS[action] || ''
  }
  return ''
})

// Display text computation
const displayText = computed(() => {
  // Use loading text if provided and button is loading
  if (props.loadingText && (computedLoading.value || deleteLoading.value)) {
    return props.loadingText
  }

  if (props.text && props.text.startsWith('Button.')) {
    const parts = props.text.split('.')
    const actionWithModifier = parts[1]
    const action = actionWithModifier.split(':')[0]
    const modifier = actionWithModifier.split(':')[1]

    // If modifier is "icon", return empty string for icon-only button
    if (modifier === 'icon') {
      return ''
    }

    return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
  }
  return props.text
})

// Try to inject form validation context for auto-loading state
const isSubmitting = inject('isSubmitting', null)

// Computed button type for HTML type attribute
const buttonTypeAttr = computed(() => {
  if (props.type === 'submit') {
    return 'submit'
  } else if (props.type === 'reset') {
    return 'reset'
  }
  return 'button'
})

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

  const classes = []

  // Add base button class
  classes.push('button')

  // Add variant class
  if (variantClasses[props.variant]) {
    classes.push(variantClasses[props.variant])
  } else {
    classes.push('primary')
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

  // Handle column classes
  // If col prop is a string with multiple classes (e.g., "col-6 col-3-md col-2-lg")
  if (props.col && typeof props.col === 'string') {
    // Split the string by spaces and add each class
    const colClasses = props.col.split(' ').filter(cls => cls.trim() !== '')
    classes.push(...colClasses)
  }
  // If col prop is a number or single string class
  else if (props.col !== null && props.col !== undefined) {
    classes.push(`col-${props.col}`)
  }

  // Add custom button class if provided
  if (props.buttonClass) {
    classes.push(props.buttonClass)
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
  if (buttonTypeAttr.value !== 'submit') {
    event.preventDefault()
  }

  // Handle navigation for link type
  if (props.type === 'link' && props.to) {
    router.push(props.to)
  }

  emit('click', event)
}

// Delete/Remove functionality
const deleteLoading = ref(false)

const isDeleteDisabled = computed(() => {
  if (props.type === 'delete') {
    return props.disabled || deleteLoading.value
  } else if (props.type === 'remove') {
    return props.disabled || deleteLoading.value || !props.selectedItems || props.selectedItems.length === 0
  }
  return props.disabled || deleteLoading.value
})

const deleteLoadingText = computed(() => {
  return props.type === 'delete' ? 'Deleting...' : 'Deleting...'
})

const defaultConfirmMessage = computed(() => {
  if (props.confirmMessage) return props.confirmMessage
  if (props.type === 'delete') {
    return 'Are you sure you want to delete this item?'
  } else if (props.type === 'remove') {
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
  if (props.type === 'remove' && (!props.selectedItems || props.selectedItems.length === 0)) {
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

      if (props.type === 'delete') {
        // Perform GET request for deletion (as per project requirements)
        await http.get(props.url)

        // Emit success event
        emit('success', props.url)

        // Call onSuccess callback if provided
        if (props.onSuccess) {
          props.onSuccess(props.url)
        }

        // Refresh the table after successful deletion
        if (props.formTableRef && props.formTableRef.refresh) {
          props.formTableRef.refresh()
        }
      } else if (props.type === 'remove') {
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

      // Show error message
      alertError('Error', `Failed to delete ${props.type === 'delete' ? 'item' : 'selected items'}`)

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
/* Button responsive behavior to work with grid system */

/* Override mobile behavior for col-6 to show 2 buttons per row */
@media screen and (max-width: 599px) {
  .button.col-6 {
    flex: 0 0 calc(50% - var(--grid-gutter)) !important;
    max-width: calc(50% - var(--grid-gutter)) !important;
  }
}

/* Mobile responsiveness for button filter */
@media (max-width: 768px) {
  .button-filter {
    margin-top: 1rem;
  }
}
</style>
