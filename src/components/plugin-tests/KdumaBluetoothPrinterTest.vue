<template>
  <div class="plugin-section">
    <h2>Kduma Bluetooth Printer</h2>
    <div class="plugin-content">
      <p><strong>Bluetooth Printer Test (@kduma-autoid/capacitor-bluetooth-printer):</strong></p>

      <!-- Device Selection -->
      <div class="form-group">
        <label for="selectedDevice">Select Device:</label>
        <select id="selectedDevice" v-model="selectedDevice" class="form-control">
          <option value="">Select a device</option>
          <option v-for="device in devices" :key="device.address" :value="device.address">
            {{ device.name }} ({{ device.address }})
          </option>
        </select>
        <button class="button secondary" @click="scanDevices">Scan Devices</button>
      </div>

      <!-- Print Content -->
      <div class="form-group">
        <label for="printContent">Content to Print:</label>
        <textarea id="printContent" v-model="printContent" class="form-control" rows="5" placeholder="Enter text to print"></textarea>
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
        <button class="button primary" @click="connectPrinter" :disabled="!selectedDevice">Connect</button>
        <button class="button primary" @click="printText" :disabled="!selectedDevice">Print Text</button>
        <button class="button primary" @click="connectAndPrint" :disabled="!selectedDevice">Connect & Print</button>
        <button class="button secondary" @click="disconnectPrinter">Disconnect</button>
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

// Use dynamic import for the plugin
let BluetoothPrinter

// Try to import the plugin dynamically
const loadBluetoothPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const module = await import('@kduma-autoid/capacitor-bluetooth-printer')
      BluetoothPrinter = module.BluetoothPrinter
    }
  } catch (error) {
    console.warn('Kduma Bluetooth Printer plugin not available:', error)
  }
}

// Load the plugin when the component is mounted
loadBluetoothPrinter()

// Reactive data
const devices = ref([])
const selectedDevice = ref('')
const printContent = ref('Hello from Kduma Capacitor Bluetooth Printer!\nThis is a test print.')
const printerResult = ref('')
const printerError = ref('')

// Bluetooth Printer Plugin
const scanDevices = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter) {
      printerError.value = ''
      const result = await BluetoothPrinter.list()
      devices.value = result.devices || []
      printerResult.value = `Found ${devices.value.length} devices`
      console.log('Devices found:', result)
    } else {
      printerError.value = 'Bluetooth printer only available on native platforms'
    }
  } catch (error) {
    console.error('Error scanning devices:', error)
    printerError.value = error.message || 'Failed to scan devices'
  }
}

const connectPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''
      await BluetoothPrinter.connect({ address: selectedDevice.value })
      printerResult.value = `Connected to device: ${selectedDevice.value}`
      console.log('Connected to printer')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error connecting to printer:', error)
    printerError.value = error.message || 'Failed to connect to printer'
  }
}

const disconnectPrinter = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter) {
      printerError.value = ''
      await BluetoothPrinter.disconnect()
      printerResult.value = 'Disconnected from printer'
      console.log('Disconnected from printer')
    } else {
      printerError.value = 'Bluetooth printer only available on native platforms'
    }
  } catch (error) {
    console.error('Error disconnecting from printer:', error)
    printerError.value = error.message || 'Failed to disconnect from printer'
  }
}

const printText = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''
      await BluetoothPrinter.print({ data: printContent.value })
      printerResult.value = 'Text printed successfully'
      console.log('Text printed')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error printing text:', error)
    printerError.value = error.message || 'Failed to print text'
  }
}

const connectAndPrint = async () => {
  try {
    if (Capacitor.isNativePlatform() && BluetoothPrinter && selectedDevice.value) {
      printerError.value = ''
      await BluetoothPrinter.connectAndPrint({
        address: selectedDevice.value,
        data: printContent.value
      })
      printerResult.value = 'Connected and printed successfully'
      console.log('Connected and printed')
    } else {
      printerError.value = 'Please select a device first or ensure you are on a mobile device'
    }
  } catch (error) {
    console.error('Error connecting and printing:', error)
    printerError.value = error.message || 'Failed to connect and print'
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
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.secondary {
  background-color: #6c757d;
  color: white;
}
</style>