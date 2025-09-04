/**
 * FormSelect Component
 *
 * Reusable select component with validation and mobile-optimized styling
 * Supports search functionality for large option sets
 */

<template>
  <div :class="formGroupClasses" ref="selectContainer">
    <label v-if="computedLabel" :for="computedId" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <div class="select-wrapper" :class="{ 'select-open': isOpen }">
      <div
        :id="computedId"
        class="select-display"
        :class="selectClasses"
        @click="toggleSelect"
        @blur="handleBlur"
        @keydown.down.prevent="openSelect"
        @keydown.enter.prevent="openSelect"
        @keydown.space.prevent="openSelect"
        tabindex="0"
        ref="selectDisplay"
      >
        <span v-if="selectedLabel" class="select-text">{{ selectedLabel }}</span>
        <span v-else class="select-placeholder">{{ computedPlaceholder }}</span>
        <i class="select-arrow" :class="{ 'arrow-up': isOpen }"></i>
      </div>
      <div v-show="isOpen" class="select-dropdown" ref="dropdown">
        <div v-if="searchable" class="select-search">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="select-search-input"
            :placeholder="searchPlaceholder"
            @input="handleSearch"
            @keydown.down.prevent="focusFirstOption"
            @keydown.up.prevent="focusLastOption"
            @keydown.enter.prevent="selectHighlighted"
            @keydown.esc.prevent="closeSelect"
          />
        </div>
        <div class="select-options" ref="optionsContainer">
          <div
            v-for="(option, index) in filteredOptions"
            :key="getOptionValue(option)"
            class="select-option"
            :class="{ 'selected': isOptionSelected(option), 'highlighted': highlightedIndex === index }"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            {{ getOptionLabel(option) }}
          </div>
          <div v-if="filteredOptions.length === 0" class="select-no-results">
            No results found
          </div>
        </div>
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
import { computed, inject, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

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
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

// Try to inject form validation context
const formData = inject('formData', null)
const fieldErrors = inject('fieldErrors', null)
const isSubmitting = inject('isSubmitting', null)

// Reactive refs
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const selectContainer = ref(null)
const selectDisplay = ref(null)
const dropdown = ref(null)
const searchInput = ref(null)
const optionsContainer = ref(null)

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
  if (formData && props.name && formData.value[props.name] !== undefined) {
    return formData.value[props.name]
  }
  return props.modelValue
})

// Get label for selected value
const selectedLabel = computed(() => {
  if (!computedValue.value && computedValue.value !== 0) return ''

  const selectedOption = props.options.find(option =>
    getOptionValue(option) === computedValue.value
  )

  return selectedOption ? getOptionLabel(selectedOption) : ''
})

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.options

  return props.options.filter(option => {
    const label = getOptionLabel(option).toLowerCase()
    return label.includes(query)
  })
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

const selectClasses = computed(() => ({
  'form-select': true,
  'error': !!computedError.value,
  'disabled': props.disabled,
  'select-searchable': props.searchable
}))

const getOptionValue = (option) => {
  return typeof option === 'object' ? option[props.optionValue] : option
}

const getOptionLabel = (option) => {
  return typeof option === 'object' ? option[props.optionLabel] : option
}

const isOptionSelected = (option) => {
  return getOptionValue(option) === computedValue.value
}

const toggleSelect = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
}

const openSelect = () => {
  if (props.disabled) return
  isOpen.value = true
  nextTick(() => {
    if (props.searchable && searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const closeSelect = (shouldFocus = true) => {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
  if (shouldFocus && selectDisplay.value) {
    selectDisplay.value.focus()
  }
}

const selectOption = (option) => {
  const value = getOptionValue(option)

  // Emit v-model update
  emit('update:modelValue', value)
  emit('change', value)

  // Also update formData if available
  if (formData && props.name) {
    formData.value[props.name] = value
  }

  // Clear field error when user makes selection
  if (fieldErrors && props.name && fieldErrors.value[props.name]) {
    delete fieldErrors.value[props.name]
  }

  closeSelect()
}

const handleSearch = () => {
  highlightedIndex.value = -1
}

const focusFirstOption = () => {
  if (filteredOptions.value.length > 0) {
    highlightedIndex.value = 0
    scrollToOption(0)
  }
}

const focusLastOption = () => {
  if (filteredOptions.value.length > 0) {
    highlightedIndex.value = filteredOptions.value.length - 1
    scrollToOption(filteredOptions.value.length - 1)
  }
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value])
  }
}

const scrollToOption = (index) => {
  if (optionsContainer.value && index >= 0) {
    const optionElements = optionsContainer.value.querySelectorAll('.select-option')
    if (optionElements[index]) {
      optionElements[index].scrollIntoView({ block: 'nearest' })
    }
  }
}

const handleBlur = (event) => {
  // Delay blur handling to allow for option selection
  setTimeout(() => {
    if (!selectContainer.value?.contains(document.activeElement)) {
      // Don't force focus when closing due to blur
      closeSelect(false)
      emit('blur', event)
    }
  }, 150)
}

// Function to trigger validation from external sources
const triggerValidation = () => {
  if (props.rules && formData && props.name) {
    // For select validation, we'd need to implement rule parsing similar to FormInput
    // For now, just check required validation
    if (props.rules.includes('required')) {
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
  }
}

// Listen for validation events from FormContainer
const handleValidateAll = () => {
  triggerValidation();
}

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    // Don't force focus when closing due to clicking outside
    closeSelect(false)
  }
}

// Handle keyboard navigation
const handleKeydown = (event) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      // Don't force focus when closing with Escape key
      closeSelect(false)
      break
    case 'ArrowDown':
      event.preventDefault()
      if (highlightedIndex.value < filteredOptions.value.length - 1) {
        highlightedIndex.value++
        scrollToOption(highlightedIndex.value)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
        scrollToOption(highlightedIndex.value)
      }
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectHighlighted()
      }
      break
  }
}

// Set up event listeners
onMounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.addEventListener('validate-submit', handleValidateAll)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.removeEventListener('validate-submit', handleValidateAll)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})

// Watch for option changes to reset highlighted index
watch(filteredOptions, () => {
  highlightedIndex.value = -1
})
</script>

<style scoped>
.form-select {
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  touch-action: manipulation;
  position: relative;
}

.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.select-wrapper {
  position: relative;
}

.select-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.select-display:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.select-text {
  flex-grow: 1;
  text-align: left;
}

.select-placeholder {
  flex-grow: 1;
  text-align: left;
  color: #999;
}

.select-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.select-arrow.arrow-up {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 2px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.select-search {
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
}

.select-search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.select-options {
  max-height: 150px;
  overflow-y: auto;
}

.select-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.select-option:hover,
.select-option.highlighted {
  background-color: #f8f9fa;
}

.select-option.selected {
  background-color: #e9ecef;
  font-weight: bold;
}

.select-no-results {
  padding: 0.75rem 1rem;
  color: #666;
  font-style: italic;
}

.select-open .select-display {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .select-display {
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

  .select-option {
    padding: 1rem;
  }
}
</style>