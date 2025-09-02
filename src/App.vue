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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import MainLayout from './components/MainLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

// Check if current route is an auth page (login/register)
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/register']
  return authRoutes.includes(route.path)
})

// Initialize auth when app starts
onMounted(async () => {
  await authStore.initAuth()
})
</script>