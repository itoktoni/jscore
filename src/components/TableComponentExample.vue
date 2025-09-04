<template>
  <div class="card">
    <h2>Simple List Example (No Actions or Checkboxes)</h2>
    
    <!-- Simple table without actions or checkboxes -->
    <TableComponent
      :items="items"
      :pagination="pagination"
      :columns="columns"
      entity-name="items"
      :show-checkbox="false"
      :show-actions="false"
      :show-select-all="false"
    >
      <template #header>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
        <th>Status</th>
      </template>
      
      <!-- Custom cell rendering -->
      <template #name="{ item }">
        <TableCell :value="item.name" label="Name" :is-child="true" />
      </template>
      <template #status="{ item }">
        <TableCell
          :value="item.active"
          label="Status"
          type="status"
          :boolean-labels="{ true: 'Active', false: 'Inactive' }"
          :is-child="true"
        />
      </template>
    </TableComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TableComponent from './TableComponent.vue'
import TableCell from './TableCell.vue'

// Sample data
const items = ref([
  {
    id: 1,
    name: 'Item 1',
    description: 'This is the first item',
    active: true
  },
  {
    id: 2,
    name: 'Item 2',
    description: 'This is the second item',
    active: false
  },
  {
    id: 3,
    name: 'Item 3',
    description: 'This is the third item',
    active: true
  }
])

// Pagination data
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 3,
  from: 1,
  to: 3,
  totalPages: 1
})

// Column definitions
const columns = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', type: 'custom' },
  { key: 'description', label: 'Description' },
  { key: 'active', label: 'Status', type: 'status' }
])
</script>

<style scoped>
.card {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>