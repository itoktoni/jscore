<template>
  <div class="card">
    <div v-if="title" class="page-header">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <slot
        :formData="formData"
        :fieldErrors="fieldErrors"
        :isSubmitting="isSubmitting"
        :globalError="globalError"
        :handleSubmit="handleSubmit"
      />

      <!-- Footer Actions Slot -->
      <footer v-if="showFooter" class="content-footer safe-area-bottom">
        <slot name="footer" :formData="formData" :fieldErrors="fieldErrors" :isSubmitting="isSubmitting" :handleSubmit="handleSubmit">
          <!-- Default footer content -->
            <Button
              v-if="cancelText"
              button-type="button"
              variant="secondary"
              @click="handleCancel"
              :text="cancelText"
            />
            <Button
              button-type="submit"
              :variant="submitVariant"
              :text="isSubmitting ? loadingText : submitText"
              :disabled="isSubmitting"
            />
        </slot>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { provide, watch, ref, onMounted, onUnmounted } from 'vue'
import { useAlert } from '../composables/useAlert'
import { http } from '../stores/http'
import Button from './Button.vue'

const { alertError, alertValidationError } = useAlert()

const props = defineProps({
  // Form header
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },

  // Form behavior
  initialData: {
    type: Object,
    default: () => ({})
  },

  // Submit handler function (support both submitHandler and action props)
  submitHandler: {
    type: Function,
    required: false
  },
  action: {
    type: Function,
    required: false
  },

  // Endpoint for direct API submission (Vueform-like approach)
  endpoint: {
    type: String,
    required: false
  },

  // Footer configuration
  showFooter: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  loadingText: {
    type: String,
    default: 'Submitting...'
  },
  submitVariant: {
    type: String,
    default: 'success'
  },

  // Validation
  validateOnSubmit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'success', 'error', 'cancel'])

// Form state
const formData = ref({ ...props.initialData })
const fieldErrors = ref({})
const isSubmitting = ref(false)
const globalError = ref('')

// Initialize form data with props - watch for changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = { ...newData }
    }
  },
  { immediate: true, deep: true }
)

// Provide form context to child components
provide('formData', formData)
provide('fieldErrors', fieldErrors)
provide('isSubmitting', isSubmitting)

// Simple validation function - to be called on submit
const validateFields = () => {
  // Clear existing errors first
  fieldErrors.value = {}

  // Dispatch validation event for child components to listen to
  const validationEvent = new CustomEvent('validate-submit', { bubbles: true })
  if (typeof window !== 'undefined' && document) {
    document.dispatchEvent(validationEvent)
  }

  // Give components time to respond
  return new Promise(resolve => setTimeout(resolve, 100))
}

// Handle field validation error events
const handleFieldValidationError = (event) => {
  const { fieldName, error } = event.detail
  if (fieldName && error) {
    fieldErrors.value[fieldName] = error
  }
}

// Handle field validation clear events
const handleFieldValidationClear = (event) => {
  const { fieldName } = event.detail
  if (fieldName && fieldErrors.value[fieldName]) {
    delete fieldErrors.value[fieldName]
  }
}

// Handle form submission
const handleSubmit = async () => {
  // Clear any previous global errors
  globalError.value = ''

  if (props.validateOnSubmit) {
    await validateFields()

    // Check if there are any validation errors
    if (Object.keys(fieldErrors.value).length > 0) {
      globalError.value = 'Please correct the errors below'

      // Show alert for validation errors
      alertValidationError('Validation Error', 'Please correct the errors below')

      return
    }
  }

  // Use endpoint prop for direct API submission if provided (Vueform-like approach)
  if (props.endpoint) {
    isSubmitting.value = true
    try {
      const response = await http.post(props.endpoint, { ...formData.value })

      isSubmitting.value = false
      emit('success', response)

      return response
    } catch (error) {
      isSubmitting.value = false

      // Handle API validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data.errors || {}
        Object.keys(errors).forEach(fieldName => {
          const errorMessages = errors[fieldName]
          fieldErrors.value[fieldName] = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages
        })
        globalError.value = error.response.data.message || 'Please correct the errors below'
        alertValidationError('Validation Error', error.response.data.message || 'Please correct the errors below')
      } else {
        globalError.value = error.response?.data?.message || error.message || 'An error occurred'
        alertError('Error', error.response?.data?.message || error.message || 'An error occurred')
      }

      emit('error', error)
      return { success: false, error: error.message }
    }
  }

  // Use submitHandler or action prop if available, otherwise emit
  const handler = props.submitHandler || props.action

  if (handler) {
    isSubmitting.value = true
    try {
      const result = await handler({ ...formData.value })

      if (result && result.success !== false) {
        // Handle success
        isSubmitting.value = false
        emit('success', result)

        // Success notification is now handled manually in the page components
        // Removed automatic Swal.fire notification

        return result
      } else {
        // Handle submission errors
        // Check for errors in result.errors or result.errorData.errors
        const errors = result?.errors || result?.errorData?.errors
        if (errors) {
          // Map API errors to form fields
          Object.keys(errors).forEach(fieldName => {
            const error = errors[fieldName]
            fieldErrors.value[fieldName] = typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))
          })
        }
        globalError.value = result?.error || result?.errorData?.message || 'Submission failed'

        // Show alert for submission errors
        alertError('Submission Error', result?.error || result?.errorData?.message || 'Submission failed')

        emit('error', result)
        isSubmitting.value = false
        return result
      }
    } catch (error) {
      isSubmitting.value = false
      globalError.value = error.message || 'An error occurred'

      // Show alert for unexpected errors
      alertError('Error', error.message || 'An error occurred')

      emit('error', error)
      return { success: false, error: error.message }
    }
  } else {
    const result = emit('submit', { ...formData.value })
    return { success: true, data: result }
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Simple reset function
const resetForm = () => {
  formData.value = { ...props.initialData }
  fieldErrors.value = {}
  globalError.value = ''
}

// Expose methods for parent components
defineExpose({
  formData,
  fieldErrors,
  resetForm,
  isSubmitting,
  globalError
})

// Set up event listeners
onMounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.addEventListener('field-validation-error', handleFieldValidationError)
    document.addEventListener('field-validation-clear', handleFieldValidationClear)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.removeEventListener('field-validation-error', handleFieldValidationError)
    document.removeEventListener('field-validation-clear', handleFieldValidationClear)
  }
})

</script>

<style scoped>
.form-container {
  background-color: var(--bg-white, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 0.375rem;
  color: #c53030;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 0.75rem;
}
</style>