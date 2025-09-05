<template>
  <div class="plugin-section">
    <h2>@capacitor/network</h2>
    <div class="plugin-content">
      <p><strong>Network Status:</strong></p>
      <pre v-if="networkStatus">{{ JSON.stringify(networkStatus, null, 2) }}</pre>
      <button class="button primary" @click="getNetworkStatus">Get Network Status</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'

// Reactive data
const networkStatus = ref(null)

// Network Plugin
const getNetworkStatus = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await Network.getStatus()
      networkStatus.value = status
      console.log('Network Status:', status)
    } else {
      networkStatus.value = {
        connected: navigator.onLine,
        connectionType: 'unknown',
        message: 'Using browser network detection'
      }
    }
  } catch (error) {
    console.error('Error getting network status:', error)
    networkStatus.value = { error: error.message }
  }
}

// Set up network listener
onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    // Add network listener
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status)
      networkStatus.value = status
    })

    // Get initial network status
    await getNetworkStatus()
  }
})
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
