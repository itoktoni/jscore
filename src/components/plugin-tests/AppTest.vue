<template>
  <div class="plugin-section">
    <h2>@capacitor/app</h2>
    <div class="plugin-content">
      <p><strong>App Info:</strong></p>
      <pre v-if="appInfo">{{ JSON.stringify(appInfo, null, 2) }}</pre>
      <button class="button primary" @click="getAppInfo">Get App Info</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

// Reactive data
const appInfo = ref(null)

// App Plugin
const getAppInfo = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const info = await App.getInfo()
      appInfo.value = info
      console.log('App Info:', info)
    } else {
      appInfo.value = { message: 'App plugin only available on native platforms' }
    }
  } catch (error) {
    console.error('Error getting app info:', error)
    appInfo.value = { error: error.message }
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
