<template>
  <div :class="formGroupClasses" ref="selectContainer">
    <label v-if="computedLabel" :for="computedId" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <div v-if="loading" class="select-loading">
      {{ loadingText }}
    </div>
    <div v-else-if="error" class="select-error">
      {{ errorText }}: {{ error }}
    </div>
    <div v-else class="select-wrapper" :class="{ 'select-open': isOpen }">
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
        <span v-if="displayValue" class="select-text">{{ displayValue }}</span>
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
import http from '../stores/http'

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
    type: [String, Number, Array],
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
    default: () => []
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
  },
  multiple: {
    type: Boolean,
    default: false
  },
  // API-related props
  endpoint: {
    type: String,
    default: ''
  },
  labelField: {
    type: String,
    default: null
  },
  valueField: {
    type: String,
    default: null
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  errorText: {
    type: String,
    default: 'Error loading data'
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change', 'refresh'])

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
const apiOptions = ref([])
const loading = ref(false)
const error = ref(null)

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
  if (props.modelValue !== '' && props.modelValue !== undefined) return props.modelValue
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

const selectClasses = computed(() => ({
  'form-select': true,
  'error': !!computedError.value,
  'disabled': props.disabled,
  'select-searchable': props.searchable,
  'select-multiple': props.multiple
}))

// Computed property for filtered options based on search query
const filteredOptions = computed(() => {
  let options = props.options.length > 0 ? props.options : apiOptions.value

  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    return options.filter(option => {
      const label = getOptionLabel(option)
      return label.toLowerCase().includes(query)
    })
  }

  return options
})

// Computed property for display value
const displayValue = computed(() => {
  if (props.multiple) {
    // For multiple selection, show count of selected items
    if (Array.isArray(computedValue.value) && computedValue.value.length > 0) {
      const selectedOptions = (props.options.length > 0 ? props.options : apiOptions.value)
        .filter(option => computedValue.value.includes(getOptionValue(option)))

      if (selectedOptions.length > 0) {
        return selectedOptions.map(option => getOptionLabel(option)).join(', ')
      }

      // Fallback to showing count
      return `${computedValue.value.length} item(s) selected`
    }
    return ''
  } else {
    // For single selection, show the label of the selected option
    if (computedValue.value !== null && computedValue.value !== undefined && computedValue.value !== '') {
      const selectedOption = (props.options.length > 0 ? props.options : apiOptions.value)
        .find(option => getOptionValue(option) === computedValue.value)

      if (selectedOption) {
        return getOptionLabel(selectedOption)
      }

      // Fallback to showing the value itself
      return computedValue.value
    }
    return ''
  }
})

const getOptionValue = (option) => {
  return typeof option === 'object' ? option[props.optionValue] : option
}

const getOptionLabel = (option) => {
  return typeof option === 'object' ? option[props.optionLabel] : option
}

const isOptionSelected = (option) => {
  const value = getOptionValue(option)

  if (props.multiple) {
    return Array.isArray(computedValue.value) && computedValue.value.includes(value)
  } else {
    return value === computedValue.value
  }
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

  if (props.multiple) {
    // Handle multiple selection
    let newValue
    if (Array.isArray(computedValue.value)) {
      if (computedValue.value.includes(value)) {
        // Remove value if already selected
        newValue = computedValue.value.filter(v => v !== value)
      } else {
        // Add value if not already selected
        newValue = [...computedValue.value, value]
      }
    } else {
      // If current value is not an array, start with an array containing the new value
      newValue = [value]
    }

    // Emit v-model update
    emit('update:modelValue', newValue)
    emit('change', newValue)

    // Also update formData if available
    if (formData && props.name) {
      formData.value[props.name] = newValue

      // Clear field error when user makes selection
      if (fieldErrors && props.name && fieldErrors.value[props.name]) {
        delete fieldErrors.value[props.name]
      }
    }
  } else {
    // Handle single selection
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
      let isEmpty
      if (props.multiple) {
        // For multiple selection, check if array is empty
        isEmpty = !Array.isArray(computedValue.value) || computedValue.value.length === 0

        if (isEmpty) {
          if (fieldErrors && props.name) {
            fieldErrors.value[props.name] = `${computedLabel.value} is required`
          }
        } else if (fieldErrors && props.name) {
          delete fieldErrors.value[props.name]
        }
      } else {
        // For single selection, check if value is empty
        isEmpty = computedValue.value === null ||
                  computedValue.value === undefined ||
                  computedValue.value === ''

        if (isEmpty) {
          if (fieldErrors && props.name) {
            fieldErrors.value[props.name] = `${computedLabel.value} is required`
          }
        } else if (fieldErrors && props.name) {
          delete fieldErrors.value[props.name]
        }
      }
    }
  }
}

// Listen for validation events from FormContainer
const handleValidateAll = () => {
  triggerValidation()
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

// Fetch data from API endpoint
const fetchData = async () => {
  // Only fetch if we have an endpoint
  if (!props.endpoint) return

  loading.value = true
  error.value = null

  try {
    // Ensure endpoint starts with a forward slash
    const url = props.endpoint.startsWith('/') ? props.endpoint : `/${props.endpoint}`

    // Fetch data from the API endpoint
    const response = await http.get(url)

    const data = response.data

    // Transform data based on props
    if (Array.isArray(data)) {
      apiOptions.value = data.map(item => {
        // Use manual mapping if provided, otherwise auto-detect
        const label = props.labelField
          ? item[props.labelField]
          : (item.name || item.label || item.title || item.text || String(item[props.optionLabel]))

        const value = props.valueField
          ? item[props.valueField]
          : (item.id || item.value || item.key || item[props.optionValue])

        return {
          [props.optionLabel]: label,
          [props.optionValue]: value
        }
      })
    } else if (data.data && Array.isArray(data.data)) {
      // Handle paginated API responses
      apiOptions.value = data.data.map(item => {
        // Use manual mapping if provided, otherwise auto-detect
        const label = props.labelField
          ? item[props.labelField]
          : (item.name || item.label || item.title || item.text || String(item[props.optionLabel]))

        const value = props.valueField
          ? item[props.valueField]
          : (item.id || item.value || item.key || item[props.optionValue])

        return {
          [props.optionLabel]: label,
          [props.optionValue]: value
        }
      })
    } else {
      apiOptions.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('Error fetching select options:', err)
    apiOptions.value = []
  } finally {
    loading.value = false
  }
}

// Refresh data from API
const refresh = () => {
  fetchData()
  emit('refresh')
}

// Set up event listeners
onMounted(() => {
  if (typeof window !== 'undefined' && document) {
    document.addEventListener('validate-submit', handleValidateAll)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  }

  // Fetch data if we have an endpoint
  if (props.endpoint) {
    fetchData()
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

// Watch for endpoint changes and refetch data
watch(() => props.endpoint, (newEndpoint, oldEndpoint) => {
  if (newEndpoint && newEndpoint !== oldEndpoint) {
    fetchData()
  }
})

// Expose method to refresh data
defineExpose({
  refresh
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

.select-loading,
.select-error {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.select-error {
  color: #dc3545;
  background-color: #f8d7da;
  border-color: #f5c6cb;
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

  .select-loading,
  .select-error {
    padding: 1rem;
    font-size: 13px;
  }
}
</style>