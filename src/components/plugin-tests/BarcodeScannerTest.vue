<template>
  <div class="plugin-section">
    <h2>Barcode Scanner</h2>
    <div class="plugin-content">
      <p><strong>Scan Barcodes:</strong></p>

      <div v-if="pluginError">
        <p><strong>Error loading plugin:</strong> {{ pluginError }}</p>
      </div>

      <div v-else-if="scanResult">
        <p><strong>Scan Result:</strong> {{ scanResult }}</p>
      </div>

      <div v-else-if="scanError">
        <p><strong>Error:</strong> {{ scanError }}</p>
      </div>

      <div v-if="Capacitor.isNativePlatform() && !pluginError">
        <button class="button primary" @click="scanBarcode">Scan Barcode</button>
        <button class="button secondary" @click="stopScan" v-if="isScanning">Stop Scan</button>
      </div>

      <div v-else-if="!pluginError">
        <p>Barcode scanner functionality is only available on mobile devices.</p>
        <button class="button primary" @click="simulateScan" disabled>Scan Barcode (Web - Disabled)</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'

// Use dynamic import for the plugin
let BarcodeScanner

// Try to import the plugin dynamically
const loadBarcodeScannerPlugin = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const module = await import('@capacitor-community/barcode-scanner')
      BarcodeScanner = module.BarcodeScanner
    }
  } catch (error) {
    console.warn('Barcode Scanner plugin not available:', error)
    pluginError.value = 'Barcode Scanner plugin not available'
  }
}

// Load the plugin immediately
loadBarcodeScannerPlugin()

// Reactive data
const pluginError = ref(null)
const scanResult = ref('')
const scanError = ref('')
const isScanning = ref(false)

// Check permission
const checkPermission = async () => {
  try {
    const status = await BarcodeScanner.checkPermission({ force: true })
    return status.granted
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

// Barcode Scanner Plugin
const scanBarcode = async () => {
  try {
    if (Capacitor.isNativePlatform() && BarcodeScanner) {
      // Check permission
      const hasPermission = await checkPermission()
      if (!hasPermission) {
        scanError.value = 'Camera permission not granted'
        return
      }

      // Make background of WebView transparent
      BarcodeScanner.hideBackground()
      document.querySelector('body').style.backgroundColor = 'transparent'

      isScanning.value = true
      scanError.value = ''

      // Start scanning
      const result = await BarcodeScanner.startScan()

      // If the result has data, a barcode was found
      if (result.hasContent) {
        scanResult.value = result.content
        console.log('Scan result:', result.content)
      } else {
        scanResult.value = 'No content found'
      }

      // Stop the scan after a barcode is found or cancelled
      stopScan()
    } else {
      scanError.value = 'Barcode scanner only available on native platforms'
    }
  } catch (error) {
    console.error('Error scanning barcode:', error)
    scanError.value = error.message || 'Failed to scan barcode'
    stopScan()
  }
}

const stopScan = async () => {
  try {
    if (BarcodeScanner) {
      BarcodeScanner.showBackground()
      document.querySelector('body').style.backgroundColor = ''
      await BarcodeScanner.stopScan()
    }
  } catch (error) {
    console.error('Error stopping scan:', error)
  }
  isScanning.value = false
}

// For web simulation only
const simulateScan = () => {
  scanResult.value = 'SIMULATED-QR-CODE-12345'
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