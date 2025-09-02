/**
 * Simple Rule-Based Form Validation
 *
 * Provides simple validation using rule strings like "required|email"
 */

import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export function useSimpleValidation() {
  const router = useRouter()

  // Global form state
  const isSubmitting = ref(false)
  const globalError = ref('')

  /**
   * Parse validation rules from string
   * @param {string} rules - Rules string like "required|email|min:3"
   * @returns {Array} - Array of rule objects
   */
  const parseRules = (rules) => {
    if (!rules) return []

    return rules.split('|').map(rule => {
      const [name, param] = rule.split(':')
      return { name: name.trim(), param: param ? param.trim() : null }
    })
  }

  /**
   * Validate a single field
   * @param {string} value - Field value
   * @param {string} rules - Rules string
   * @param {string} fieldName - Field name for error messages
   * @returns {string|null} - Error message or null if valid
   */
  const validateField = (value, rules, fieldName = 'Field') => {
    if (!rules) return null

    const ruleArray = parseRules(rules)

    for (const rule of ruleArray) {
      switch (rule.name) {
        case 'required':
          if (!value || !value.toString().trim()) {
            return `${fieldName} is required`
          }
          break

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address'
          }
          break

        case 'min':
          if (value && value.toString().length < parseInt(rule.param)) {
            return `${fieldName} must be at least ${rule.param} characters`
          }
          break

        case 'max':
          if (value && value.toString().length > parseInt(rule.param)) {
            return `${fieldName} must be no more than ${rule.param} characters`
          }
          break

        case 'numeric':
          if (value && !/^\d+$/.test(value)) {
            return `${fieldName} must be numeric`
          }
          break

        case 'alpha':
          if (value && !/^[a-zA-Z]+$/.test(value)) {
            return `${fieldName} must contain only letters`
          }
          break

        case 'alpha_num':
          if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
            return `${fieldName} must contain only letters and numbers`
          }
          break

        case 'confirmed':
          // This will be handled separately in form validation
          break

        default:
          console.warn(`Unknown validation rule: ${rule.name}`)
      }
    }

    return null
  }

  /**
   * Validate entire form using form elements with rules attributes
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} - Validation result with errors
   */
  const validateForm = (form) => {
    const errors = {}
    let isValid = true

    // Find all inputs with rules attribute
    const inputs = form.querySelectorAll('[rules]')

    inputs.forEach(input => {
      const rules = input.getAttribute('rules')
      const name = input.getAttribute('name') || input.getAttribute('id')
      const label = input.getAttribute('data-label') || name
      const value = input.value

      // Clear previous errors
      input.classList.remove('error')
      const existingError = input.parentNode.querySelector('.field-error')
      if (existingError) {
        existingError.remove()
      }

      // Validate field
      const error = validateField(value, rules, label)

      if (error) {
        errors[name] = error
        isValid = false

        // Add error class and message
        input.classList.add('error')

        const errorDiv = document.createElement('div')
        errorDiv.className = 'field-error'
        errorDiv.textContent = error
        input.parentNode.appendChild(errorDiv)
      }
    })

    // Handle password confirmation
    const passwordInput = form.querySelector('input[name="password"]')
    const confirmInput = form.querySelector('input[name="password_confirmation"]')

    if (passwordInput && confirmInput && confirmInput.getAttribute('rules')?.includes('confirmed')) {
      if (passwordInput.value !== confirmInput.value) {
        const error = 'Passwords do not match'
        errors.password_confirmation = error
        isValid = false

        confirmInput.classList.add('error')
        const errorDiv = document.createElement('div')
        errorDiv.className = 'field-error'
        errorDiv.textContent = error
        confirmInput.parentNode.appendChild(errorDiv)
      }
    }

    return { isValid, errors }
  }

  /**
   * Clear all form errors
   * @param {HTMLFormElement} form - Form element
   */
  const clearErrors = (form) => {
    globalError.value = ''

    if (form) {
      // Remove error classes
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'))

      // Remove error messages
      form.querySelectorAll('.field-error').forEach(el => el.remove())
    }
  }

  /**
   * Handle API errors and map them to form fields
   * @param {Object} error - API error
   * @param {HTMLFormElement} form - Form element
   */
  const handleApiError = (error, form) => {
    isSubmitting.value = false

    console.log('API Error:', error) // Debug log
    console.log('Error Response:', error.response) // Debug log
    console.log('Error Response Data:', error.response?.data) // Debug log

    if (error.response?.status === 422) {
      const responseData = error.response.data
      const apiErrors = responseData?.errors || {}

      console.log('422 Validation Errors:', apiErrors) // Debug log

      clearErrors(form)

      // Set global error message first
      globalError.value = responseData?.message || 'Validation failed'

      // Map API errors to form fields
      Object.keys(apiErrors).forEach(fieldName => {
        const input = form?.querySelector(`[name="${fieldName}"]`)
        console.log(`Looking for field: ${fieldName}, found input:`, input) // Debug log

        if (input && apiErrors[fieldName] && apiErrors[fieldName].length > 0) {
          // Add error class
          input.classList.add('error')

          // Create and add error message
          const errorDiv = document.createElement('div')
          errorDiv.className = 'field-error'
          errorDiv.textContent = apiErrors[fieldName][0]

          // Insert error after input or at end of parent
          if (input.parentNode) {
            input.parentNode.appendChild(errorDiv)
          }

          console.log(`Added error for ${fieldName}: ${apiErrors[fieldName][0]}`) // Debug log
        } else {
          console.warn(`Could not find input for field: ${fieldName}`) // Debug log
        }
      })

      // If no field-specific errors were mapped, but we have errors
      const mappedFieldCount = Object.keys(apiErrors).length
      const foundInputs = Object.keys(apiErrors).filter(fieldName =>
        form?.querySelector(`[name="${fieldName}"]`)
      ).length

      console.log(`Mapped ${foundInputs} of ${mappedFieldCount} field errors`) // Debug log

    } else {
      // Handle non-422 errors
      globalError.value = error.response?.data?.message || error.message || 'An error occurred'
    }
  }

  /**
   * Submit form with validation
   * @param {HTMLFormElement} form - Form element
   * @param {Function} submitFn - Submit function
   * @param {Object} options - Additional options
   */
  const submitForm = async (form, submitFn, options = {}) => {
    const { redirectUrl = null, onSuccess = null, onError = null } = options

    console.log('SubmitForm called with form:', form) // Debug log

    if (!form) {
      console.error('Form element is null or undefined')
      globalError.value = 'Form not found'
      return { success: false, error: 'Form not found' }
    }

    // Validate form
    const validation = validateForm(form)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    isSubmitting.value = true
    clearErrors(form)

    try {
      // Collect form data
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())

      console.log('Form data collected:', data) // Debug log

      const result = await submitFn(data)

      console.log('Submit function result:', result) // Debug log

      if (result && result.success) {
        // Handle success
        if (onSuccess) {
          await onSuccess(result)
        }

        if (redirectUrl) {
          await nextTick()
          router.push(redirectUrl)
        }

        isSubmitting.value = false
        return result
      } else {
        // Handle application-level errors (when result.success is false)
        console.log('Application error:', result) // Debug log

        // Check if this is actually an API error disguised as a result
        if (result && result.errorData && result.errorData.errors) {
          // This looks like a 422 validation error
          const mockError = {
            response: {
              status: 422,
              data: result.errorData
            }
          }
          handleApiError(mockError, form)
        } else {
          globalError.value = result?.error || 'Operation failed'
        }

        isSubmitting.value = false
        return result
      }
    } catch (error) {
      console.log('Caught exception:', error) // Debug log
      handleApiError(error, form)

      if (onError) {
        onError(error)
      }

      return { success: false, error: error.message }
    }
  }

  return {
    // State
    isSubmitting,
    globalError,

    // Methods
    validateField,
    validateForm,
    clearErrors,
    handleApiError,
    submitForm
  }
}