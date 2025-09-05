<template>
  <div v-if="isMobile" class="network-status" :class="statusClass">
    <div class="status-indicator">
      <span class="status-dot" :class="statusClass"></span>
      <span class="status-text">{{ statusMessage }}</span>
    </div>

    <button v-if="!isOnline" @click="retryConnection" class="retry-btn" :disabled="retrying">
      {{ retrying ? 'Retrying...' : 'Retry' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'
import { apiService } from '../stores/api'

const isOnline = ref(true)
const connectionType = ref('unknown')
const showStatus = ref(true) // Always show the monitor
const retrying = ref(false)
const isMobile = ref(false)
let networkListener = null

// Check if we're on a mobile platform
isMobile.value = Capacitor.isNativePlatform()

const statusClass = computed(() => {
  return isOnline.value ? 'online' : 'offline'
})

const statusMessage = computed(() => {
  if (!isOnline.value) {
    return 'No internet'
  }
  if (connectionType.value === 'cellular') {
    return 'via cellular'
  }
  if (connectionType.value === 'wifi') {
    return 'via WiFi'
  }
  return 'Connected'
})

const checkNetworkStatus = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await Network.getStatus()
      isOnline.value = status.connected
      connectionType.value = status.connectionType

      console.log('[Network Monitor] Status:', {
        connected: status.connected,
        connectionType: status.connectionType
      })
    } else {
      // For web platform, use navigator.onLine
      isOnline.value = navigator.onLine
      connectionType.value = 'unknown'
    }

    // Always show status
    showStatus.value = true

  } catch (error) {
    console.error('[Network Monitor] Error checking status:', error)
    isOnline.value = navigator.onLine
    showStatus.value = true
  }
}

const retryConnection = async () => {
  retrying.value = true

  try {
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check network status
    await checkNetworkStatus()

    // Test API connectivity
    const result = await apiService.testConnection()

    if (result.success) {
      console.log('[Network Monitor] Connection restored')
    } else {
      console.log('[Network Monitor] API still unreachable:', result.error)
    }

  } catch (error) {
    console.error('[Network Monitor] Retry failed:', error)
  } finally {
    retrying.value = false
  }
}

const setupNetworkListener = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      networkListener = await Network.addListener('networkStatusChange', (status) => {
        console.log('[Network Monitor] Status changed:', status)
        isOnline.value = status.connected
        connectionType.value = status.connectionType

        // Always show status when connection changes
        showStatus.value = true
      })
    } catch (error) {
      console.error('[Network Monitor] Failed to setup listener:', error)
    }
  } else {
    // For web platform, listen to online/offline events
    const handleOnline = () => {
      isOnline.value = true
      showStatus.value = true
    }

    const handleOffline = () => {
      isOnline.value = false
      showStatus.value = true
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Store cleanup function
    networkListener = () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }
}

onMounted(async () => {
  await checkNetworkStatus()
  await setupNetworkListener()
})

onUnmounted(() => {
  if (networkListener) {
    if (typeof networkListener === 'function') {
      networkListener() // Web cleanup
    } else {
      networkListener.remove() // Capacitor cleanup
    }
  }
})
</script>

<style scoped>
.network-status {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  min-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.network-status.online {
  background-color: var(--primary-color);
  color: white;
}

.network-status.offline {
  background-color: #dc3545;
  color: white;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background-color: #ffffff;
}

.status-dot.offline {
  background-color: #ffffff;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.retry-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>