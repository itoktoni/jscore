<template>
  <div class="card">
    <div class="page-header">
      <h2>Simple Manual Table</h2>
    </div>

    <!-- Manual table with foreach loop -->
    <div class="col-12">
      <div class="table-info mb-2">
        <p>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} items</p>
      </div>

      <div class="table-wrapper">
        <table class="data-table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td data-label="ID">{{ item.id }}</td>
              <td data-label="Name">{{ item.name }}</td>
              <td data-label="Description">{{ item.description }}</td>
              <td data-label="Price">${{ item.price }}</td>
              <td data-label="Status">
                <span :class="item.inStock ? 'status-active' : 'status-inactive'">
                  {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
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
    name: 'Product 1',
    description: 'This is product 1',
    price: 29.99,
    inStock: true
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'This is product 2',
    price: 49.99,
    inStock: false
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'This is product 3',
    price: 19.99,
    inStock: true
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