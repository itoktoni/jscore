<template>
  <div :class="formGroupClasses">
    <label v-if="computedLabel" :for="computedId" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <textarea
      :id="computedId"
      :name="name"
      :value="computedValue"
      :placeholder="computedPlaceholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>
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
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
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
  col: {
    type: [String, Number],
    default: 12
  },
  rows: {
    type: [String, Number],
    default: 3
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

// Try to inject form validation context
const formData = inject('formData', null)
const fieldErrors = inject('fieldErrors', null)
const isSubmitting = inject('isSubmitting', null)

// Auto-generate ID from name if not provided
const computedId = computed(() => {
  if (props.id) return props.id
  if (props.name) return props.name
  return 'textarea-' + Math.random().toString(36).substr(2, 9)
})

// Auto-generate label from name if not provided
const computedLabel = computed(() => {
  if (props.label) return props.label
  if (props.name) {
    return props.name
      .split(/[_-]/)
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
  if (formData && props.name && formData.value[props.name] !== undefined) {
    return formData.value[props.name]
  }
  return props.modelValue
})

// Auto-resolve error from fieldErrors
const computedError = computed(() => {
  if (props.error) return props.error
  if (fieldErrors && props.name && fieldErrors.value[props.name]) {
    const error = fieldErrors.value[props.name]
    // Ensure we return a string, not an array or object
    return typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))
  }
  return ''
})

// Auto-detect required from rules
const isRequired = computed(() => {
  if (props.required) return true
  if (props.rules && props.rules.includes('required')) return true
  return false
})

const formGroupClasses = computed(() => {
  const classes = ['form-group']

  // Always apply column class since we have a default
  classes.push(`col-${props.col}`)

  return classes
})

const inputClasses = computed(() => ({
  'form-textarea': true,
  'error': !!computedError.value,
  'disabled': props.disabled
}))

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)

  // Also update formData if available
  if (formData && props.name) {
    formData.value[props.name] = value
  }

  // Clear field error when user types
  if (fieldErrors && props.name && fieldErrors.value[props.name]) {
    delete fieldErrors.value[props.name]
  }

  emit('change', value)
}

const handleBlur = (event) => {
  emit('blur', event)

  // Trigger validation on blur if rules are defined
  if (props.rules && formData && props.name) {
    triggerValidation()
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

// Function to trigger validation from external sources
const triggerValidation = () => {
  if (props.rules && formData && props.name) {
    // Parse rules (simplified validation)
    const rules = props.rules.split('|')

    // Check required validation
    if (rules.includes('required')) {
      // Check if value is empty (null, undefined, empty string)
      const isEmpty = computedValue.value === null ||
                     computedValue.value === undefined ||
                     computedValue.value === '';

      if (isEmpty) {
        if (fieldErrors && props.name) {
          fieldErrors.value[props.name] = `${computedLabel.value} is required`;
        }
      } else if (fieldErrors && props.name) {
        delete fieldErrors.value[props.name];
      }
    }

    // Check min length validation
    const minLengthRule = rules.find(rule => rule.startsWith('min:'))
    if (minLengthRule) {
      const minLength = parseInt(minLengthRule.split(':')[1])
      if (computedValue.value && computedValue.value.length < minLength) {
        if (fieldErrors && props.name) {
          fieldErrors.value[props.name] = `${computedLabel.value} must be at least ${minLength} characters`;
        }
      } else if (fieldErrors && props.name) {
        delete fieldErrors.value[props.name];
      }
    }

    // Check max length validation
    const maxLengthRule = rules.find(rule => rule.startsWith('max:'))
    if (maxLengthRule) {
      const maxLength = parseInt(maxLengthRule.split(':')[1])
      if (computedValue.value && computedValue.value.length > maxLength) {
        if (fieldErrors && props.name) {
          fieldErrors.value[props.name] = `${computedLabel.value} must be no more than ${maxLength} characters`;
        }
      } else if (fieldErrors && props.name) {
        delete fieldErrors.value[props.name];
      }
    }
  }
}

// Listen for validation events from FormContainer
const handleValidateAll = () => {
  triggerValidation();
}

// Set up event listeners
if (typeof window !== 'undefined' && document) {
  document.addEventListener('validate-submit', handleValidateAll)
}

// Clean up event listeners
if (typeof window !== 'undefined' && document) {
  window.addEventListener('beforeunload', () => {
    document.removeEventListener('validate-submit', handleValidateAll)
  })
}
</script>

<style scoped>
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  touch-action: manipulation;
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea.error {
  border-color: #dc3545;
}

.form-textarea.disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .form-textarea {
    padding: 1rem;
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