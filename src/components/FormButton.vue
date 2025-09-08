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
    @click="handleClick"
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
  },
  col: {
    type: [String, Number],
    default: null  // Changed from 4 to null to indicate no column width specified
  }
})

const emit = defineEmits(['click'])

// Try to inject form validation context for auto-loading state
const isSubmitting = inject('isSubmitting', null)

const buttonClasses = computed(() => {
  const classes = {
    'form-button': true,
    [`form-button--${props.variant}`]: true,
    [`form-button--${props.size}`]: true,
    'form-button--block': props.block,
    'form-button--loading': computedLoading.value,
    'form-button--disabled': props.disabled
  }

  // Only add column class if col prop is provided
  if (props.col !== null && props.col !== undefined) {
    classes[`col-${props.col}`] = true
  } else {
    // Add flexible width class when no column is specified
    classes['form-button--flexible'] = true
  }

  return classes
})

// Auto-detect loading state from form context if submit button
const computedLoading = computed(() => {
  if (props.loading) return true
  if (props.type === 'submit' && isSubmitting?.value) return true
  return false
})

// Handle click event - don't prevent default for submit buttons
const handleClick = (event) => {
  // For submit buttons, let the form handle the submission
  if (props.type !== 'submit') {
    event.preventDefault()
  } else {
    // For submit buttons, we want the form to handle the submission
    // Don't prevent default, let the form's submit event handle it
  }
  emit('click', event)
}
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
  padding: 10px 20px; /* Default padding for all buttons */
  min-width: fit-content; /* Ensure button is at least as wide as its content */
}

/* Flexible button - adjusts to content width */
.form-button--flexible {
  display: inline-flex;
  width: auto;
  margin-right: 10px;
  vertical-align: top;
}

/* Column support - make components work inline without row wrapper */
.form-button.col-1 {
  display: inline-block;
  width: calc(8.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-2 {
  display: inline-block;
  width: calc(16.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-3 {
  display: inline-block;
  width: calc(25% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-4 {
  display: inline-block;
  width: calc(33.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-5 {
  display: inline-block;
  width: calc(41.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-6 {
  display: inline-block;
  width: calc(50% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-7 {
  display: inline-block;
  width: calc(58.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-8 {
  display: inline-block;
  width: calc(66.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-9 {
  display: inline-block;
  width: calc(75% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-10 {
  display: inline-block;
  width: calc(83.333% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-11 {
  display: inline-block;
  width: calc(91.666% - 10px);
  margin-right: 10px;
  vertical-align: top;
}

.form-button.col-12 {
  display: block;
  width: 100%;
  margin-right: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .form-button[class*="col-"] {
    display: block !important;
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }

  /* Flexible buttons also become full width on mobile */
  .form-button--flexible {
    display: block !important;
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
}

/* Sizes */
.form-button--small {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.form-button--medium {
  padding: 10px 20px;
  font-size: 16px;
  /* min-height: 44px; */
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