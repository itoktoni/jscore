<template>
  <div class="card">
    <div class="page-header">
      <h2>Manual Table with Actions</h2>
    </div>

    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  :checked="selectAll"
                  @change="toggleSelectAll"
                >
              </th>
              <th class="action-header">Actions</th>
              <th>No.</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td data-label="Select">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  @change="() => updateSelectAll(item)"
                >
              </td>
              <td class="column-action" data-label="Actions">
                <div class="action-table">
                  <Button
                    button-type="button"
                    variant="primary"
                    size="small"
                    @click="viewItem(item)"
                    title="View"
                    text=""
                  >
                    <i class="bi bi-eye"></i>
                  </Button>
                  <Button
                    button-type="button"
                    variant="secondary"
                    size="small"
                    @click="editItem(item)"
                    title="Edit"
                    text=""
                  >
                    <i class="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    button-type="button"
                    variant="info"
                    size="small"
                    @click="printItem(item)"
                    title="Print"
                    text=""
                  >
                    <i class="bi bi-printer"></i>
                  </Button>
                  <Button
                    button-type="button"
                    variant="danger"
                    size="small"
                    @click="deleteItem(item)"
                    title="Delete"
                    text=""
                  >
                    <i class="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
              <td data-label="No.">{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}</td>
              <td data-label="Name">{{ item.name || item.username || 'N/A' }}</td>
              <td data-label="Username">@{{ item.username }}</td>
              <td data-label="Email">{{ item.email }}</td>
              <td data-label="Status">
                <span :class="item.active ? 'status-active' : 'status-inactive'">
                  {{ item.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from './Button.vue'

// Sample data
const items = ref([
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    active: true,
    selected: false
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    active: false,
    selected: false
  },
  {
    id: 3,
    username: 'mikejohnson',
    email: 'mike@example.com',
    active: true,
    selected: false
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

const selectAll = ref(false)

// Methods
function toggleSelectAll() {
  selectAll.value = !selectAll.value
  items.value.forEach(item => {
    item.selected = selectAll.value
  })
}

function updateSelectAll(item) {
  item.selected = !item.selected
  const selectedItems = items.value.filter(i => i.selected)
  selectAll.value = selectedItems.length === items.value.length
}

function viewItem(item) {
  console.log('View item:', item)
}

function editItem(item) {
  console.log('Edit item:', item)
}

function printItem(item) {
  console.log('Print item:', item)
}

function deleteItem(item) {
  console.log('Delete item:', item)
}
</script>

<style scoped>
.card {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-header {
  margin-bottom: 1rem;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.table-info {
  border-top: 1px solid lightgray;
  font-size: 1.5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  color: #666;
  position: relative;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.action-header {
  width: 150px;
}

.column-action {
  white-space: nowrap;
}

.status-active {
  color: #28a745;
  font-weight: 500;
}

.status-inactive {
  color: #dc3545;
  font-weight: 500;
}
</style>