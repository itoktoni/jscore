<template>
  <div class="user-table-container">
    <FormTable
      ref="userTableRef"
      :endpoint=USER_API_ROUTES.list
      :delete-endpoint="userId => USER_API_ROUTES.delete(userId)"
      :batch-delete-endpoint=USER_API_ROUTES.remove
      :initial-data="{ username: '', email: '', role: '' }"
      @search="handleSearch"
      @error="handleError"
      @delete-selected="handleDeleteSelected"
    >
      <!-- Filter Form -->
      <template #default="{ formData, fieldErrors }">
        <div class="row">
          <FormInput
            name="username"
            label="Username"
            placeholder="Search by username"
            col="4"
            :model-value="formData.username || ''"
            @update:model-value="val => formData.username = val"
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Search by email"
            col="4"
            :model-value="formData.email || ''"
            @update:model-value="val => formData.email = val"
          />
          <FormSelect
            name="role"
            label="Role"
            :options="[
              { label: 'All Roles', value: '' },
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' }
            ]"
            col="4"
            :model-value="formData.role || ''"
            @update:model-value="val => formData.role = val"
          />
        </div>
      </template>

      <!-- Table Content -->
      <template #table="{ data, loading, selectedItems, toggleSelectAll, isAllSelected }">
        <div v-if="loading" class="loading-indicator">
          Loading users...
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  >
                </th>
                <th>Actions</th>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in (data || [])" :key="user.id">
                <td data-label="Select">
                  <input
                    type="checkbox"
                    :checked="selectedItems && selectedItems.includes(user.id)"
                    @change="() => toggleSelectItem(user.id)"
                  >
                </td>

                <td>
                  <router-link
                    :to="{ name: USER_ROUTES.EDIT_USER, params: { id: user.id } }"
                    class="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </router-link>
                  <ButtonDelete
                    :url="USER_API_ROUTES.delete(user.id)"
                    @success="handleDeleteSuccess"
                  />
                </td>

                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>

                <td>
                  <span class="badge" :class="`badge-${user.system_role_name?.toLowerCase() || 'user'}`">
                    {{ user.system_role_name || 'User' }}
                  </span>
                </td>
              </tr>

              <tr v-if="(!data || (Array.isArray(data) && data.length === 0))">
                <td colspan="7" class="text-center">No users found</td>
              </tr>
            </tbody>
          </table>

          <!-- Delete Selected Button -->
          <div v-if="selectedItems && selectedItems.length > 0" class="mt-3">
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteSelectedUsers"
            >
              Delete Selected ({{ selectedItems.length }})
            </button>
          </div>
        </div>
      </template>
    </FormTable>

    <div class="form-actions">
      <router-link
        :to="{ name: 'CreateUser' }"
        class="btn btn-primary"
      >
        Create New User
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlert } from '../../composables/useAlert'
import FormTable from '../../components/FormTable.vue'
import FormInput from '../../components/FormInput.vue'
import FormSelect from '../../components/FormSelect.vue'
import ButtonDelete from '../../components/ButtonDelete.vue'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'

const router = useRouter()
const route = useRoute()
const { alertSuccess, alertError, alertConfirm } = useAlert()
const userTableRef = ref(null)

// Toggle selection of a single item
const toggleSelectItem = (id) => {
  // Use the FormTable's toggleSelectItem method if available
  if (userTableRef.value && typeof userTableRef.value.toggleSelectItem === 'function') {
    userTableRef.value.toggleSelectItem(id);
  }
}

// Handle search results
const handleSearch = (response) => {
  console.log('Users loaded:', response)
  console.log('Response data:', response.data)
}

// Handle search errors
const handleError = (error) => {
  alertError('Error', 'Failed to load users')
  console.error('User list error:', error)
}

// Handle delete selected event
const handleDeleteSelected = (deletedItems) => {
  console.log('Deleted items:', deletedItems)
  alertSuccess('Success', 'Selected users deleted successfully')
}

// Generic table refresh function
// This approach uses the exposed refresh method from FormTable (alias for handleSearch)
// Can be called as: userTableRef.value.refresh() or refreshTable()
const refreshTable = () => {
  // Try to use the refresh method first (newer approach), fallback to handleSearch
  if (userTableRef.value) {
    if (typeof userTableRef.value.refresh === 'function') {
      userTableRef.value.refresh()
    } else if (typeof userTableRef.value.handleSearch === 'function') {
      userTableRef.value.handleSearch()
    }
  }
}

// Handle delete success
const handleDeleteSuccess = (id) => {
  console.log('Deleted user:', id)
  alertSuccess('Success', 'User deleted successfully')

  // Refresh the table
  refreshTable()
}

// Delete selected users
const deleteSelectedUsers = () => {
  if (userTableRef.value && typeof userTableRef.value.handleDeleteSelected === 'function') {
    userTableRef.value.handleDeleteSelected()
      .then(() => {
        // Refresh the table after successful deletion
        refreshTable()
      })
      .catch((error) => {
        console.error('Error deleting selected users:', error)
      })
  }
}
</script>