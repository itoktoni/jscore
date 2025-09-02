/**
 * FormSelect Component
 *
 * Reusable select component with validation and mobile-optimized styling
 */

<template>
  <div :class="formGroupClasses">
    <label v-if="computedLabel" :for="computedId" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <select
      :id="computedId"
      :value="computedValue"
      :disabled="disabled"
      :required="isRequired"
      :class="selectClasses"
      @change="handleChange"
      @blur="handleBlur"
      @focus="$emit('focus')"
    >
      <option v-if="computedPlaceholder" value="" disabled>{{ computedPlaceholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <div v-if="computedError" class="field-error">
      {{ computedError }}
    </div>
    <div v-if="hint && !computedError" class="field-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'

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
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
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
    default: 6
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

// Try to inject form validation context
const formData = inject('formData', null)
const fieldErrors = inject('fieldErrors', null)

// Auto-generate ID from name if not provided
const computedId = computed(() => {
  if (props.id) return props.id
  if (props.name) return props.name
  return 'select-' + Math.random().toString(36).substr(2, 9)
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
  return `Select ${computedLabel.value.toLowerCase()}`
})

// Auto-resolve value from formData if available
const computedValue = computed(() => {
  if (props.modelValue !== '') return props.modelValue
  if (formData && props.name && formData[props.name] !== undefined) {
    return formData[props.name]
  }
  return props.modelValue
})

// Auto-resolve error from fieldErrors
const computedError = computed(() => {
  if (props.error) return props.error
  if (fieldErrors && props.name && fieldErrors[props.name]) {
    const error = fieldErrors[props.name]
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

const selectClasses = computed(() => ({
  'form-select': true,
  'error': !!computedError.value,
  'disabled': props.disabled
}))

const getOptionValue = (option) => {
  return typeof option === 'object' ? option[props.optionValue] : option
}

const getOptionLabel = (option) => {
  return typeof option === 'object' ? option[props.optionLabel] : option
}

const handleChange = (event) => {
  const value = event.target.value

  // Emit v-model update
  emit('update:modelValue', value)

  // Also update formData if available
  if (formData && props.name) {
    formData[props.name] = value
  }

  // Clear field error when user makes selection
  if (fieldErrors && props.name && fieldErrors[props.name]) {
    delete fieldErrors[props.name]
  }
}

const handleBlur = (event) => {
  emit('blur', event)
}

// Function to trigger validation from external sources
const triggerValidation = () => {
  if (props.rules && formData && computedValue.value !== undefined) {
    // For select validation, we'd need to implement rule parsing similar to FormInput
    // For now, just check required validation
    if (props.rules.includes('required') && !computedValue.value) {
      if (fieldErrors && props.name) {
        fieldErrors[props.name] = `${computedLabel.value} is required`
      }
    } else if (fieldErrors && props.name) {
      delete fieldErrors[props.name]
    }
  }
}

// Listen for validation events from FormContainer
const handleValidateAll = () => {
  triggerValidation()
}

// Set up event listeners
onMounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.addEventListener('validate-all', handleValidateAll)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.removeEventListener('validate-all', handleValidateAll)
  }
})
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

/* Column support - make components work inline without row wrapper */
.form-group.col-1 {
  display: inline-block;
  width: calc(8.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-2 {
  display: inline-block;
  width: calc(16.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-3 {
  display: inline-block;
  width: calc(25% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-4 {
  display: inline-block;
  width: calc(33.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-5 {
  display: inline-block;
  width: calc(41.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-6 {
  display: inline-block;
  width: calc(50% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-7 {
  display: inline-block;
  width: calc(58.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-8 {
  display: inline-block;
  width: calc(66.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-9 {
  display: inline-block;
  width: calc(75% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-10 {
  display: inline-block;
  width: calc(83.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-11 {
  display: inline-block;
  width: calc(91.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-group.col-12 {
  display: block;
  width: 100%;
  margin-right: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .form-group[class*="col-"] {
    display: block !important;
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 15px;
  }
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
  margin-left: 3px;
}

.form-select {
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 12px;
  padding-right: 0px;
}

.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-select.disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  border-color: #e9ecef;
}

.form-select.error {
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
  .form-select {
    padding: 16px 14px;
    padding-right: 40px;
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