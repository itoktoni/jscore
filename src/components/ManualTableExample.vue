<template>
  <div class="card">
    <h2>Manual Table Example (Using foreach approach)</h2>
    
    <!-- Manual table with foreach -->
    <div class="col-12">
      <div class="table-info mb-2">
        <p>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users</p>
      </div>

      <div class="table-wrapper">
        <table class="data-table striped">
          <thead>
            <tr>
              <th>No.</th>
<th>Name</th>
<th>Username</th>
<th>Email</th>
<th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
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
    active: true
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    active: false
  },
  {
    id: 3,
    username: 'mikejohnson',
    email: 'mike@example.com',
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
</script>

<style scoped>
.card {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-info {
    text-align: center;
  }

  .hide-mobile{
    display: none;
  }

  td:not([data-label]) {
    display: none;
  }
}
</style>