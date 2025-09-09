<template>
  <div class="card">
    <div class="card-header">
      <h1>Kduma Bluetooth Printer Test</h1>
      <p>Test the Kduma Bluetooth Printer functionality</p>
    </div>
    <div class="card-body">
      <KdumaBluetoothPrinterTest />
    </div>
  </div>
</template>

<script setup>
import KdumaBluetoothPrinterTest from '../../../components/plugin-tests/KdumaBluetoothPrinterTest.vue'
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