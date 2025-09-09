<template>
  <div class="card">
    <div class="card-header">
      <h1>Bluetooth Direct Printer Test</h1>
      <p>Test the Bluetooth Direct Printer functionality based on the Medium article implementation</p>
    </div>
    <div class="card-body">
      <BluetoothDirectPrinterTest />
    </div>
  </div>
</template>

<script setup>
import BluetoothDirectPrinterTest from '../../../components/plugin-tests/BluetoothDirectPrinterTest.vue'
</script>

<style scoped>
.card {
  margin: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #e1e1e1;
  background-color: #f8f9fa;
}

.card-header h1 {
  margin: 0;
  color: #333;
}

.card-body {
  padding: 1rem;
}
</style>