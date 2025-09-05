<template>
  <div class="user-table-container">
    <FormTable
      ref="userTableRef"
      endpoint="/api-user/data"
      :initial-data="{ username: '', email: '', role: '' }"
      @search="handleSearch"
      @error="handleError"
    >
      <!-- Filter Form -->
      <template #default="{ formData, fieldErrors }">
        <div class="row">
          <FormInput
            name="username"
            label="Username"
            placeholder="Search by username"
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
              { label: 'User', value: 'user' }
            ]"
            col="4"
          />
        </div>
      </template>

      <!-- Table Content -->
      <template #table="{ data, loading }">
        <div v-if="loading" class="loading-indicator">
          Loading users...
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox">
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
                  <input type="checkbox">
                </td>

                <td>
                  <router-link
                    :to="{ name: 'EditUser', params: { id: user.id } }"
                    class="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteUser(user.id)"
                    class="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>

                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>

                <td>
                  <span class="badge" :class="`badge-${user.system_role_name.toLowerCase()}`">
                    {{ user.system_role_name }}
                  </span>
                </td>
              </tr>

              <tr v-if="(data?.meta && data.meta.total === 0) || !data?.data?.length">
                <td colspan="6" class="text-center">No users found</td>
              </tr>
            </tbody>
          </table>
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
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'

const router = useRouter()
const route = useRoute()
const { alertSuccess, alertError, alertConfirm } = useAlert()
const userTableRef = ref(null)

const handleSearch = (response) => {
  console.log('Users loaded:', response)
  console.log('Response data:', response.data)
}

const handleError = (error) => {
  alertError('Error', 'Failed to load users')
  console.error('User list error:', error)
}

const deleteUser = async (userId) => {
  const result = await alertConfirm(
    'Confirm Delete',
    'Are you sure you want to delete this user?'
  )

  if (result.isConfirmed) {
    try {
      // Simulate API call
      await http.get(USER_API_ROUTES.delete(item.id))
      await userTableRef.value.handleSearch() // Refresh the table after deletion

      alertSuccess('Success', 'User deleted successfully')
    } catch (error) {
      alertError('Error', 'Failed to delete user')
      console.error('Delete user error:', error)
    }
  }
}
</script>
