<template>
  <div class="safe-area-padded">
    <h1>Safe Area Test</h1>
    <div class="card">
      <div class="card-body">
        <p><strong>Platform:</strong> {{ platform }}</p>
        <p><strong>Is Mobile:</strong> {{ isMobile }}</p>
        <p><strong>Is Native:</strong> {{ isNative }}</p>
        <div v-if="isMobile" class="safe-area-content">
          <p>This content has safe area padding (mobile only) with additional padding from --safe-area-padding variable (default: 1.5rem)</p>
          <div class="card">
            <div class="card-body">
              <p><strong>Safe Area Insets:</strong></p>
              <ul>
                <li>Top: {{ safeAreaInsets.top }}px</li>
                <li>Right: {{ safeAreaInsets.right }}px</li>
                <li>Bottom: {{ safeAreaInsets.bottom }}px</li>
                <li>Left: {{ safeAreaInsets.left }}px</li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="safe-area-content">
          <p>This content has no safe area padding (web) but still has additional padding from --safe-area-padding variable (default: 1.5rem)</p>
        </div>
        <div class="button-group">
          <Button
            button-type="button"
            variant="primary"
            size="medium"
            @click="updateSafeArea"
            text="Update Safe Area"
          />
          <Button
            button-type="button"
            variant="secondary"
            size="medium"
            @click="checkPlatform"
            text="Check Platform"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { useSafeArea } from '../composables/useSafeArea'
import Button from './Button.vue'

const platform = ref(Capacitor.getPlatform())
const isMobile = ref(platform.value === 'ios' || platform.value === 'android')
const isNative = ref(Capacitor.isNativePlatform())

const { safeAreaInsets, updateSafeArea, isMobilePlatform } = useSafeArea()

const checkPlatform = () => {
  platform.value = Capacitor.getPlatform()
  isMobile.value = isMobilePlatform()
  isNative.value = Capacitor.isNativePlatform()
  console.log('Platform check:', { platform: platform.value, isMobile: isMobile.value, isNative: isNative.value })
}

onMounted(() => {
  console.log('Safe Area Test Component Mounted')
  console.log('Platform:', platform.value)
  console.log('Is Mobile Platform:', isMobilePlatform())
  console.log('Is Native Platform:', Capacitor.isNativePlatform())

  // Update safe area after a small delay to ensure DOM is ready
  setTimeout(() => {
    updateSafeArea()
  }, 100)
})
</script>

<style scoped>
.card {
  margin: 1rem 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
}
</style>