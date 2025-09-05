<template>
  <div class="plugin-section">
    <h2>@capacitor/splash-screen</h2>
    <div class="plugin-content">
      <p><strong>Splash Screen Test:</strong></p>
      <div class="form-group">
        <label for="showDuration">Show Duration (ms):</label>
        <input id="showDuration" v-model.number="showDuration" type="number" class="form-control" min="1000" max="10000" />
      </div>
      <button class="button primary" @click="showSplashScreen">Show Splash Screen</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

// Reactive data
const showDuration = ref(3000)

// Splash Screen Plugin
const showSplashScreen = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await SplashScreen.show({
        showDuration: showDuration.value,
        autoHide: true
      })
      console.log('Splash screen shown')
    } else {
      alert('Splash screen only available on native platforms')
    }
  } catch (error) {
    console.error('Error showing splash screen:', error)
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
