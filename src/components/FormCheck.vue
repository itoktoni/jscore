<template>
  <input
    ref="checkboxRef"
    type="checkbox"
    :checked="isChecked"
    :indeterminate="isIndeterminate"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useSelectionState } from '../composables/useSelectionState'

const props = defineProps({
  model: {
    type: [Boolean, Array],
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number],
    default: null
  },
  // New prop for array and data to calculate indeterminate state
  dataArray: {
    type: Array,
    default: () => []
  },
  // New prop to indicate this is a "select all" checkbox
  selectAll: {
    type: Boolean,
    default: false
  },
  // New prop to provide a callback for updating selected items
  updateSelectedItems: {
    type: Function,
    default: null
  },
  // Props for coordinated selection management
  selectedItems: {
    type: Array,
    default: null
  },
  onSelectionChange: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:model', 'select-all', 'selection-change'])

// Use the selection state composable
const {
  selectedItems: internalSelectedItems,
  toggleItemSelection,
  selectAllItems: internalSelectAllItems,
  clearSelection
} = useSelectionState()

const checkboxRef = ref(null)

// Computed property to determine which selected items to use
const effectiveSelectedItems = computed(() => {
  // If selectedItems prop is provided, use it (controlled by parent)
  if (props.selectedItems !== null) {
    return props.selectedItems
  }
  // If model is provided and it's an array, use it
  if (Array.isArray(props.model)) {
    return props.model
  }
  // Otherwise use internal state (uncontrolled)
  return internalSelectedItems.value
})

// Computed property to determine if the checkbox is checked
const isChecked = computed(() => {
  if (props.selectAll) {
    // For select all checkbox, check if all items are selected
    if (!props.dataArray || props.dataArray.length === 0) return false
    return effectiveSelectedItems.value.length === props.dataArray.length
  }

  if (Array.isArray(effectiveSelectedItems.value)) {
    // If selectedItems is an array, check if it includes the value prop
    return props.value !== null && effectiveSelectedItems.value.includes(props.value)
  }
  // If selectedItems is a boolean, use it directly
  return effectiveSelectedItems.value
})

// Computed property to determine indeterminate state
const isIndeterminate = computed(() => {
  // If indeterminate prop is explicitly set, use it
  if (props.indeterminate) {
    return true
  }

  // If we have an array and data array, calculate indeterminate state
  if (Array.isArray(effectiveSelectedItems.value) && props.dataArray && props.dataArray.length > 0) {
    return effectiveSelectedItems.value.length > 0 && effectiveSelectedItems.value.length < props.dataArray.length
  }

  return false
})

// Watch for indeterminate changes and update the checkbox element directly
watch(isIndeterminate, (newValue) => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = newValue
  }
}, { immediate: true })

const handleChange = (event) => {
  if (props.selectAll) {
    // Handle select all functionality
    let selectedIds = [];
    if (event.target.checked) {
      // Select all items
      selectedIds = (props.dataArray || []).map(item => item.id)
    }

    // Notify parent of selection change
    if (props.onSelectionChange) {
      props.onSelectionChange(selectedIds)
    } else if (props.updateSelectedItems) {
      props.updateSelectedItems(selectedIds)
    } else {
      // Otherwise emit the select-all event
      emit('select-all', selectedIds)
    }
    // Emit selection change event
    emit('selection-change', selectedIds)
  } else {
    // Handle individual checkbox
    if (props.value !== null) {
      const currentItems = [...effectiveSelectedItems.value]
      const index = currentItems.indexOf(props.value)

      if (event.target.checked) {
        // Add item if not already selected
        if (index === -1) {
          currentItems.push(props.value)
        }
      } else {
        // Remove item if selected
        if (index > -1) {
          currentItems.splice(index, 1)
        }
      }

      // Update internal state if not controlled by parent
      if (props.selectedItems === null && !Array.isArray(props.model)) {
        internalSelectedItems.value = currentItems
      }

      // Notify parent of selection change
      if (props.onSelectionChange) {
        props.onSelectionChange(currentItems)
      } else if (props.updateSelectedItems) {
        props.updateSelectedItems(currentItems)
      } else {
        // Otherwise emit the update:model event
        emit('update:model', currentItems)
      }
      // Emit selection change event
      emit('selection-change', currentItems)
    }
  }
}
</script>

<style scoped>
/* Add any specific styles for the checkbox if needed */
</style>