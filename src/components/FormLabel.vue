/**
 * FormLabel Component
 *
 * Reusable label component for displaying read-only form data
 */

<template>
  <div :class="formGroupClasses">
    <label v-if="computedLabel" class="form-label">
      {{ computedLabel }}
      <span v-if="isRequired" class="required-asterisk">*</span>
    </label>
    <div class="form-value">
      <slot>{{ value || 'N/A' }}</slot>
    </div>
    <div v-if="hint" class="field-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  col: {
    type: [String, Number],
    default: 12
  }
})

const formGroupClasses = computed(() => {
  const classes = ['form-group']

  // Always apply column class since we have a default
  classes.push(`col-${props.col}`)

  return classes
})

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

// Auto-detect required
const isRequired = computed(() => {
  return props.required
})
</script>

<style scoped>
.form-value {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.required-asterisk {
  color: #dc3545;
  margin-left: 0.25rem;
}

.field-hint {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.col-12 {
  width: 100%;
}

.form-group.col-6 {
  width: 50%;
  float: left;
  padding-right: 0.5rem;
}

.form-group.col-6:last-child {
  padding-right: 0;
  padding-left: 0.5rem;
}

/* Clear floats */
.form-group::after {
  content: '';
  display: table;
  clear: both;
}

/* Dark mode styles */
.dark .form-value {
  background-color: var(--bg-white);
  color: var(--text-dark);
  border-color: var(--color-border-light);
}

.dark .form-label {
  color: var(--text-dark);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .form-group.col-6 {
    width: 100%;
    float: none;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>