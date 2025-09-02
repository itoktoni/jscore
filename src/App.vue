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

<style>
/* Import local Chota CSS framework */
@import url('./assets/css/chota.css');

/* Global Styles - Minimal overrides for Chota CSS */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

#app {
  min-height: 100vh;
  -webkit-overflow-scrolling: touch;
}

/* Prevent zoom on form inputs in iOS Safari */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="search"],
textarea,
select {
  font-size: 16px;
}

/* Improve focus visibility */
:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  button,
  input[type="button"],
  input[type="submit"],
  input[type="reset"],
  .clickable {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>