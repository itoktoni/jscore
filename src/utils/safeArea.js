import { SafeArea, SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area'
import { Capacitor } from '@capacitor/core'

/**
 * Simple Safe Area Utility
 * Handles safe area insets for mobile devices
 */
class SafeAreaUtil {
  constructor() {
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // Check if we're on a mobile platform (iOS or Android)
      if (this.isMobilePlatform()) {
        this.applyMobileSafeArea()
      } else {
        this.applyWebSafeArea()
      }

      this.isInitialized = true
    } catch (error) {
      console.warn('SafeAreaUtil initialization error:', error)
      this.applyWebSafeArea()
    }
  }

  isMobilePlatform() {
    // Check if we're on a mobile platform (iOS or Android)
    const platform = Capacitor.getPlatform()
    return platform === 'ios' || platform === 'android'
  }

  applyMobileSafeArea() {
    // Apply 3rem top padding for mobile devices
    const root = document.documentElement
    root.style.setProperty('--safe-area-top', '4rem')
    root.style.setProperty('--safe-area-drawer', '5rem')
    root.style.setProperty('--safe-area-bottom', '9.5rem')
    root.style.setProperty('--safe-area-left', '2rem')
    root.style.setProperty('--safe-area-right', '2rem')
  }

  applyWebSafeArea() {
    // Apply 0px padding for web browsers
    const root = document.documentElement
    root.style.setProperty('--safe-area-top', '0px')
    root.style.setProperty('--safe-area-left', '2rem')
    root.style.setProperty('--safe-area-right', '1rem')
    root.style.setProperty('--safe-area-bottom', '1rem')
  }

  // Get current safe area insets (simple implementation)
  getInsets() {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }
}

// Create a singleton instance
const safeAreaUtil = new SafeAreaUtil()

export default safeAreaUtil