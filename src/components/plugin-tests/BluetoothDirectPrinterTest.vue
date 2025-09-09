<template>
  <div class="plugin-section">
    <h2>Bluetooth Direct Printer</h2>
    <div class="plugin-content">
      <p><strong>Bluetooth Direct Printer Test (Based on Medium Article):</strong></p>

      <!-- Transaction Data Form -->
      <div class="form-group">
        <h3>Transaction Details</h3>
        <div class="form-row">
          <div class="form-field">
            <label for="storeName">Store Name:</label>
            <input id="storeName" v-model="transactionData.storeName" class="form-control" type="text" />
          </div>
          <div class="form-field">
            <label for="storeAddress">Store Address:</label>
            <input id="storeAddress" v-model="transactionData.storeAddress" class="form-control" type="text" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="transactionId">Transaction ID:</label>
            <input id="transactionId" v-model="transactionData.transactionId" class="form-control" type="text" />
          </div>
          <div class="form-field">
            <label for="transactionDate">Date:</label>
            <input id="transactionDate" v-model="transactionData.transactionDate" class="form-control" type="date" />
          </div>
        </div>
      </div>

      <!-- Items Section -->
      <div class="form-group">
        <h3>Items</h3>
        <div v-for="(item, index) in transactionData.items" :key="index" class="item-row">
          <div class="form-row">
            <div class="form-field">
              <label :for="'itemName' + index">Item Name:</label>
              <input :id="'itemName' + index" v-model="item.name" class="form-control" type="text" />
            </div>
            <div class="form-field">
              <label :for="'itemPrice' + index">Price:</label>
              <input :id="'itemPrice' + index" v-model.number="item.price" class="form-control" type="number" step="0.01" />
            </div>
            <div class="form-field">
              <label :for="'itemQty' + index">Quantity:</label>
              <input :id="'itemQty' + index" v-model.number="item.quantity" class="form-control" type="number" />
            </div>
            <div class="form-field">
              <button class="button danger" @click="removeItem(index)">Remove</button>
            </div>
          </div>
        </div>
        <button class="button secondary" @click="addItem">Add Item</button>
      </div>

      <!-- Discount and Total -->
      <div class="form-group">
        <div class="form-row">
          <div class="form-field">
            <label for="discount">Discount (%):</label>
            <input id="discount" v-model.number="transactionData.discount" class="form-control" type="number" step="0.01" />
          </div>
          <div class="form-field">
            <label for="totalAmount">Total Amount:</label>
            <input id="totalAmount" :value="calculateTotal()" class="form-control" type="text" readonly />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-group">
        <button class="button primary" @click="listDevices">List Connected Devices</button>
        <button class="button secondary" @click="printSampleReceipt">Print Sample Receipt</button>
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
        <div class="receipt-header">
          <!-- Logo image -->
          <img src="../../assets/images/logo.png" alt="Store Logo" class="receipt-logo" />
          <h2>{{ transactionData.storeName || 'Sample Store' }}</h2>
          <p>{{ transactionData.storeAddress || '123 Sample Street, Sample City' }}</p>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-info">
          <p><strong>Transaction ID:</strong> {{ transactionData.transactionId || 'TXN001' }}</p>
          <p><strong>Date:</strong> {{ formatTransactionDate() }}</p>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-items">
          <div class="receipt-item-header">
            <span class="item-name">Item</span>
            <span class="item-qty">Qty</span>
            <span class="item-price">Price</span>
            <span class="item-total">Total</span>
          </div>
          <div v-for="(item, index) in transactionData.items" :key="index" class="receipt-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">{{ item.quantity }}</span>
            <span class="item-price">${{ item.price.toFixed(2) }}</span>
            <span class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${{ calculateSubtotal().toFixed(2) }}</span>
          </div>
          <div class="total-row" v-if="transactionData.discount > 0">
            <span>Discount ({{ transactionData.discount }}%):</span>
            <span>-${{ calculateDiscount().toFixed(2) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>${{ calculateTotal().toFixed(2) }}</span>
          </div>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-footer">
          <p>Thank you for your business!</p>
          <p>Visit us again soon.</p>
        </div>
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

// Transaction data with default values
const transactionData = ref({
  storeName: 'Sample Store',
  storeAddress: '123 Sample Street, Sample City',
  transactionId: 'TXN001',
  transactionDate: new Date().toISOString().split('T')[0],
  discount: 10,
  items: [
    { name: 'Product 1', price: 10.99, quantity: 2 },
    { name: 'Product 2', price: 5.49, quantity: 1 },
    { name: 'Product 3', price: 20.00, quantity: 3 }
  ]
})

// Add a new item to the transaction
const addItem = () => {
  transactionData.value.items.push({ name: '', price: 0, quantity: 1 })
}

// Remove an item from the transaction
const removeItem = (index) => {
  transactionData.value.items.splice(index, 1)
}

// Calculate subtotal (before discount)
const calculateSubtotal = () => {
  return transactionData.value.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
}

// Calculate discount amount
const calculateDiscount = () => {
  const subtotal = calculateSubtotal()
  return subtotal * (transactionData.value.discount / 100)
}

// Calculate total (after discount)
const calculateTotal = () => {
  const subtotal = calculateSubtotal()
  const discount = calculateDiscount()
  return subtotal - discount
}

// Format transaction date for display
const formatTransactionDate = () => {
  const date = new Date(transactionData.value.transactionDate)
  return date.toLocaleDateString()
}

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

// Print a sample receipt with default data
const printSampleReceipt = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      printerError.value = 'Bluetooth printer functionality is only available on mobile devices.'
      return
    }

    // Set default values if none exist
    if (transactionData.value.items.length === 0) {
      transactionData.value.items = [
        { name: 'Sample Item 1', price: 15.99, quantity: 1 },
        { name: 'Sample Item 2', price: 25.50, quantity: 2 }
      ]
    }

    // Find first available device
    if (devices.value.length === 0) {
      await listDevices()
    }

    if (devices.value.length > 0) {
      await printReceipt(devices.value[0])
    } else {
      printerError.value = 'No Bluetooth devices found. Please pair a printer first.'
    }
  } catch (error) {
    console.error('Error printing sample receipt:', error)
    printerError.value = error.message || 'Failed to print sample receipt'
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
    const canvas = await html2canvas(content.value, {
      scale: 2, // Higher scale for better print quality
      useCORS: true,
      logging: false
    })
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

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.form-field {
  flex: 1;
  min-width: 200px;
}

.form-field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.9rem;
}

