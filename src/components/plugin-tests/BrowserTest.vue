<template>
  <div class="plugin-section">
    <h2>Browser</h2>
    <div class="plugin-content">
      <p><strong>Open URLs in Browser:</strong></p>
      <div class="form-group">
        <label for="url">URL:</label>
        <input id="url" v-model="url" type="url" class="form-control" placeholder="https://example.com" />
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="openInApp" />
          Open in In-App Browser (if available)
        </label>
      </div>
      <div v-if="browserResult">
        <p><strong>Result:</strong> {{ browserResult }}</p>
      </div>
      <div v-if="browserError">
        <p><strong>Error:</strong> {{ browserError }}</p>
      </div>
      <button class="button primary" @click="openUrl">Open URL</button>
      <button class="button secondary" @click="closeBrowser" v-if="openInApp">Close Browser</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'

// Use dynamic import for the plugin
let Browser

// Try to import the plugin dynamically
const loadBrowserPlugin = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const module = await import('@capacitor/browser')
      Browser = module.Browser
    }
  } catch (error) {
    console.warn('Browser plugin not available:', error)
  }
}

// Load the plugin when the component is mounted
onMounted(() => {
  loadBrowserPlugin()
})

// Reactive data
const url = ref('https://capacitorjs.com')
const openInApp = ref(true)
const browserResult = ref('')
const browserError = ref('')

// Browser Plugin
const openUrl = async () => {
  try {
    if (Capacitor.isNativePlatform() && Browser) {
      browserError.value = ''
      if (openInApp.value) {
        await Browser.open({ url: url.value })
        browserResult.value = 'Browser opened in-app'
      } else {
        // For external browser, we would typically use window.open
        window.open(url.value, '_blank')
        browserResult.value = 'Browser opened externally'
      }
      console.log('Browser opened:', url.value)
    } else {
      // Fallback for web
      window.open(url.value, '_blank')
      browserResult.value = 'Browser opened externally (web fallback)'
    }
  } catch (error) {
    console.error('Error opening browser:', error)
    browserError.value = error.message
  }
}

const closeBrowser = async () => {
  try {
    if (Capacitor.isNativePlatform() && Browser) {
      browserError.value = ''
      await Browser.close()
      browserResult.value = 'Browser closed'
      console.log('Browser closed')
    } else {
      browserError.value = 'In-app browser only available on native platforms'
    }
  } catch (error) {
    console.error('Error closing browser:', error)
    browserError.value = error.message
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

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
