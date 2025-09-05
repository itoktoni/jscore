<template>
  <div class="plugin-section">
    <h2>InAppBrowser</h2>
    <div class="plugin-content">
      <p><strong>Open URLs in different browsers:</strong></p>

      <div class="form-group">
        <label for="url">URL:</label>
        <input id="url" v-model="url" type="url" class="form-control" placeholder="https://example.com" />
      </div>

      <div v-if="browserResult">
        <p><strong>Result:</strong> {{ browserResult }}</p>
      </div>
      <div v-if="browserError">
        <p><strong>Error:</strong> {{ browserError }}</p>
      </div>

      <div v-if="Capacitor.isNativePlatform()">
        <button class="button primary" @click="openInWebView">Open in Web View</button>
        <button class="button secondary" @click="openInSystemBrowser">Open in System Browser</button>
        <button class="button secondary" @click="openInExternalBrowser">Open in External Browser</button>
        <button class="button secondary" @click="closeBrowser" :disabled="!isBrowserOpen">Close Browser</button>
      </div>
      <div v-else>
        <p>InAppBrowser functionality is only available on mobile devices.</p>
        <button class="button primary" @click="simulateOpen" disabled>Open Browser (Web - Disabled)</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Capacitor } from '@capacitor/core'

// Use dynamic import for the plugin
let InAppBrowser
let DefaultWebViewOptions
let DefaultSystemBrowserOptions

// Try to import the plugin dynamically
const loadInAppBrowserPlugin = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const module = await import('@capacitor/inappbrowser')
      InAppBrowser = module.InAppBrowser
      DefaultWebViewOptions = module.DefaultWebViewOptions
      DefaultSystemBrowserOptions = module.DefaultSystemBrowserOptions
    }
  } catch (error) {
    console.warn('InAppBrowser plugin not available:', error)
  }
}

// Load the plugin when the component is mounted
onMounted(() => {
  loadInAppBrowserPlugin()

  // Add listeners
  if (InAppBrowser) {
    InAppBrowser.addListener('browserClosed', () => {
      console.log("browser was closed.")
      browserResult.value = "Browser was closed"
      isBrowserOpen.value = false
    })

    InAppBrowser.addListener('browserPageNavigationCompleted', (data) => {
      console.log("browser page navigation was completed. " + data.url)
      browserResult.value = "Page navigation completed: " + data.url
    })

    InAppBrowser.addListener('browserPageLoaded', () => {
      console.log("browser was loaded.")
      browserResult.value = "Browser page loaded"
    })
  }
})

// Clean up listeners
onUnmounted(() => {
  if (InAppBrowser) {
    InAppBrowser.removeAllListeners()
  }
})

// Reactive data
const url = ref('https://capacitorjs.com')
const browserResult = ref('')
const browserError = ref('')
const isBrowserOpen = ref(false)

// InAppBrowser Plugin Methods
const openInWebView = async () => {
  try {
    if (Capacitor.isNativePlatform() && InAppBrowser) {
      browserError.value = ''
      await InAppBrowser.openInWebView({
        url: url.value,
        options: DefaultWebViewOptions
      })
      browserResult.value = 'Opened in Web View'
      isBrowserOpen.value = true
      console.log('Opened in Web View:', url.value)
    } else {
      browserError.value = 'InAppBrowser only available on native platforms'
    }
  } catch (error) {
    console.error('Error opening in Web View:', error)
    browserError.value = error.message
  }
}

const openInSystemBrowser = async () => {
  try {
    if (Capacitor.isNativePlatform() && InAppBrowser) {
      browserError.value = ''
      await InAppBrowser.openInSystemBrowser({
        url: url.value,
        options: DefaultSystemBrowserOptions
      })
      browserResult.value = 'Opened in System Browser'
      isBrowserOpen.value = true
      console.log('Opened in System Browser:', url.value)
    } else {
      browserError.value = 'InAppBrowser only available on native platforms'
    }
  } catch (error) {
    console.error('Error opening in System Browser:', error)
    browserError.value = error.message
  }
}

const openInExternalBrowser = async () => {
  try {
    if (Capacitor.isNativePlatform() && InAppBrowser) {
      browserError.value = ''
      await InAppBrowser.openInExternalBrowser({
        url: url.value
      })
      browserResult.value = 'Opened in External Browser'
      console.log('Opened in External Browser:', url.value)
    } else {
      browserError.value = 'InAppBrowser only available on native platforms'
    }
  } catch (error) {
    console.error('Error opening in External Browser:', error)
    browserError.value = error.message
  }
}

const closeBrowser = async () => {
  try {
    if (Capacitor.isNativePlatform() && InAppBrowser) {
      browserError.value = ''
      await InAppBrowser.close()
      browserResult.value = 'Browser closed'
      isBrowserOpen.value = false
      console.log('Browser closed')
    } else {
      browserError.value = 'InAppBrowser only available on native platforms'
    }
  } catch (error) {
    console.error('Error closing browser:', error)
    browserError.value = error.message
  }
}

// For web simulation only
const simulateOpen = () => {
  browserResult.value = 'SIMULATED: Browser would open'
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

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>