.button {
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.secondary {
  background-color: #6c757d;
  color: white;
}

.button.danger {
  background-color: #dc3545;
  color: white;
}

.device-item {
  margin: 0.25rem 0;
}

.print-content {
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 1px dashed #ccc;
  background-color: #f9f9f9;
  font-family: monospace;
  font-size: 0.7rem;
  max-width: 300px;
}

.receipt-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.receipt-logo {
  max-width: 100px;
  max-height: 50px;
  margin-bottom: 0.25rem;
}

.receipt-header h2 {
  margin: 0.25rem 0;
  font-size: 1rem;
}

.receipt-header p {
  margin: 0.1rem 0;
  font-size: 0.7rem;
}

.receipt-divider {
  border-top: 1px dashed #333;
  margin: 0.25rem 0;
}

.receipt-info {
  margin-bottom: 0.25rem;
}

.receipt-info p {
  margin: 0.1rem 0;
  font-size: 0.7rem;
}

.receipt-item-header {
  display: flex;
  font-weight: bold;
  padding: 0.1rem 0;
  border-bottom: 1px solid #333;
  font-size: 0.7rem;
}

.receipt-item {
  display: flex;
  padding: 0.1rem 0;
  font-size: 0.7rem;
}

.item-name {
  flex: 3;
}

.item-qty, .item-price, .item-total {
  flex: 1;
  text-align: right;
}

.receipt-totals {
  margin-top: 0.25rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.1rem 0;
  font-size: 0.7rem;
}

.grand-total {
  font-weight: bold;
  border-top: 1px solid #333;
  margin-top: 0.1rem;
  padding-top: 0.1rem;
}

.receipt-footer {
  text-align: center;
  margin-top: 0.5rem;
}

.receipt-footer p {
  margin: 0.1rem 0;
  font-size: 0.7rem;
}

.item-row {
  background-color: #f0f0f0;
  padding: 0.25rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
}
</style>