<template>
  <div class="page-container">
    <h1>FormTable Example</h1>

    <FormTable
      ref="formTableRef"
      endpoint="/api/users"
      :initial-data="{ name: '', email: '', role: '' }"
    >
      <!-- Filter Form -->
      <template #default="{ formData, fieldErrors }">
        <div class="row">
          <FormInput
            name="name"
            label="Name"
            placeholder="Search by name"
            col="4"
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Search by email"
            col="4"
          />
          <FormSelect
            name="role"
            label="Role"
            :options="[
              { label: 'All Roles', value: '' },
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Manager', value: 'manager' }
            ]"
            col="4"
          />
        </div>
      </template>

      <!-- Table Content -->
      <template #table="{ data, loading }">
        <div v-if="loading" class="loading-indicator">
          Loading...
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>
                <span class="role-badge" :class="`role-${item.role}`">
                  {{ item.role }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary">Edit</button>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td colspan="5" class="text-center">No data found</td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Custom Pagination -->
      <template #pagination="{ pagination, changePage }">
        <nav class="custom-pagination">
          <button
            :disabled="pagination.current_page <= 1"
            @click="changePage(pagination.current_page - 1)"
            class="pagination-btn"
          >
            ← Previous
          </button>

          <div class="pagination-pages">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              :class="{ active: page === pagination.current_page }"
              @click="changePage(page)"
              class="page-number"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
            class="pagination-btn"
          >
            Next →
          </button>
        </nav>
      </template>
    </FormTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormTable from '../components/FormTable.vue'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'

const formTableRef = ref(null)

// Helper function to generate page numbers for pagination
const getPageNumbers = () => {
  const pagination = formTableRef.value?.pagination
  if (!pagination) return []

  const { current_page, last_page } = pagination
  const pages = []

  // Show first page
  if (last_page >= 1) pages.push(1)

  // Show ellipsis if there are pages between first and current
  if (current_page > 3) pages.push('...')

  // Show pages around current page
  for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  // Show ellipsis if there are pages between current and last
  if (current_page < last_page - 2) pages.push('...')

  // Show last page
  if (last_page > 1 && !pages.includes(last_page)) pages.push(last_page)

  return pages
}
</script>

<style scoped>
.page-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-container h1 {
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.data-table tbody tr:hover {
  background-color: #f1f5f9;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-admin {
  background-color: #fee2e2;
  color: #dc2626;
}

.role-user {
  background-color: #dbeafe;
  color: #2563eb;
}

.role-manager {
  background-color: #dcfce7;
  color: #16a34a;
}

.btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid transparent;
  margin-right: 0.25rem;
}

.btn-sm {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
}

.btn-outline-primary {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: white;
}

.btn-outline-danger {
  border-color: #ef4444;
  color: #ef4444;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  color: white;
}

.custom-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem 0;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  background-color: white;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.page-number:hover:not(.active):not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.page-number.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-center {
  text-align: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .data-table {
    font-size: 0.875rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }

  .custom-pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-pages {
    order: -1;
  }
}
</style>