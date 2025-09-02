/**
 * FormInput Component
 *
 * Reusable input component with validation and mobile-optimized styling
 */

<template>
  <div class="form-group">
    <label v-if="computedLabel" :for="id || name" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <input
      :id="id || name"
      :name="name"
      :type="type"
      :value="computedValue"
      :placeholder="computedPlaceholder"
      :disabled="disabled"
      :required="isRequired"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <div v-if="computedError" class="field-error">
      {{ computedError }}
    </div>
    <div v-if="hint && !computedError" class="field-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  rules: {
    type: String,
    default: ''
  },
  customValidators: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

// Track if field has been touched by user
const isTouched = ref(false)

// Try to inject form validation context
const formData = inject('formData', null)
const fieldErrors = inject('fieldErrors', null)

// Parse validation rules from string
const parseRules = (rulesString) => {
  if (!rulesString) return []
  return rulesString.split('|').map(rule => {
    const [name, param] = rule.split(':')
    return { name: name.trim(), param: param ? param.trim() : null }
  })
}

// Validate field value against rules
const validateField = (value, rulesString, fieldName) => {
  if (!rulesString) return null

  const rules = parseRules(rulesString)
  const val = value?.toString().trim() || ''

  for (const rule of rules) {
    switch (rule.name) {
      case 'required':
        if (!val) {
          return `${fieldName} is required`
        }
        break

      case 'email':
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return 'Please enter a valid email address'
        }
        break

      case 'min':
        if (val && val.length < parseInt(rule.param)) {
          return `${fieldName} must be at least ${rule.param} characters`
        }
        break

      case 'max':
        if (val && val.length > parseInt(rule.param)) {
          return `${fieldName} must be no more than ${rule.param} characters`
        }
        break

      case 'numeric':
        if (val && !/^\d+$/.test(val)) {
          return `${fieldName} must be numeric`
        }
        break

      case 'alpha':
        if (val && !/^[a-zA-Z]+$/.test(val)) {
          return `${fieldName} must contain only letters`
        }
        break

      case 'alpha_num':
        if (val && !/^[a-zA-Z0-9]+$/.test(val)) {
          return `${fieldName} must contain only letters and numbers`
        }
        break

      case 'confirmed':
        if (formData && rule.param) {
          const confirmValue = formData[rule.param]
          if (val !== confirmValue) {
            return 'Passwords do not match'
          }
        } else if (formData && props.name.includes('confirmation')) {
          const baseField = props.name.replace('_confirmation', '')
          const baseValue = formData[baseField]
          if (val !== baseValue) {
            return 'Passwords do not match'
          }
        }
        break

      // Custom validation rules
      case 'unique':
        // This would typically make an API call to check uniqueness
        // For now, just a placeholder
        break

      case 'phone':
        if (val && !/^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number'
        }
        break

      case 'url':
        if (val && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/.test(val)) {
          return 'Please enter a valid URL'
        }
        break

      case 'strong_password':
        if (val && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(val)) {
          return 'Password must contain uppercase, lowercase, number and special character'
        }
        break

      default:
        // Handle custom validation functions if provided
        if (rule.name.startsWith('custom:') && props.customValidators) {
          const validatorName = rule.name.replace('custom:', '')
          if (props.customValidators[validatorName]) {
            const result = props.customValidators[validatorName](val, rule.param, formData)
            if (result !== true) {
              return result
            }
          }
        }
        break
    }
  }

  return null
}

const inputClasses = computed(() => ({
  'form-input': true,
  'error': !!computedError.value,
  'disabled': props.disabled
}))

// Auto-generate label from name if not provided
const computedLabel = computed(() => {
  if (props.label) return props.label
  if (props.name) {
    return props.name
      .split(/[_-]/) // Split on underscore or hyphen
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return ''
})

// Auto-generate placeholder from label if not provided
const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  return `Enter ${computedLabel.value.toLowerCase()}`
})

// Auto-resolve value from formData if available
const computedValue = computed(() => {
  if (props.modelValue !== '') return props.modelValue
  if (formData && props.name && formData[props.name] !== undefined) {
    return formData[props.name]
  }
  return props.modelValue
})

// Auto-resolve error from fieldErrors or validate using rules
const computedError = computed(() => {
  if (props.error) return props.error

  // Check injected fieldErrors first
  if (fieldErrors && props.name && fieldErrors[props.name]) {
    return fieldErrors[props.name]
  }

  // Only validate if field has been touched and we have rules
  if (props.rules && isTouched.value && computedValue.value !== undefined) {
    const validationError = validateField(computedValue.value, props.rules, computedLabel.value)
    if (validationError && fieldErrors) {
      // Update fieldErrors for other components to see
      fieldErrors[props.name] = validationError
    }
    return validationError
  }

  return ''
})

// Auto-detect required from rules
const isRequired = computed(() => {
  if (props.required) return true
  if (props.rules && props.rules.includes('required')) return true
  return false
})

const handleInput = (event) => {
  const value = event.target.value

  // Mark field as touched when user starts typing
  isTouched.value = true

  // Emit v-model update
  emit('update:modelValue', value)

  // Also update formData if available
  if (formData && props.name) {
    formData[props.name] = value
  }

  // Clear field error when user starts typing
  if (fieldErrors && props.name && fieldErrors[props.name]) {
    delete fieldErrors[props.name]
  }
}

const handleFocus = (event) => {
  // Mark field as touched when user focuses on it
  isTouched.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  // Mark field as touched on blur
  isTouched.value = true

  // Trigger validation on blur
  if (props.rules) {
    const validationError = validateField(event.target.value, props.rules, computedLabel.value)
    if (validationError && fieldErrors && props.name) {
      fieldErrors[props.name] = validationError
    }
  }

  emit('blur', event)
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.required-asterisk {
  color: #dc3545;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 14px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  border-color: #e9ecef;
}

.form-input.error {
  border-color: #dc3545;
  background-color: #fff5f5;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.field-error {
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 0;
  font-weight: 500;
}

.field-hint {
  color: #6c757d;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .form-input {
    padding: 16px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .form-label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .field-error,
  .field-hint {
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>