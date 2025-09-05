<template>
  <div class="card">
    <div class="page-header">
      <h2>Create Role</h2>
    </div>

    <FormContainer
      :form-data="formData"
      :form-rules="formRules"
      :api-url="ROLE_API_ROUTES.create"
      @submit="handleSubmit"
      @cancel="handleCancel"
      ref="formContainer"
    >
      <template #default="{ setFieldValue, setFieldError, isSubmitting }">
        <div class="form-container">
          <div class="row">
            <div class="col-12">
              <div class="p-field mb-4">
                <label for="name" class="p-label block font-bold mb-2">Name *</label>
                <InputText
                  id="name"
                  :value="formData.name"
                  @input="event => setFieldValue('name', event.target.value)"
                  placeholder="Enter role name"
                  class="w-full"
                  :required="true"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="p-field mb-4">
                <label for="description" class="p-label block font-bold mb-2">Description</label>
                <Textarea
                  id="description"
                  :value="formData.description"
                  @input="event => setFieldValue('description', event.target.value)"
                  placeholder="Enter role description"
                  rows="3"
                  class="w-full"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="p-field mb-4">
                <label for="permissions" class="p-label block font-bold mb-2">Permissions</label>
                <InputText
                  id="permissions"
                  :value="formData.permissions"
                  @input="event => setFieldValue('permissions', event.target.value)"
                  placeholder="Enter permissions (comma separated)"
                  class="w-full"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ isSubmitting }">
        <footer class="content-footer">
          <div class="footer-actions">
            <Button
              @click="handleCancel"
              label="Cancel"
              severity="secondary"
              :disabled="isSubmitting"
              class="mr-2"
            />
            <Button
              type="submit"
              label="Create Role"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            />
          </div>
        </footer>
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROLE_API_ROUTES } from '../../router/roleRoutes'
import { useAlert } from '../../composables/useAlert'
import { roleService } from '../../services/roleService'

// PrimeVue components
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

import FormContainer from '../../components/FormContainer.vue'

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

// Handle form submission
const handleSubmit = async (data) => {
  try {
    // If permissions is provided, convert to array
    if (data.permissions) {
      data.permissions = data.permissions.split(',').map(p => p.trim()).filter(p => p)
    }

    // Create role using our service
    await roleService.createRole(data)

    // Redirect to role list page
    router.push({ name: 'RoleList' })

    // Show success message
    alertSuccess('Success', 'Role created successfully!')
  } catch (error) {
    console.error('Error creating role:', error)
    alertError('Error', 'Failed to create role')
  }
}

// Handle cancel
const handleCancel = () => {
  router.push({ name: 'RoleList' })
}
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