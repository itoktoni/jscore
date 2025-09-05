<template>
  <div id="app">
    <!-- Check if user is on login/register page -->
    <div v-if="isAuthPage">
      <router-view />
    </div>

    <!-- Main Layout for authenticated pages -->
    <MainLayout v-else />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useAlert } from './composables/useAlert'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import MainLayout from './components/MainLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { alertConfirm } = useAlert()

// Check if current route is an auth page (login/register)
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/register']
  return authRoutes.includes(route.path)
})

// Track if we're on the main page (home/dashboard)
const isMainPage = computed(() => {
  // Adjust this based on your actual main page route
  return route.path === '/' || route.path === '/dashboard' || route.path === '/profile'
})

// Track back button press for exit confirmation
const backButtonPressCount = ref(0)
let backButtonPressTimer = null

// Handle Android back button
const handleBackButton = async () => {
  // If we're on the main page or auth page, show exit confirmation
  if (isMainPage.value || isAuthPage.value) {
    // First press - show confirmation
    if (backButtonPressCount.value === 0) {
      backButtonPressCount.value = 1

      const result = await alertConfirm(
        'Confirm Exit',
        'Press back again to exit the application'
      )

      // Set a timer to reset the counter after 2 seconds
      backButtonPressTimer = setTimeout(() => {
        backButtonPressCount.value = 0
      }, 2000)

      if (result.isConfirmed) {
        // User confirmed exit
        CapacitorApp.exitApp()
      } else {
        // Reset counter if user cancels
        backButtonPressCount.value = 0
        if (backButtonPressTimer) {
          clearTimeout(backButtonPressTimer)
        }
      }
    } else {
      // Second press within time window - exit app
      CapacitorApp.exitApp()
    }
  } else {
    // Not on main page, use normal back navigation
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      // Fallback to main page if no history
      router.push('/dashboard')
    }
  }
}

// Initialize auth when app starts
onMounted(async () => {
  await authStore.initAuth()

  // Add back button listener for Android
  if (Capacitor.getPlatform() === 'android') {
    CapacitorApp.addListener('backButton', handleBackButton)
  }
})

// Clean up listeners
onUnmounted(() => {
  if (Capacitor.getPlatform() === 'android') {
    CapacitorApp.removeAllListeners()
  }

  // Clear any pending timers
  if (backButtonPressTimer) {
    clearTimeout(backButtonPressTimer)
  }
})
</script>