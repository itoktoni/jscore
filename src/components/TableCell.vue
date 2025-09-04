<template>
  <td v-if="!isChild" :data-label="label" class="table-cell" :class="cellClass">
    <div class="table-cell__content">
      <slot>
        <span v-if="displayValue">{{ prefix }}{{ displayValue }}{{ suffix }}</span>
        <span v-else class="table-cell__empty">{{ emptyText }}</span>
      </slot>
    </div>
  </td>
  <div v-else class="table-cell__content">
    <slot>
      <span v-if="displayValue">{{ prefix }}{{ displayValue }}{{ suffix }}</span>
      <span v-else class="table-cell__empty">{{ emptyText }}</span>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    default: null
  },
  type: {
    type: String,
    default: 'text' // text, number, boolean, email, username, status, price, etc.
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
  },
  isChild: {
    type: Boolean,
    default: false
  }
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return null
  }

  switch (props.type) {
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

const cellClass = computed(() => {
  return [
    `table-cell--${props.type}`,
    {
      'table-cell--empty': !displayValue.value
    }
  ]
})
</script>

<style scoped>
.table-cell {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table-cell__content {
  display: flex;
  align-items: center;
  min-height: 1.5rem;
}

.table-cell__empty {
  color: #999;
  font-style: italic;
}

/* Type specific styles */
.table-cell--username {
  font-family: 'Courier New', monospace;
}

.table-cell--status {
  font-weight: 500;
}

.table-cell--status span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.table-cell--status span:first-child {
  background-color: #d4edda;
  color: #155724;
}

.table-cell--status span:last-child {
  background-color: #f8d7da;
  color: #721c24;
}

.table-cell--price {
  font-weight: 500;
  color: #28a745;
}

.table-cell--email {
  color: #007bff;
  text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-cell {
    display: block;
    padding: 0.5rem;
  }

  .table-cell:before {
    content: attr(data-label) ": ";
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
  }
}
</style>