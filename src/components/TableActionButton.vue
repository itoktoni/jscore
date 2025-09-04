<template>
  <button
    :class="['table-action-button', `table-action-button--${variant}`]"
    :title="title"
    @click="$emit('click', $event)"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.table-action-button {
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.table-action-button:hover {
  border: 1px solid #ddd;
}

.table-action-button--primary {
  color: #007bff;
}

.table-action-button--secondary {
  color: #6c757d;
}

.table-action-button--info {
  color: #17a2b8;
}

.table-action-button--success {
  color: #28a745;
}

.table-action-button--warning {
  color: #ffc107;
}

.table-action-button--danger {
  color: #dc3545;
}

.table-action-button--default {
  color: #333;
}
</style>