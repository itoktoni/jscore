<template>
  <input
    type="checkbox"
    :checked="checked"
    @change="$emit('change', $event)"
  >
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])
</script>

<style scoped>
/* Add any specific styling for the table checkbox if needed */
input[type="checkbox"] {
  cursor: pointer;
}
</style>