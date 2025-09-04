<template>
  <div class="card">
    <h2>Simplified Table Component Test</h2>

    <!-- Full featured table -->
    <h3>Full Featured Table (with checkboxes and actions)</h3>
    <TableComponent
      :items="users"
      :pagination="pagination"
      :select-all="selectAll"
      :columns="userColumns"
      entity-name="users"
      @toggle-select-all="toggleSelectAll"
      @update-select-all="updateSelectAll"
    >
      <template #header>
        <th>No.</th>
        <th>Name</th>
        <th>Username</th>
        <th>Email</th>
        <th>Status</th>
      </template>

      <template #actions="{ item }">
        <button class="btn btn-primary" @click="viewItem(item)">View</button>
        <button class="btn btn-secondary" @click="editItem(item)">Edit</button>
      </template>

      <template #name="{ item }">
        <div class="user-name-cell">
          <span>{{ item.name || item.username || 'N/A' }}</span>
        </div>
      </template>
      <template #username="{ item }">
        <div class="user-username-cell">
          <span>@{{ item.username }}</span>
        </div>
      </template>
      <template #status="{ item }">
        <div class="user-status-cell">
          <span :class="item.active ? 'status-active' : 'status-inactive'">
            {{ item.active ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </template>
    </TableComponent>

    <!-- Simple table without checkboxes or actions -->
    <h3>Simple Table (no checkboxes or actions)</h3>
    <TableComponent
      :items="products"
      :pagination="productPagination"
      :columns="productColumns"
      entity-name="products"
      :show-checkbox="false"
      :show-actions="false"
      :show-select-all="false"
    >
      <template #header>
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Status</th>
      </template>

      <template #name="{ item }">
        <div class="product-name-cell">
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template #price="{ item }">
        <div class="product-price-cell">
          <span>${{ item.price }}</span>
        </div>
      </template>
      <template #status="{ item }">
        <div class="product-status-cell">
          <span :class="item.inStock ? 'status-active' : 'status-inactive'">
            {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
      </template>
    </TableComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TableComponent from './TableComponent.vue'

// User data
const users = ref([
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

const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 3,
  from: 1,
  to: 3,
  totalPages: 1
})

const selectAll = ref(false)

const userColumns = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'name', label: 'Name', type: 'custom' },
  { key: 'username', label: 'Username', type: 'custom' },
  { key: 'email', label: 'Email' },
  { key: 'active', label: 'Status', type: 'status' }
]

// Product data
const products = ref([
  {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    inStock: true
  },
  {
    id: 2,
    name: 'Product 2',
    price: 49.99,
    inStock: false
  },
  {
    id: 3,
    name: 'Product 3',
    price: 19.99,
    inStock: true
  }
])

const productPagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 3,
  from: 1,
  to: 3,
  totalPages: 1
})

const productColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', type: 'custom' },
  { key: 'price', label: 'Price', type: 'price' },
  { key: 'inStock', label: 'Status', type: 'status' }
]

// Methods
function toggleSelectAll() {
  selectAll.value = !selectAll.value
  users.value.forEach(user => {
    user.selected = selectAll.value
  })
}

function updateSelectAll() {
  const selectedUsers = users.value.filter(user => user.selected)
  selectAll.value = selectedUsers.length === users.value.length
}

function viewItem(item) {
  console.log('View item:', item)
}

function editItem(item) {
  console.log('Edit item:', item)
}
</script>

<style scoped>
.card {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.user-name-cell,
.user-username-cell,
.user-status-cell,
.product-name-cell,
.product-price-cell,
.product-status-cell {
  padding: 0.5rem;
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
</style>