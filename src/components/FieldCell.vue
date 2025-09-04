<template>
  <div class="field-cell" :class="`field-cell--${fieldType}`">
    <span v-if="displayValue">{{ prefix }}{{ displayValue }}{{ suffix }}</span>
    <span v-else class="field-cell__empty">{{ emptyText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: null
  },
  field: {
    type: String,
    default: ''
  },
  fieldType: {
    type: String,
    default: 'text' // text, number, boolean, email, username, status, etc.
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: 'N/A'
  },
  booleanLabels: {
    type: Object,
    default: () => ({ true: 'Yes', false: 'No' })
  }
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return null
  }

  switch (props.fieldType) {
    case 'boolean':
      return props.value ? props.booleanLabels.true : props.booleanLabels.false
    case 'username':
      return `@${props.value}`
    case 'status':
      return props.value ? 'Active' : 'Inactive'
    case 'price':
      return `$${props.value}`
    default:
      return props.value
  }
})
</script>

<style scoped>
.field-cell {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 400;
  color: #333;
  background-color: #f8f9fa;
  min-width: 40px;
  text-align: center;
}

.field-cell__empty {
  color: #999;
  font-style: italic;
}

.field-cell--username {
  font-family: 'Courier New', monospace;
  background-color: #f1f3f5;
}

.field-cell--status {
  font-weight: 500;
}

.field-cell--status.field-cell__active {
  background-color: #d4edda;
  color: #155724;
}

.field-cell--status.field-cell__inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.field-cell--price {
  font-weight: 500;
  color: #28a745;
}

.field-cell--email {
  color: #007bff;
  text-decoration: underline;
}
</style>