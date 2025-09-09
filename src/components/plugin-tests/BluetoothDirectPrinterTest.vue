<template>
  <div class="plugin-section">
    <h2>Bluetooth Direct Printer</h2>
    <div class="plugin-content">
      <p><strong>Bluetooth Direct Printer Test (Based on Medium Article):</strong></p>

      <!-- Action Buttons -->
      <div class="form-group">
        <button class="button primary" @click="listDevices">List Connected Devices</button>
      </div>

      <!-- Device List -->
      <div v-if="devices.length > 0" class="form-group">
        <h3>Available Devices:</h3>
        <div v-for="device in devices" :key="device.address" class="device-item">
          <button class="button secondary" @click="printReceipt(device)">
            Print on {{ device.name }}
          </button>
        </div>
      </div>

      <!-- Connected Printer -->
      <div class="form-group">
        <p><strong>Connected:</strong> {{ connectedPrinter?.name || 'None' }}</p>
      </div>

      <!-- Content to Print -->
      <div ref="content" id="content" class="print-content">
        <h1>Hello World</h1>
        <p>This is a sample receipt printed using the Bluetooth Direct Printer plugin.</p>
        <p>Date: {{ currentDate }}</p>
      </div>

      <!-- Results -->
      <div v-if="printerResult">
        <p><strong>Result:</strong> {{ printerResult }}</p>
      </div>
      <div v-if="printerError">
        <p><strong>Error:</strong> {{ printerError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import { LidtaCapacitorBlPrinter } from 'lidta-capacitor-bl-printer'
import { Capacitor } from '@capacitor/core'

// Reactive data
const devices = ref([])
const connectedPrinter = ref({})
const content = ref(null)
const printerResult = ref('')
const printerError = ref('')
const currentDate = ref(new Date().toLocaleDateString())

// List paired Bluetooth devices
const listDevices = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      printerError.value = ''
      const result = await LidtaCapacitorBlPrinter.getPairedDevices()
      devices.value = result.devices || []
      printerResult.value = `Found ${devices.value.length} devices`
    } else {
      printerError.value = 'Bluetooth printer functionality is only available on mobile devices.'
    }
  } catch (error) {
    console.error('Error listing devices:', error)
    printerError.value = error.message || 'Failed to list devices'
  }
}

// Print receipt on selected device
const printReceipt = async (device) => {
  try {
    if (!Capacitor.isNativePlatform()) {
      printerError.value = 'Bluetooth printer functionality is only available on mobile devices.'
      return
    }

    printerError.value = ''

    // Connect to the printer
    await LidtaCapacitorBlPrinter.connect({ address: device.address })
    connectedPrinter.value = device

    // Convert content to canvas and then to base64 image
    const canvas = await html2canvas(content.value)
    const base64Image = canvas.toDataURL('image/png')

    // Print the base64 image
    await LidtaCapacitorBlPrinter.printBase64({
      msg: base64Image,
      align: 1 // 0=>left, 1=>center, 2=>right
    })

    // Disconnect from the printer
    await LidtaCapacitorBlPrinter.disconnect()

    printerResult.value = `Successfully printed on ${device.name}`
  } catch (error) {
    console.error('Error printing receipt:', error)
    printerError.value = error.message || 'Failed to print receipt'
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

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.secondary {
  background-color: #6c757d;
  color: white;
}

.device-item {
  margin: 0.5rem 0;
}

.print-content {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px dashed #ccc;
  background-color: #f9f9f9;
}
</style>