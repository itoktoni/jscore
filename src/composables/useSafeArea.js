import { ref, onMounted, onUnmounted } from 'vue'
import safeAreaUtil from '../utils/safeArea'
import { Capacitor } from '@capacitor/core'

/**
 * Simple Safe Area Composable
 * Provides basic safe area functionality for components
 */
export function useSafeArea() {
  const safeAreaInsets = ref({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  const isMobilePlatform = () => {
    // Check if we're on a mobile platform (iOS or Android)
    const platform = Capacitor.getPlatform()
    return platform === 'ios' || platform === 'android'
  }

  const updateSafeArea = async () => {
    try {
      if (isMobilePlatform()) {
        // For mobile, use 3rem top padding
        safeAreaInsets.value = { top: 48, right: 0, bottom: 0, left: 0 } // 3rem = 48px
      } else {
        // For web, use 0 padding
        safeAreaInsets.value = { top: 0, right: 0, bottom: 0, left: 0 }
      }
    } catch (error) {
      console.warn('Error getting safe area insets:', error)
      // Fallback values
      safeAreaInsets.value = { top: 0, right: 0, bottom: 0, left: 0 }
    }
  }

  return {
    safeAreaInsets,
    updateSafeArea,
    isMobilePlatform
  }
}