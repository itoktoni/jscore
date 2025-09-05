<template>
  <div class="plugin-section">
    <h2>Bluetooth Printer</h2>
    <div class="plugin-content">
      <p><strong>Bluetooth Printer Test:</strong></p>

      <!-- Device Selection -->
      <div class="form-group">
        <label for="selectedDevice">Select Device:</label>
        <select id="selectedDevice" v-model="selectedDevice" class="form-control">
          <option value="">Select a device</option>
          <option v-for="device in devices" :key="device.address" :value="device.address">
            {{ device.name }} ({{ device.address }})
          </option>
        </select>
        <Button label="Scan Devices" @click="scanDevices" severity="secondary" />
      </div>

      <!-- Print Content -->
      <div class="form-group">
        <label for="printContent">Content to Print:</label>
        <textarea id="printContent" v-model="printContent" class="form-control" rows="5" placeholder="Enter text to print"></textarea>
      </div>

      <!-- Print Options -->
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="printOptions.bold" />
          Bold Text
        </label>
        <label>
          <input type="checkbox" v-model="printOptions.underline" />
          Underline Text
        </label>
        <label>
          <input type="checkbox" v-model="printOptions.alignment" />
          Center Alignment
        </label>
      </div>

      <!-- Results -->
      <div v-if="printerResult">
        <p><strong>Result:</strong> {{ printerResult }}</p>
      </div>
      <div v-if="printerError">
        <p><strong>Error:</strong> {{ printerError }}</p>
      </div>

      <!-- Action Buttons -->
      <div v-if="Capacitor.isNativePlatform()">
        <Button label="Connect" @click="connectPrinter" :disabled="!selectedDevice" />
        <Button label="Print Text" @click="printText" :disabled="!selectedDevice" />
        <Button label="Disconnect" @click="disconnectPrinter" :disabled="!selectedDevice" severity="secondary" />
        <Button label="Print Image" @click="printImage" :disabled="!selectedDevice" severity="secondary" />
      </div>
      <div v-else>
        <p>Bluetooth printer functionality is only available on mobile devices.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
// PrimeVue components are auto-imported

// Use dynamic import for the plugin
let BluetoothPrinter

// Try to import the plugin dynamically
const loadBluetoothPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Note: The plugin has been removed due to conflicts
      printerError.value = 'Bluetooth Printer plugin not available due to dependency conflicts'
    }
  } catch (error) {
    console.warn('Bluetooth Printer plugin not available:', error)
  }
}

// Load the plugin when the component is mounted
loadBluetoothPrinter()

// Reactive data
const devices = ref([])
const selectedDevice = ref('')
const printContent = ref('Hello from Capacitor Bluetooth Printer!\nThis is a test print.')
const printerResult = ref('')
const printerError = ref('Plugin removed due to dependency conflicts')
const printOptions = ref({
  bold: false,
  underline: false,
  alignment: false
})

// Bluetooth Printer Plugin
const scanDevices = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter) {
      printerError.value = ''
      // Use the correct method name: list() instead of scan()
      const result = await BluetoothPrinter.list()
      devices.value = result.devices || []
      printerResult.value = `Found ${devices.value.length} devices`
      console.log('Devices found:', result)
    } else {
      printerError.value = 'Bluetooth printer only available on native platforms'
    }
  } catch (error) {
    console.error('Error scanning devices:', error)
    printerError.value = error.message
  }
}

const connectPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''
      // Use the correct parameter: address instead of deviceId
      await BluetoothPrinter.connect({ address: selectedDevice.value })
      printerResult.value = `Connected to device: ${selectedDevice.value}`
      console.log('Connected to printer')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error connecting to printer:', error)
    printerError.value = error.message
  }
}

const disconnectPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''
      await BluetoothPrinter.disconnect()
      printerResult.value = `Disconnected from device: ${selectedDevice.value}`
      console.log('Disconnected from printer')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error disconnecting from printer:', error)
    printerError.value = error.message
  }
}

const printText = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''

      // Format content based on options
      let content = printContent.value
      if (printOptions.value.bold) {
        content = `**${content}**`
      }
      if (printOptions.value.underline) {
        content = `__${content}__`
      }

      // Use the correct method: print() with data parameter
      await BluetoothPrinter.print({ data: content })
      printerResult.value = 'Text printed successfully'
      console.log('Text printed')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error printing text:', error)
    printerError.value = error.message
  }
}

const printImage = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''

      // For demo purposes, we'll use a base64 encoded simple image
      // In a real app, you would get this from the camera or file system
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

      // Use the correct method: print() with data parameter
      await BluetoothPrinter.print({ data: base64Image })
      printerResult.value = 'Image printed successfully'
      console.log('Image printed')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error printing image:', error)
    printerError.value = error.message
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

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>