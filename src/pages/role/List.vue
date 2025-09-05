<template>
  <div class="role-list-page">
    <div class="page-header">
      <h2>Roles Management</h2>
      <div class="header-actions">
        <button
          @click="goToCreate"
          class="btn btn-primary"
        >
          Create Role
        </button>
        <button
          @click="goToCreateVueform"
          class="btn btn-secondary"
        >
          Create Role (Vueform)
        </button>
      </div>
    </div>

    <div class="card w-full">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id">
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td>{{ role.description }}</td>
              <td>
                <button
                  @click="editRole(role.id)"
                  class="btn btn-success mr-2"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  @click="deleteRole(role.id)"
                  class="btn btn-warning"
                  title="Delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ROLE_ROUTES } from '../../router/roleRoutes'
import { roleService } from '../../services/roleService'
import { useRolePagination } from '../../composables/useRolePagination'
import { useAlert } from '../../composables/useAlert'

const router = useRouter()
const { alertSuccess, alertError } = useAlert()
const { roles, fetchRoles } = useRolePagination()

// Fetch roles on component mount
onMounted(() => {
  fetchRoles()
})

// Navigation functions
const goToCreate = () => {
  router.push({ name: ROLE_ROUTES.CREATE_ROLE })
}

const goToCreateVueform = () => {
  router.push({ name: ROLE_ROUTES.CREATE_ROLE_VUEFORM })
}

// Edit role
const editRole = (id) => {
  router.push({ name: ROLE_ROUTES.EDIT_ROLE, params: { id } })
}

// Delete role
const deleteRole = async (id) => {
  try {
    await roleService.deleteRole(id)
    alertSuccess('Success', 'Role deleted successfully')
    fetchRoles() // Refresh the list
  } catch (error) {
    alertError('Error', 'Failed to delete role')
  }
}
</script>

<style scoped>
.role-list-page {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>