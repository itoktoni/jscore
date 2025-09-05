<template>
  <div class="card">
    <div class="page-header">
      <h2>Edit Role</h2>
    </div>

    <FormContainer
      :form-data="formData"
      :form-rules="formRules"
      :api-url="apiUrl"
      :method="'PUT'"
      @submit="handleSubmit"
      @cancel="handleCancel"
      ref="formContainer"
    >
      <template #default="{ setFieldValue, setFieldError, isSubmitting }">
        <div class="form-container">
          <div class="row">
            <div class="col-12">
              <FormInput
                name="name"
                label="Name *"
                placeholder="Enter role name"
                :required="true"
                @input="value => setFieldValue('name', value)"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <FormInput
                name="description"
                label="Description"
                placeholder="Enter role description"
                @input="value => setFieldValue('description', value)"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <FormInput
                name="permissions"
                label="Permissions"
                placeholder="Enter permissions (comma separated)"
                @input="value => setFieldValue('permissions', value)"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ isSubmitting }">
        <footer class="content-footer">
          <div class="footer-actions">
            <FormButton
              variant="secondary"
              @click="handleCancel"
              text="Cancel"
              :disabled="isSubmitting"
            />
            <FormButton
              variant="primary"
              type="submit"
              text="Update Role"
              :loading="isSubmitting"
            />
          </div>
        </footer>
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROLE_API_ROUTES } from '../../router/roleRoutes'
import { useAlert } from '../../composables/useAlert'
import { roleService } from '../../services/roleService'

import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'

const route = useRoute()
const router = useRouter()
const { alertSuccess, alertError } = useAlert()
const formContainer = ref(null)

// Form data
const formData = ref({
  name: '',
  description: '',
  permissions: ''
})

// Form rules
const formRules = ref({
  name: 'required|min:2|max:50'
})

// API URL for updating
const apiUrl = ref('')

// Load role data for editing
const loadRoleData = async () => {
  try {
    const roleId = route.params.id
    apiUrl.value = ROLE_API_ROUTES.update(roleId)

    // Fetch role data using our service
    const role = await roleService.getRoleById(roleId)

    if (role) {
      formData.value.name = role.name || ''
      formData.value.description = role.description || ''
      formData.value.permissions = Array.isArray(role.permissions)
        ? role.permissions.join(', ')
        : role.permissions || ''
    }
  } catch (error) {
    console.error('Error loading role data:', error)
    alertError('Error', 'Failed to load role data')
    router.push({ name: 'RoleList' })
  }
}

// Handle form submission
const handleSubmit = async (data) => {
  try {
    const roleId = route.params.id

    // If permissions is provided, convert to array
    if (data.permissions) {
      data.permissions = data.permissions.split(',').map(p => p.trim()).filter(p => p)
    }

    // Update role using our service
    await roleService.updateRole(roleId, data)

    // Redirect to role list page
    router.push({ name: 'RoleList' })

    // Show success message
    alertSuccess('Success', 'Role updated successfully!')
  } catch (error) {
    console.error('Error updating role:', error)
    alertError('Error', 'Failed to update role')
  }
}

// Handle cancel
const handleCancel = () => {
  router.push({ name: 'RoleList' })
}

// Load data when component is mounted
onMounted(() => {
  loadRoleData()
})
</script>

<style scoped>
.form-container {
  padding: 1rem;
}

.row {
  margin-bottom: 1rem;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}
</style>