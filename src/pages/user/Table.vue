<template>
  <div class="user-table-container">
    <FormTable
      ref="TableRef"
      :endpoint="USER_API_ROUTES.list"
      :delete="USER_API_ROUTES.remove"
    >
      <!-- Filter Form -->
      <template #filterForm="{ formData, fieldErrors }">
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
      <template #tableContent="{ data }">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <FormCheck
                    :data-array="data || []"
                    select-all
                    :selected-items="selectedItems"
                    :on-selection-change="updateSelectedItems"
                  />
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
                  <FormCheck
                    :value="user.id"
                    :selected-items="selectedItems"
                    :on-selection-change="updateSelectedItems"
                  />
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
                    :form-table-ref="TableRef"
                  />
                </td>

                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.system_role_name }}</td>
              </tr>

              <tr v-if="(!data || (Array.isArray(data) && data.length === 0))">
                <td colspan="7" class="text-center">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </FormTable>

    <div class="form-actions">
      <ButtonDeleteAll
        :url="USER_API_ROUTES.remove"
        :selected-items="selectedItems"
        :form-table-ref="TableRef"
      />
      <router-link
        :to="{ name: USER_ROUTES.CREATE_USER }"
        class="btn btn-primary"
      >
        Create New User
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'
import { useSelectionState } from '../../composables/useSelectionState'
import FormTable from '../../components/FormTable.vue'
import FormInput from '../../components/FormInput.vue'
import FormSelect from '../../components/FormSelect.vue'
import FormCheck from '../../components/FormCheck.vue'
import ButtonDelete from '../../components/ButtonDelete.vue'
import ButtonDeleteAll from '../../components/ButtonDeleteAll.vue'

const TableRef = ref(null)

// Use the selection state composable
const { selectedItems, updateSelectedItems } = useSelectionState()

</script>

<style scoped>
.user-table-container {
  background-color: var(--bg-white, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-actions {
  padding: 1rem;
  flex-direction: column;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-outline-primary {
  background-color: transparent;
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.text-center {
  text-align: center;
}

.table-responsive {
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
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
}

@media (max-width: 768px) {
  .data-table {
    font-size: 0.875rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }

  .form-actions {
    padding: 1rem;
    flex-direction: column;
  }
}
</style>