<template>
  <div class="user-display">
    <p><strong>Name:</strong> {{ user.name || 'N/A' }}</p>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.user-display {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>