<template>
  <div class="user-role-cell">
    <span>{{ displayRole }}</span>
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

const displayRole = computed(() => {
  return props.user.system_role_name || 'User'
})
</script>

<style scoped>
.user-role-cell {
  font-weight: 400;
  color: #555;
}

.user-role-cell span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #e9ecef;
}
</style>