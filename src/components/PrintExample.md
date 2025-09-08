# Print Functionality Implementation Examples

This document provides examples of how to implement print functionality in your Vue components using the TableComponent.

## Basic Print Implementation

The simplest way to implement print functionality is to use the browser's built-in print function:

```javascript
function handlePrint(item) {
  window.print()
}
```

## Advanced Print Implementation

For more advanced print functionality, you can create a print-friendly view:

```vue
<template>
  <div>
    <!-- Main content -->
    <TableComponent
      :items="items"
      :pagination="pagination"
      :select-all="selectAll"
      :columns="tableColumns"
      entity-name="users"
      @print="handlePrint"
      <!-- other events -->
    />

    <!-- Print-friendly view (hidden by default) -->
    <div ref="printArea" class="print-area" v-if="showPrintView">
      <h1>User Details</h1>
      <div v-if="selectedUser">
        <p><strong>Name:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ selectedUser.system_role_name }}</p>
        <p><strong>Status:</strong> {{ selectedUser.active ? 'Active' : 'Inactive' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showPrintView = ref(false)
const selectedUser = ref(null)
const printArea = ref(null)

function handlePrint(user) {
  // Set the user to print
  selectedUser.value = user

  // Show print view
  showPrintView.value = true

  // Wait for the DOM to update
  nextTick(() => {
    // Print the specific area
    printElement(printArea.value)

    // Hide print view after a short delay
    setTimeout(() => {
      showPrintView.value = false
    }, 1000)
  })
}

function printElement(element) {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          p { margin: 10px 0; }
          strong { color: #555; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
</script>

<style scoped>
.print-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 9999;
  padding: 20px;
}

/* Hide print area when not printing */
@media screen {
  .print-area:not(.visible) {
    display: none;
  }
}

/* Show print area when printing */
@media print {
  .print-area {
    display: block !important;
    position: static;
  }

  /* Hide everything else when printing */
  :not(.print-area) {
    display: none;
  }
}
</style>
```

## Using a Print Library

You can also use a library like `print-js` for more advanced print functionality:

```bash
npm install print-js
```

```vue
<script setup>
import printJS from 'print-js'

function handlePrint(user) {
  // Create HTML content for printing
  const htmlContent = `
    <div>
      <h1>User Details</h1>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.system_role_name}</p>
      <p><strong>Status:</strong> ${user.active ? 'Active' : 'Inactive'}</p>
    </div>
  `

  // Print using print-js
  printJS({
    printable: htmlContent,
    type: 'raw-html',
    style: `
      h1 { color: #333; text-align: center; }
      p { margin: 10px 0; }
      strong { color: #555; }
    `
  })
}
</script>
```

## Batch Printing

For printing multiple items at once:

```vue
<script setup>
function handlePrintSelected() {
  // Get selected items
  const selectedItems = items.value.filter(item => item.selected)

  if (selectedItems.length === 0) {
    alert('Please select items to print')
    return
  }

  // Create HTML content for all selected items
  const htmlContent = `
    <div>
      <h1>Selected Users</h1>
      ${selectedItems.map(user => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.system_role_name}</p>
          <p><strong>Status:</strong> ${user.active ? 'Active' : 'Inactive'}</p>
        </div>
      `).join('')}
    </div>
  `

  // Print using print-js
  printJS({
    printable: htmlContent,
    type: 'raw-html',
    style: `
      h1 { color: #333; text-align: center; }
      p { margin: 5px 0; }
      strong { color: #555; }
      div { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; }
    `
  })
}
</script>
```

## Print Button in Footer

You can also add a print button to the footer for batch printing:

```vue
<template>
  <footer class="content-footer">
    <div class="form-actions">
      <FormButton variant="secondary" @click="loadItems" text="Refresh" />
      <FormButton variant="info" @click="handlePrintSelected" text="Print Selected" :disabled="!hasSelectedItems" />
      <FormButton variant="danger" @click="deleteSelectedUsers" text="Delete" :disabled="!hasSelectedItems" />
      <FormButton variant="success" @click="handleCreate(USER_ROUTES.CREATE_USER)" text="+ Create" />
    </div>
  </footer>
</template>
```