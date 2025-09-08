<template>

  <div class="card">

    <div class="page-header">
      <h2>Current Configuration</h2>
    </div>

    <div class="card-table">
      <FormTable ref="TableRef" :endpoint="USER_API_ROUTES.list" :delete="USER_API_ROUTES.remove">
        <!-- Filter Form -->
        <template #filterForm="{ formData, fieldErrors }">
          <div class="row">
            <FormInput name="username" label="Username" placeholder="Search by username" col="4"
              :model-value="formData.username || ''" @update:model-value="val => formData.username = val" />
            <FormInput name="email" label="Email" placeholder="Search by email" col="4"
              :model-value="formData.email || ''" @update:model-value="val => formData.email = val" />
            <FormSelect name="role" label="Role" :options="[
              { label: 'All Roles', value: '' },
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' }
            ]" col="4" :model-value="formData.role || ''" @update:model-value="val => formData.role = val" />
          </div>
        </template>

        <!-- Table Content -->
        <template #tableContent="{ data }">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>
                    <FormCheck :data-array="data || []" select-all :selected-items="selectedItems"
                      :on-selection-change="updateSelectedItems" />
                  </th>
                  <th class="text-center">Actions</th>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in (data || [])" :key="user.id">
                  <td>
                    <FormCheck :value="user.id" :selected-items="selectedItems"
                      :on-selection-change="updateSelectedItems" />
                  </td>

                  <td data-label="Actions">
                    <div class="action-table">
                      <Button button-type="link" variant="primary" size="small"
                      :to="{ name: USER_ROUTES.EDIT_USER, params: { id: user.id } }" iconType="edit" />

                      <Button button-type="delete" variant="danger" size="small" :url="USER_API_ROUTES.delete(user.id)"
                      :form-table-ref="TableRef" iconType="delete" />
                    </div>
                  </td>

                  <td data-label="ID">{{ user.id }}</td>
                  <td data-label="Username">{{ user.username }}</td>
                  <td data-label="Name">{{ user.name }}</td>
                  <td data-label="Email">{{ user.email }}</td>
                  <td data-label="Role Name">{{ user.system_role_name }}</td>
                </tr>

                <tr v-if="(!data || (Array.isArray(data) && data.length === 0))">
                  <td colspan="7" class="text-center">No users found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

      </FormTable>

      <footer class="content-footer safe-area-bottom">
        <div class="form-actions">
          <Button button-type="remove" variant="error" size="medium" :url="USER_API_ROUTES.remove" :selected-items="selectedItems"
            :form-table-ref="TableRef" text="Delete Selected" />

          <Button button-type="link" variant="primary" size="medium" :to="{ name: USER_ROUTES.CREATE_USER }" text="Create New User" />
        </div>
      </footer>

    </div>

  </div>

</template>

<script setup>
import { ref } from 'vue'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { useSelectionState } from '../../composables/useSelectionState'
import FormTable from '../../components/FormTable.vue'
import FormInput from '../../components/FormInput.vue'
import FormSelect from '../../components/FormSelect.vue'
import FormCheck from '../../components/FormCheck.vue'
// Import the updated Button component
import Button from '../../components/Button.vue'

const TableRef = ref(null)

// Use the selection state composable
const { selectedItems, updateSelectedItems } = useSelectionState()
</script>