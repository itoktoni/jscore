/**
 * FormButton Component
 *
 * Reusable button component with different variants and mobile-optimized styling
 */

<template>
  <button
    :type="type"
    :disabled="disabled || loading || computedLoading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="computedLoading" class="loading-spinner"></span>
    <span :class="{ 'with-spinner': computedLoading }">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// Try to inject form validation context for auto-loading state
const isSubmitting = inject('isSubmitting', null)

const buttonClasses = computed(() => ({
  'form-button': true,
  [`form-button--${props.variant}`]: true,
  [`form-button--${props.size}`]: true,
  'form-button--block': props.block,
  'form-button--loading': computedLoading.value,
  'form-button--disabled': props.disabled
}))

// Auto-detect loading state from form context if submit button
const computedLoading = computed(() => {
  if (props.loading) return true
  if (props.type === 'submit' && isSubmitting?.value) return true
  return false
})
</script>

<style scoped>
.form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  text-decoration: none;
  position: relative;
}

/* Sizes */
.form-button--small {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.form-button--medium {
  padding: 12px 20px;
  font-size: 16px;
  min-height: 44px;
}

.form-button--large {
  padding: 16px 24px;
  font-size: 18px;
  min-height: 52px;
}

/* Variants */
.form-button--primary {
  background-color: #007bff;
  color: white;
}

.form-button--primary:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.form-button--secondary {
  background-color: #6c757d;
  color: white;
}

.form-button--secondary:hover:not(:disabled) {
  background-color: #545b62;
  transform: translateY(-1px);
}

.form-button--success {
  background-color: #28a745;
  color: white;
}

.form-button--success:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-1px);
}

.form-button--danger {
  background-color: #dc3545;
  color: white;
}

.form-button--danger:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-1px);
}

.form-button--warning {
  background-color: #ffc107;
  color: #212529;
}

.form-button--warning:hover:not(:disabled) {
  background-color: #e0a800;
  transform: translateY(-1px);
}

.form-button--info {
  background-color: #17a2b8;
  color: white;
}

.form-button--info:hover:not(:disabled) {
  background-color: #138496;
  transform: translateY(-1px);
}

/* States */
.form-button--block {
  width: 100%;
}

.form-button--disabled,
.form-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.form-button--loading {
  cursor: wait;
}

.form-button:active:not(:disabled) {
  transform: translateY(0);
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.with-spinner {
  opacity: 0.7;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .form-button--small {
    padding: 10px 18px;
    font-size: 14px;
    min-height: 40px;
  }

  .form-button--medium {
    padding: 14px 22px;
    font-size: 16px;
    min-height: 48px;
  }

  .form-button--large {
    padding: 18px 26px;
    font-size: 18px;
    min-height: 56px;
  }
}
</style>