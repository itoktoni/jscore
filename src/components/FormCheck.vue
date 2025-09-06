<template>
  <input
    ref="checkboxRef"
    type="checkbox"
    :checked="isChecked"
    @change="handleChange"
    v-bind="$attrs"
  >
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

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
  }
})

const emit = defineEmits(['update:model'])

const checkboxRef = ref(null)

// Computed property to determine if the checkbox is checked
const isChecked = computed(() => {
  if (Array.isArray(props.model)) {
    // If model is an array, check if it includes the value prop
    return props.value !== null && props.model.includes(props.value)
  }
  // If model is a boolean, use it directly
  return props.model
})

// Computed property to determine indeterminate state
const isIndeterminate = computed(() => {
  // If indeterminate prop is explicitly set, use it
  if (props.indeterminate) {
    return true
  }

  // If we have an array and data array, calculate indeterminate state
  if (Array.isArray(props.model) && props.dataArray.length > 0) {
    return props.model.length > 0 && props.model.length < props.dataArray.length
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
  if (Array.isArray(props.model)) {
    // Handle array-based selection
    if (event.target.checked) {
      // Add value to array if not already present
      if (props.value !== null && !props.model.includes(props.value)) {
        emit('update:model', [...props.model, props.value])
      }
    } else {
      // Remove value from array
      if (props.value !== null) {
        const newArray = props.model.filter(item => item !== props.value)
        emit('update:model', newArray)
      }
    }
  } else {
    // Handle boolean-based selection
    emit('update:model', event.target.checked)
  }
}
</script>

<style scoped>
/* You can add custom styling here if needed */
</style>