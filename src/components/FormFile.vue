<template>
  <div :class="formGroupClasses">
    <label v-if="computedLabel" :for="computedId" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <div class="file-input-wrapper">
      <input
        :id="computedId"
        :name="name"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :class="inputClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div v-if="computedValue && computedValue.length > 0" class="file-preview">
        <div v-for="(file, index) in computedValue" :key="index" class="file-item">
          <span class="file-name">{{ file.name }}</span>
          <button
            type="button"
            class="file-remove"
            @click="removeFile(index)"
            :disabled="disabled"
          >
            &times;
          </button>
        </div>
      </div>
      <div v-if="computedError" class="field-error">
        {{ computedError }}
      </div>
      <div v-if="hint && !computedError" class="field-hint">
        {{ hint }}
      </div>
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
    type: [File, Array],
    default: null
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
  accept: {
    type: String,
    default: ''
  },
  multiple: {
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
  return 'file-' + Math.random().toString(36).substr(2, 9)
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
  if (props.modelValue !== null && props.modelValue !== undefined) return props.modelValue
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
  'form-file': true,
  'error': !!computedError.value,
  'disabled': props.disabled
}))

const handleChange = (event) => {
  const files = event.target.files

  if (props.multiple) {
    // For multiple files, emit an array of files
    const fileList = Array.from(files)
    emit('update:modelValue', fileList)

    // Also update formData if available
    if (formData && props.name) {
      formData.value[props.name] = fileList
    }
  } else {
    // For single file, emit the first file or null if no files
    const file = files.length > 0 ? files[0] : null
    emit('update:modelValue', file)

    // Also update formData if available
    if (formData && props.name) {
      formData.value[props.name] = file
    }
  }

  // Clear field error when user selects files
  if (fieldErrors && props.name && fieldErrors.value[props.name]) {
    delete fieldErrors.value[props.name]
  }

  emit('change', files)
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

const removeFile = (index) => {
  if (props.disabled) return

  if (props.multiple && Array.isArray(computedValue.value)) {
    // Create a new array without the file at the specified index
    const newFiles = [...computedValue.value]
    newFiles.splice(index, 1)
    emit('update:modelValue', newFiles)

    // Also update formData if available
    if (formData && props.name) {
      formData.value[props.name] = newFiles
    }
  } else {
    // For single file, just clear the value
    emit('update:modelValue', null)

    // Also update formData if available
    if (formData && props.name) {
      formData.value[props.name] = null
    }
  }
}

// Function to trigger validation from external sources
const triggerValidation = () => {
  if (props.rules && formData && props.name) {
    // Parse rules (simplified validation)
    const rules = props.rules.split('|')

    // Check required validation
    if (rules.includes('required')) {
      // Check if no file is selected
      const isEmpty = !computedValue.value ||
                     (Array.isArray(computedValue.value) && computedValue.value.length === 0) ||
                     computedValue.value === null;

      if (isEmpty) {
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
.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-file {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  touch-action: manipulation;
}

.form-file:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-file.error {
  border-color: #dc3545;
}

.form-file.disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.file-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.file-name {
  flex-grow: 1;
  font-size: 0.875rem;
  color: #495057;
  word-break: break-all;
}

.file-remove {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.file-remove:hover:not(:disabled) {
  background-color: rgba(220, 53, 69, 0.1);
}

.file-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .form-file {
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