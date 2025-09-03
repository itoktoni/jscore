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

      <div v-if="globalError" class="error-message">
        {{ globalError }}
      </div>

      <!-- Footer Actions Slot -->
      <footer v-if="showFooter" class="content-footer safe-area-bottom">
        <slot name="footer" :formData="formData" :fieldErrors="fieldErrors" :isSubmitting="isSubmitting" :handleSubmit="handleSubmit">
          <!-- Default footer content -->
            <FormButton
              v-if="cancelText"
              variant="secondary"
              @click="handleCancel"
              :text="cancelText"
            />
            <FormButton
              type="submit"
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
import { provide, watch } from 'vue'
import { useFormValidation } from '../composables/useFormValidation'
import FormButton from './FormButton.vue'

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

const emit = defineEmits(['submit', 'success', 'error', 'cancel', 'change'])

// Use form validation composable
const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  resetForm,
  setFormData,
  submitForm
} = useFormValidation()

// Initialize form data with props - watch for changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      setFormData(newData)
    }
  },
  { immediate: true, deep: true }
)

// Provide form context to child components
provide('formData', formData)
provide('fieldErrors', fieldErrors)
provide('isSubmitting', isSubmitting)

// Handle form submission
const handleSubmit = async () => {
  console.log('FormContainer handleSubmit called')
  console.log('Form data:', { ...formData })
  // Clear any previous global errors
  globalError.value = ''

  if (props.validateOnSubmit) {
    console.log('Validating form fields')
    // Trigger validation on all fields first
    validateAllFields()

    // Wait for validation to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if there are any validation errors
    if (Object.keys(fieldErrors).length > 0) {
      console.log('Form has validation errors:', fieldErrors)
      globalError.value = 'Please correct the errors below'
      return
    }
  }

  // Use submitHandler or action prop if available, otherwise emit
  const handler = props.submitHandler || props.action
  console.log('Handler function:', handler)
  if (handler) {
    console.log('Calling handler with data:', { ...formData })
    isSubmitting.value = true
    try {
      const result = await handler({ ...formData })

      if (result && result.success !== false) {
        // Handle success
        isSubmitting.value = false
        emit('success', result)
        return result
      } else {
        // Handle submission errors
        if (result && result.errors) {
          // Map API errors to form fields
          Object.keys(result.errors).forEach(fieldName => {
            const error = result.errors[fieldName]
            fieldErrors[fieldName] = typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))
          })
        }
        globalError.value = result?.error || 'Submission failed'
        emit('error', result)
        isSubmitting.value = false
        return result
      }
    } catch (error) {
      isSubmitting.value = false
      globalError.value = error.message || 'An error occurred'
      console.log('Handler error:', error)
      emit('error', error)
      return { success: false, error: error.message }
    }
  } else {
    console.log('Emitting submit event with data:', { ...formData })
    const result = emit('submit', { ...formData })
    return { success: true, data: result }
  }
}

// Method to manually trigger validation on all fields
const validateAllFields = () => {
  // Clear existing errors first
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })

  // We need to trigger validation by dispatching an event that child components can listen to
  const validationEvent = new CustomEvent('validate-all', { bubbles: true })

  // Dispatch the event after a short delay to ensure all components are ready
  setTimeout(() => {
    if (typeof window !== 'undefined' && document) {
      document.dispatchEvent(validationEvent)
    }

    // Wait a bit more for validation to complete
    setTimeout(() => {
      // Check if validation found any errors
      if (Object.keys(fieldErrors).length > 0) {
        globalError.value = 'Please correct the errors below'
      }
    }, 50)
  }, 10)
}

const handleCancel = () => {
  emit('cancel')
}

// Expose methods for parent components
defineExpose({
  formData,
  fieldErrors,
  resetForm,
  setFormData,
  isSubmitting,
  globalError,
  validateAllFields
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