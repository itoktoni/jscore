/**
 * Enhanced Form Validation for Components
 *
 * Works with FormInput components using reactive data and validation rules
 */

import { ref, reactive, computed, provide } from 'vue'
import { useRouter } from 'vue-router'

export function useFormValidation() {
  const router = useRouter()

  // Global form state
  const isSubmitting = ref(false)
  const globalError = ref('')
  const fieldErrors = reactive({})
  const formData = reactive({})

  // Provide form context for FormInput components
  provide('formData', formData)
  provide('fieldErrors', fieldErrors)
  provide('isSubmitting', isSubmitting)

  /**
   * Common validation rules
   */
  const commonRules = {
    required: (message = 'This field is required') => ({
      required: true,
      requiredMessage: message
    }),

    email: (message = 'Please enter a valid email address') => ({
      email: true,
      emailMessage: message
    }),

    minLength: (length, message = `Must be at least ${length} characters`) => ({
      minLength: length,
      minLengthMessage: message
    }),

    maxLength: (length, message = `Must be no more than ${length} characters`) => ({
      maxLength: length,
      maxLengthMessage: message
    }),

    numeric: (message = 'Must be numeric only') => ({
      numeric: true,
      numericMessage: message
    }),

    alpha: (message = 'Must contain only letters') => ({
      alpha: true,
      alphaMessage: message
    }),

    alphaNum: (message = 'Must contain only letters and numbers') => ({
      alphaNum: true,
      alphaNumMessage: message
    }),

    username: (minLength = 3, message = null) => ({
      ...commonRules.required('Username is required'),
      ...commonRules.minLength(minLength),
      alphaNum: true,
      alphaNumMessage: message || `Username must contain only letters and numbers`
    }),

    password: (minLength = 6, message = null) => ({
      ...commonRules.required('Password is required'),
      ...commonRules.minLength(minLength, message || `Password must be at least ${minLength} characters`)
    }),

    confirmPassword: (passwordField = 'password', message = 'Passwords do not match') => ({
      confirmed: passwordField,
      confirmedMessage: message
    })
  }

  /**
   * Validate a single field value
   * @param {string} value - Field value
   * @param {Object} rules - Validation rules object
   * @param {string} fieldName - Field name
   * @returns {string|null} - Error message or null if valid
   */
  const validateField = (value, rules, fieldName) => {
    if (!rules) return null

    const val = value?.toString().trim() || ''

    // Required validation
    if (rules.required && !val) {
      return rules.requiredMessage || `${fieldName} is required`
    }

    // Skip other validations if field is empty and not required
    if (!val) return null

    // Email validation
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return rules.emailMessage || 'Please enter a valid email address'
    }

    // Minimum length validation
    if (rules.minLength && val.length < rules.minLength) {
      return rules.minLengthMessage || `${fieldName} must be at least ${rules.minLength} characters`
    }

    // Maximum length validation
    if (rules.maxLength && val.length > rules.maxLength) {
      return rules.maxLengthMessage || `${fieldName} must be no more than ${rules.maxLength} characters`
    }

    // Numeric validation
    if (rules.numeric && !/^\d+$/.test(val)) {
      return rules.numericMessage || `${fieldName} must be numeric`
    }

    // Alpha validation
    if (rules.alpha && !/^[a-zA-Z]+$/.test(val)) {
      return rules.alphaMessage || `${fieldName} must contain only letters`
    }

    // Alpha numeric validation
    if (rules.alphaNum && !/^[a-zA-Z0-9]+$/.test(val)) {
      return rules.alphaNumMessage || `${fieldName} must contain only letters and numbers`
    }

    // Password confirmation validation
    if (rules.confirmed) {
      const confirmValue = formData[rules.confirmed]
      if (val !== confirmValue) {
        return rules.confirmedMessage || 'Passwords do not match'
      }
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const result = rules.custom(val, formData)
      if (result !== true) {
        return result
      }
    }

    return null
  }

  /**
   * Validate entire form
   * @param {Object} validationRules - Validation rules for each field
   * @returns {boolean} - True if form is valid
   */
  const validateForm = (validationRules) => {
    let isValid = true

    // Clear previous errors
    Object.keys(fieldErrors).forEach(key => {
      delete fieldErrors[key]
    })

    // Validate each field
    Object.keys(validationRules).forEach(fieldName => {
      const rules = validationRules[fieldName]
      const value = formData[fieldName]
      const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)

      const error = validateField(value, rules, label)
      if (error) {
        fieldErrors[fieldName] = error
        isValid = false
      }
    })

    return isValid
  }

  /**
   * Handle API errors and map them to form fields
   * @param {Object} error - API error
   */
  const handleApiError = (error) => {
    isSubmitting.value = false

    if (error.response?.status === 422) {
      const responseData = error.response.data
      const apiErrors = responseData?.errors || {}

      // Clear previous errors
      Object.keys(fieldErrors).forEach(key => {
        delete fieldErrors[key]
      })

      // Set global error message
      globalError.value = responseData?.message || 'Validation failed'

      // Map API errors to form fields
      Object.keys(apiErrors).forEach(fieldName => {
        if (apiErrors[fieldName] && apiErrors[fieldName].length > 0) {
          fieldErrors[fieldName] = apiErrors[fieldName][0]
        }
      })
    } else {
      // Handle non-422 errors
      globalError.value = error.response?.data?.message || error.message || 'An error occurred'
    }
  }

  /**
   * Reset form data and errors
   */
  const resetForm = () => {
    // Clear all form data
    Object.keys(formData).forEach(key => {
      delete formData[key];
    });

    // Clear all field errors
    Object.keys(fieldErrors).forEach(key => {
      delete fieldErrors[key];
    });

    // Clear global error
    globalError.value = '';

    console.log('Form reset completed');
  }

  /**
   * Set form data
   * @param {Object} data - Data to set
   */
  const setFormData = (data) => {
    // Clear all existing keys first
    Object.keys(formData).forEach(key => {
      delete formData[key];
    });

    // Set new data
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        formData[key] = data[key];
      });
    }
  }

  /**
   * Submit form with validation
   * @param {Function} submitFn - Submit function
   * @param {Object} validationRules - Validation rules
   * @param {Object} options - Additional options
   */
  const submitForm = async (submitFn, validationRules, options = {}) => {
    const { redirectUrl = null, onSuccess = null, onError = null, skipValidation = false } = options

    if (!skipValidation && !validateForm(validationRules)) {
      return { success: false, errors: fieldErrors }
    }

    isSubmitting.value = true
    globalError.value = ''

    try {
      const result = await submitFn({ ...formData })

      if (result && result.success !== false) {
        // Handle success
        if (onSuccess) {
          await onSuccess(result)
        }

        if (redirectUrl) {
          router.push(redirectUrl)
        }

        isSubmitting.value = false
        return result
      } else {
        // Handle application-level errors
        if (result && result.errorData && result.errorData.errors) {
          // This looks like a 422 validation error
          const mockError = {
            response: {
              status: 422,
              data: result.errorData
            }
          }
          handleApiError(mockError)
        } else {
          globalError.value = result?.error || 'Operation failed'
        }

        isSubmitting.value = false
        return result
      }
    } catch (error) {
      handleApiError(error)

      if (onError) {
        onError(error)
      }

      return { success: false, error: error.message }
    }
  }

  /**
   * Computed property for form validity
   */
  const isFormValid = computed(() => {
    return Object.keys(fieldErrors).length === 0
  })

  return {
    // State
    isSubmitting,
    globalError,
    fieldErrors,
    formData,
    isFormValid,

    // Common rules
    commonRules,

    // Methods
    validateField,
    validateForm,
    handleApiError,
    resetForm,
    setFormData,
    submitForm
  }
}