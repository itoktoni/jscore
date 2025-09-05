<template>
  <div class="role-edit-page">
    <div class="page-header">
      <h2>Edit Role</h2>
    </div>

    <div class="card w-full max-w-3xl mx-auto">
      <div class="card-header">
        <h3 class="m-0">Role Information</h3>
      </div>
      <div class="card-content">
        <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4">
          <div class="field mb-4">
            <label for="name" class="font-bold block mb-2">Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Enter role name"
              class="form-input"
              required
            />
            <div v-if="errors.name" class="error-message">
              {{ errors.name }}
            </div>
          </div>

          <div class="field mb-4">
            <label for="description" class="font-bold block mb-2">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Enter role description"
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="field mb-4">
            <label for="permissions" class="font-bold block mb-2">Permissions</label>
            <input
              id="permissions"
              v-model="form.permissions"
              type="text"
              placeholder="Enter permissions (comma separated)"
              class="form-input"
            />
          </div>

          <div class="form-actions">
            <button
              @click="handleCancel"
              type="button"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ROLE_ROUTES } from '../../router/roleRoutes'
import { roleService } from '../../services/roleService'
import { useAlert } from '../../composables/useAlert'

const router = useRouter()
const route = useRoute()
const { alertSuccess, alertError } = useAlert()

// Form data
const form = reactive({
  name: '',
  description: '',
  permissions: ''
})

// Form errors
const errors = ref({})

// Load role data when component mounts
onMounted(async () => {
  try {
    const roleId = route.params.id
    const role = await roleService.getRoleById(roleId)

    // Set form values
    form.name = role.name
    form.description = role.description
    form.permissions = Array.isArray(role.permissions)
      ? role.permissions.join(', ')
      : role.permissions || ''
  } catch (error) {
    console.error('Error loading role:', error)
    alertError('Error', 'Failed to load role data')
    router.push({ name: ROLE_ROUTES.ROLE_LIST })
  }
})

// Validate form
const validateForm = () => {
  const newErrors = {}

  if (!form.name) {
    newErrors.name = 'Name is required.'
  } else if (form.name.length < 2) {
    newErrors.name = 'Name must be at least 2 characters.'
  } else if (form.name.length > 50) {
    newErrors.name = 'Name must not exceed 50 characters.'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
const onFormSubmit = async () => {
  if (validateForm()) {
    try {
      const roleId = route.params.id

      // Process permissions if provided
      let permissions = form.permissions
      if (permissions) {
        permissions = permissions.split(',').map(p => p.trim()).filter(p => p)
      }

      // Create role data object
      const roleData = {
        name: form.name,
        description: form.description,
        permissions: permissions || []
      }

      // Update role using our service
      await roleService.updateRole(roleId, roleData)

      // Show success message
      alertSuccess('Success', 'Role updated successfully!')

      // Redirect to role list page
      router.push({ name: ROLE_ROUTES.ROLE_LIST })
    } catch (error) {
      console.error('Error updating role:', error)
      alertError('Error', 'Failed to update role')
    }
  }
}

// Handle cancel
const handleCancel = () => {
  router.push({ name: ROLE_ROUTES.ROLE_LIST })
}
</script>

<style scoped>
.role-edit-page {
  padding: 1rem;
}

.page-header {
  margin-bottom: 1rem;
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.card-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
  margin-bottom: 1rem;
}

.card-content {
  padding: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
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

.font-bold {
  font-weight: bold;
}

.block {
  display: block;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>