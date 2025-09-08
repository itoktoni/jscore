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
  console.log('Settings loaded:', {
    websiteName: settingsStore.websiteName,
    websiteUrl: settingsStore.websiteUrl,
    darkMode: settingsStore.darkMode
  });

  // Apply dark mode settings
  settingsStore.applyDarkMode()
  console.log('Dark mode applied. Document has dark class:', document.documentElement.classList.contains('dark'));

  // Update HTTP service baseURL after settings are loaded
  http.updateBaseURL()

  // Initialize auth store after settings are loaded
  const authStore = useAuthStore()
  authStore.initAuth().then((result) => {
    console.log('Auth initialized:', result)
  }).catch((error) => {
    console.error('Error initializing auth:', error)
  })
})

// Initialize safe area only on mobile platforms
const platform = Capacitor.getPlatform()
console.log('Capacitor platform:', platform)

const root = document.documentElement

if (platform === 'ios' || platform === 'android') {
  console.log('Initializing safe area for mobile platform')
  safeAreaUtil.initialize().then(() => {
    console.log('Safe area initialized successfully')
  }).catch((error) => {
    console.error('Error initializing safe area:', error)
  })
} else {
  console.log('Not a mobile platform, applying CSS fallback')
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
  console.error('Global error:', error, info)
  // Show alert for global errors
  const { alertError } = useAlert()
  alertError('Error', error.message || 'An unexpected error occurred')
}