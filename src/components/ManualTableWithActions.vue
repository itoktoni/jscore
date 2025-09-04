<template>
  <div class="card">
    <div class="page-header">
      <h2>Manual Table with Actions</h2>
    </div>

    <!-- Manual table with foreach loop -->
    <div class="col-12">
      <div class="table-info mb-2">
        <p>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users</p>

        <p class="select-all">
          <input
            type="checkbox"
            :checked="selectAll"
            @change="toggleSelectAll"
          >
        </p>
      </div>

      <div class="table-wrapper">
        <table class="data-table striped">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  :checked="selectAll"
                  @change="toggleSelectAll"
                >
              </th>
              <th class="action-header text-center">Actions</th>
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
                  <button class="btn btn-primary" @click="viewItem(item)" title="View">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-secondary" @click="editItem(item)" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-info" @click="printItem(item)" title="Print">
                    <i class="bi bi-printer"></i>
                  </button>
                  <button class="btn btn-danger" @click="deleteItem(item)" title="Delete">
                    <i class="bi bi-trash"></i>
                  </button>
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

.btn {
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  border: 1px solid transparent;
}

.btn:hover {
  border: 1px solid #ddd;
}

.btn-primary {
  color: #007bff;
}

.btn-secondary {
  color: #6c757d;
}

.btn-info {
  color: #17a2b8;
}

.btn-danger {
  color: #dc3545;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.select-all {
  display: none;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-info {
    text-align: center;
  }

  .select-all {
    display: block;
  }

  .hide-mobile{
    display: none;
  }

  td:not([data-label]) {
    display: none;
  }
}
</style>