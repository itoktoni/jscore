<template>
  <div class="page-container">
    <div class="page-header">
      <h2>User Table Example</h2>
      <p>Example of using the standalone TableComponent</p>
    </div>

    <div class="card">
      <TableComponent
        :data="users"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :show-pagination="true"
        :striped="true"
        row-key="id"
        show-edit
        show-delete
        @edit="handleEdit"
        @delete="handleDelete"
        @sort="handleSort"
        @page-change="handlePageChange"
      >
        <!-- Custom cell for role column -->
        <template #cell-role="{ item }">
          <span class="badge" :class="`badge-${item.role}`">
            {{ item.role }}
          </span>
        </template>

        <!-- Custom actions -->
        <template #actions="{ item }">
          <router-link
            :to="{ name: 'user.edit', params: { id: item.id } }"
            class="btn btn-sm btn-outline-primary"
          >
            Edit
          </router-link>
          <button
            @click="viewUser(item)"
            class="btn btn-sm btn-outline-info"
          >
            View
          </button>
          <button
            @click="deleteUser(item)"
            class="btn btn-sm btn-outline-danger"
          >
            Delete
          </button>
        </template>
      </TableComponent>
    </div>

    <div class="form-actions">
      <router-link
        :to="{ name: ROUTES.CREATE }"
        class="btn btn-primary"
      >
        Create New User
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '../../composables/useAlert'
import { ROUTES } from '../../router/userRoutes'
import TableComponent from '../../components/TableComponent.vue'

const router = useRouter()
const { alertSuccess, alertError, alertConfirm } = useAlert()

// State
const users = ref([])
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 5,
  per_page: 10,
  total: 50,
  from: 1,
  to: 10
})

// Column definitions
const columns = ref([
  {
    key: 'id',
    label: 'ID',
    sortable: true
  },
  {
    key: 'username',
    label: 'Username',
    sortable: true
  },
  {
    key: 'name',
    label: 'Full Name',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true
  },
  {
    key: 'created_at',
    label: 'Created',
    type: 'date',
    sortable: true
  }
])

// Methods
const loadUsers = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data
    users.value = [
      {
        id: 1,
        username: 'john_doe',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        created_at: '2023-01-15T10:30:00Z'
      },
      {
        id: 2,
        username: 'jane_smith',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        created_at: '2023-02-20T14:45:00Z'
      },
      {
        id: 3,
        username: 'bob_wilson',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'user',
        created_at: '2023-03-10T09:15:00Z'
      },
      {
        id: 4,
        username: 'alice_brown',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'manager',
        created_at: '2023-04-05T16:20:00Z'
      }
    ]
  } catch (error) {
    alertError('Error', 'Failed to load users')
  } finally {
    loading.value = false
  }
}

const handleEdit = (user) => {
  router.push({ name: ROUTES.EDIT, params: { id: user.id } })
}

const handleDelete = async (user) => {
  const result = await alertConfirm(
    'Confirm Delete',
    `Are you sure you want to delete user ${user.name}?`
  )

  if (result.isConfirmed) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Remove user from list
      users.value = users.value.filter(u => u.id !== user.id)

      alertSuccess('Success', 'User deleted successfully')
    } catch (error) {
      alertError('Error', 'Failed to delete user')
    }
  }
}

const viewUser = (user) => {
  router.push({ name: ROUTES.LIST, params: { id: user.id } })
}

const deleteUser = async (user) => {
  handleDelete(user)
}

const handleSort = (sortData) => {
  console.log('Sort changed:', sortData)
  // In a real app, you would re-fetch data with sort parameters
}

const handlePageChange = (page) => {
  console.log('Page changed:', page)
  pagination.value.current_page = page
  // In a real app, you would re-fetch data for the new page
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.page-container {
  padding: 1.5rem;
}

.page-header h2 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.page-header p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.card {
  background-color: var(--bg-white, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-actions {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-outline-primary {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: transparent;
  margin-right: 0.25rem;
}

.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: white;
}

.btn-outline-info {
  border-color: #06b6d4;
  color: #06b6d4;
  background-color: transparent;
  margin-right: 0.25rem;
}

.btn-outline-info:hover {
  background-color: #06b6d4;
  color: white;
}

.btn-outline-danger {
  border-color: #ef4444;
  color: #ef4444;
  background-color: transparent;
  margin-right: 0.25rem;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  color: white;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-admin {
  background-color: #fee2e2;
  color: #dc2626;
}

.badge-user {
  background-color: #dbeafe;
  color: #2563eb;
}

.badge-manager {
  background-color: #dcfce7;
  color: #16a34a;
}
</style>