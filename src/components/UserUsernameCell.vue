<template>
  <div class="user-username-cell">
    <span v-if="user.username">@{{ user.username }}</span>
    <span v-else>N/A</span>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.user-username-cell {
  font-family: 'Courier New', monospace;
  color: #666;
}

.user-username-cell span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #f1f3f5;
}
</style>