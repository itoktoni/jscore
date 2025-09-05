<template>
  <div class="plugin-section">
    <h2>@capacitor/camera</h2>
    <div class="plugin-content">
      <p><strong>Camera Test:</strong></p>
      <div v-if="photo">
        <img :src="photo" alt="Captured photo" style="max-width: 300px; max-height: 300px;" />
      </div>
      <div v-else>
        <p>No photo captured yet</p>
      </div>
      <div v-if="Capacitor.isNativePlatform()">
        <button class="button primary" @click="takePicture">Take Picture</button>
      </div>
      <div v-else>
        <p>Camera functionality is only available on mobile devices.</p>
        <button class="button primary" @click="simulatePicture" disabled>Take Picture (Web - Disabled)</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType } from '@capacitor/camera'

// Reactive data
const photo = ref(null)

// Camera Plugin
const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })
    photo.value = image.webPath
    console.log('Picture taken:', image)
  } catch (error) {
    console.error('Error taking picture:', error)
    photo.value = null
  }
}

// For web simulation only
const simulatePicture = () => {
  photo.value = 'https://via.placeholder.com/300x300?text=Simulated+Photo'
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
</style>