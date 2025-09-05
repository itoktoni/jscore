<template>
  <div class="plugin-section">
    <h2>@aashu-dubey/capacitor-statusbar-safe-area</h2>
    <div class="plugin-content">
      <p><strong>Status Bar & Safe Area Info:</strong></p>
      <pre v-if="safeAreaInfo">{{ JSON.stringify(safeAreaInfo, null, 2) }}</pre>
      <button class="button primary" @click="getSafeAreaInfo">Get Safe Area Info</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { SafeArea } from '@aashu-dubey/capacitor-statusbar-safe-area'

// Reactive data
const safeAreaInfo = ref(null)

// Safe Area Plugin
const getSafeAreaInfo = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const info = await SafeArea.getSafeAreaInsets()
      safeAreaInfo.value = info
      console.log('Safe Area Info:', info)
    } else {
      safeAreaInfo.value = { message: 'Safe Area plugin only available on native platforms' }
    }
  } catch (error) {
    console.error('Error getting safe area info:', error)
    safeAreaInfo.value = { error: error.message }
  }
}
</script>

<style scoped>
.plugin-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}

.plugin-section h2 {
  margin-top: 0;
  color: #333;
}

.plugin-content {
  margin-top: 1rem;
}

pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
