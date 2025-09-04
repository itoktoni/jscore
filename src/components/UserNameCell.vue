<template>
  <div class="user-name-cell">
    <span>{{ displayName }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const displayName = computed(() => {
  return props.user.name || props.user.username || 'N/A'
})
</script>

<style scoped>
.user-name-cell {
  font-weight: 500;
  color: #333;
}

.user-name-cell span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
}
</style>