<template>
  <div class="plugin-section">
    <h2>Geolocation</h2>
    <div class="plugin-content">
      <p><strong>Current Location:</strong></p>
      <div v-if="location">
        <p>Latitude: {{ location.latitude }}</p>
        <p>Longitude: {{ location.longitude }}</p>
        <p>Accuracy: {{ location.accuracy }} meters</p>
        <p v-if="location.timestamp">Timestamp: {{ new Date(location.timestamp).toLocaleString() }}</p>
      </div>
      <div v-if="locationError">
        <p><strong>Error:</strong> {{ locationError }}</p>
      </div>
      <button class="button primary" @click="getCurrentPosition">Get Current Position</button>
      <button class="button secondary" @click="watchPosition" :disabled="isWatching">Watch Position</button>
      <button class="button secondary" @click="clearWatch" :disabled="!isWatching">Stop Watching</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'

// Use dynamic import for the plugin
let Geolocation

// Try to import the plugin dynamically
const loadGeolocationPlugin = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const module = await import('@capacitor/geolocation')
      Geolocation = module.Geolocation
    }
  } catch (error) {
    console.warn('Geolocation plugin not available:', error)
  }
}

// Load the plugin when the component is mounted
onMounted(() => {
  loadGeolocationPlugin()
})

// Reactive data
const location = ref(null)
const locationError = ref('')
const isWatching = ref(false)
const watchId = ref(null)

// Geolocation Plugin
const getCurrentPosition = async () => {
  try {
    if (Capacitor.isNativePlatform() && Geolocation) {
      locationError.value = ''
      const coordinates = await Geolocation.getCurrentPosition()
      location.value = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        timestamp: coordinates.timestamp
      }
      console.log('Current position:', coordinates)
    } else {
      locationError.value = 'Geolocation only available on native platforms'
    }
  } catch (error) {
    console.error('Error getting current position:', error)
    locationError.value = error.message
    location.value = null
  }
}

const watchPosition = async () => {
  try {
    if (Capacitor.isNativePlatform() && Geolocation) {
      isWatching.value = true
      locationError.value = ''

      watchId.value = Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }, (position, err) => {
        if (err) {
          console.error('Error watching position:', err)
          locationError.value = err.message
          return
        }

        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }
        console.log('Position updated:', position)
      })
    } else {
      locationError.value = 'Geolocation only available on native platforms'
    }
  } catch (error) {
    console.error('Error watching position:', error)
    locationError.value = error.message
    isWatching.value = false
  }
}

const clearWatch = async () => {
  if (Capacitor.isNativePlatform() && Geolocation && watchId.value) {
    Geolocation.clearWatch({ id: watchId.value })
    watchId.value = null
  }
  isWatching.value = false
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

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
