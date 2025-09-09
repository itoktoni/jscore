import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { useAlert } from './composables/useAlert'

// Import CSS files
import App from './App.vue'
import router from './router'

// Import safe area utility
import safeAreaUtil from './utils/safeArea'

// Import settings store
import { useSettingsStore } from './stores/settings'
import { http } from './stores/http'
import { useAuthStore } from './stores/auth'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Initialize settings
const settingsStore = useSettingsStore()
settingsStore.loadSettings().then(() => {

  // Apply dark mode settings
  settingsStore.applyDarkMode()

  // Update HTTP service baseURL after settings are loaded
  http.updateBaseURL()

  // Initialize auth store after settings are loaded
  const authStore = useAuthStore()
  authStore.initAuth().then((result) => {
  }).catch((error) => {
  })
})

// Initialize safe area only on mobile platforms
const platform = Capacitor.getPlatform()

const root = document.documentElement

if (platform === 'ios' || platform === 'android') {
  safeAreaUtil.initialize().then(() => {
  }).catch((error) => {
  })
} else {
  safeAreaUtil.applyWebSafeArea()
}

// Mount the app
app.mount('#app')

// Capacitor-specific initialization
if (Capacitor.isNativePlatform()) {
  // Hide splash screen when app is ready
  SplashScreen.hide()
}

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  // Show alert for global errors
  const { alertError } = useAlert()
  alertError('Error', error.message || 'An unexpected error occurred')
}