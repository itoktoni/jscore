<template>
  <button
    class="table-action"
    :class="`table-action--${variant}`"
    :title="title"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="text" class="table-action__text">{{ text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default' // default, primary, secondary, success, danger, warning, info
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

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>
.table-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  margin: 0 0.125rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
  background-color: #f8f9fa;
  color: #212529;
  border-color: #dee2e6;
}

.table-action:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.table-action:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.table-action:active {
  background-color: #dae0e5;
  border-color: #a0aabe;
}

/* Variant styles */
.table-action--primary {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.table-action--primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.table-action--primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}

.table-action--secondary {
  background-color: #6c757d;
  color: #fff;
  border-color: #6c757d;
}

.table-action--secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.table-action--secondary:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
}

.table-action--success {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}

.table-action--success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.table-action--success:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}

.table-action--danger {
  background-color: #dc3545;
  color: #fff;
  border-color: #dc3545;
}

.table-action--danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.table-action--danger:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}

.table-action--warning {
  background-color: #ffc107;
  color: #212529;
  border-color: #ffc107;
}

.table-action--warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.table-action--warning:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
}

.table-action--info {
  background-color: #17a2b8;
  color: #fff;
  border-color: #17a2b8;
}

.table-action--info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.table-action--info:focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

/* Icon and text styling */
.table-action i {
  margin-right: 0.25rem;
}

.table-action__text {
  margin-left: 0.25rem;
}

/* Compact version for icon-only buttons */
.table-action:not(.table-action--text-only) i:only-child {
  margin-right: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-action {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .table-action i {
    font-size: 0.875rem;
  }
}
</style>