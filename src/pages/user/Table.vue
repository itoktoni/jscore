<template>
  <FormTable
    ref="TableRef"
    :endpoint="API.LIST"
    :delete="API.REMOVE"
    :module="MODULE"
    :has-footer-actions="true"
    :optionsFilter="userType"
  >
    <!-- Filter Form -->
    <template #filterForm="{ formData, fieldErrors }">
      <div class="row">
        <FormInput name="username" label="Username" placeholder="Search by username" col="4"
          :model-value="formData.username || ''" @update:model-value="val => formData.username = val" />
        <FormInput name="email" label="Email" placeholder="Search by email" col="4" :model-value="formData.email || ''"
          @update:model-value="val => formData.email = val" />
        <FormSelect name="role" label="Role" :options="options" col="4" :model-value="formData.role || ''" @update:model-value="val => formData.role = val" />
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
              <th class="text-center action-table">Actions</th>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hide-lg">
             <td data-label="Check All Data">
                <FormCheck :data-array="data || []" select-all :selected-items="selectedItems"
                  :on-selection-change="updateSelectedItems" />
              </td>
            </tr>
            <tr v-for="user in (data || [])" :key="user.id">
              <td>
                <FormCheck :value="user.id" :selected-items="selectedItems"
                  :on-selection-change="updateSelectedItems" />
              </td>

              <td data-label="Actions">
                <div class="action-table">
                  <Button type="link" variant="primary"
                    :to="{ name: ROUTES.EDIT, params: { id: user.id } }" text="Button.edit:icon" />

                  <Button type="delete" variant="danger" :url="API.DELETE(user.id)"
                    :form-table-ref="TableRef" text="Button.delete:icon" />
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

    <!-- Footer Actions -->
    <template #footerActions>
      <Button type="remove" variant="danger" :url="API.REMOVE" :selected-items="selectedItems"
        :form-table-ref="TableRef" text="Delete" />

      <Button type="link" variant="success" :to="{ name: ROUTES.CREATE }" text="Button.create" />
    </template>
  </FormTable>
</template>

<script setup>
import { ref } from 'vue'
import { ROUTES, API, MODULE } from '../../router/userRoutes'
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

const options = [
  { label: 'All Roles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
];

const userType = [
  { label: 'All Filter', value: '' },
  { label: 'Username', value: 'username' },
  { label: 'Role', value: 'role' }
];

</script>