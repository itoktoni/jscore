<template>
  <div :class="formGroupClasses">
    <div class="toggle-container">
      <label v-if="computedLabel" :for="computedId" class="toggle-label">
        {{ computedLabel }}
        <span v-if="isRequired" class="required-asterisk">*</span>
      </label>
      <div class="toggle-wrapper">
        <input
          :id="computedId"
          :name="name"
          type="checkbox"
          :checked="computedValue"
          :disabled="disabled"
          :class="inputClasses"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />
        <label :for="computedId" class="toggle-switch">
          <span class="toggle-slider"></span>
        </label>
        <span v-if="showText" class="toggle-text">
          {{ computedValue ? onText : offText }}
        </span>
      </div>
    </div>
    <div v-if="computedError" class="field-error">
      {{ computedError }}
    </div>
    <div v-if="hint && !computedError" class="field-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

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
    type: Boolean,
    default: false
  },
  label: {
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
  onText: {
    type: String,
    default: 'On'
  },
  offText: {
    type: String,
    default: 'Off'
  },
  showText: {
    type: Boolean,
    default: false
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
  return 'toggle-' + Math.random().toString(36).substr(2, 9)
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

// Auto-resolve value from formData if available
const computedValue = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
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
  'form-toggle': true,
  'error': !!computedError.value,
  'disabled': props.disabled
}))

const handleChange = (event) => {
  const value = event.target.checked
  emit('update:modelValue', value)

  // Also update formData if available
  if (formData && props.name) {
    formData.value[props.name] = value
  }

  // Clear field error when user toggles
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
      // For toggle, required means it must be true/on
      if (!computedValue.value) {
        if (fieldErrors && props.name) {
          fieldErrors.value[props.name] = `${computedLabel.value} is required`;
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
.toggle-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-toggle {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch .toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-switch .toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.form-toggle:checked + .toggle-switch .toggle-slider {
  background-color: #007bff;
}

.form-toggle:checked + .toggle-switch .toggle-slider:before {
  transform: translateX(26px);
}

.form-toggle:disabled + .toggle-switch {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-toggle.error + .toggle-switch {
  box-shadow: 0 0 0 2px #dc3545;
}

.toggle-text {
  font-size: 0.875rem;
  color: #666;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .toggle-label {
    font-size: 13px;
  }

  .field-error,
  .field-hint {
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>