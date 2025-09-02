/**
 * ErrorMessage Component
 *
 * Reusable error message component for displaying global errors
 */

<template>
  <div v-if="message" class="error-message">
    {{ message }}
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-line;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .error-message {
    padding: 10px 12px;
    font-size: 13px;
    margin-top: 12px;
  }
}
</style>