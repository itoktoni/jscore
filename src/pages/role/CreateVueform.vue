<template>
  <div class="role-create-page">
    <div class="page-header">
      <h2>Create Role (Vueform)</h2>
    </div>

    <div class="card w-full max-w-3xl mx-auto">
      <div class="card-header">
        <h3 class="m-0">Role Information</h3>
      </div>
      <div class="card-content">
        <Vueform
          :endpoint="ROLE_API_ROUTES.create"
          @success="handleSuccess"
          @error="handleError"
        >
          <TextElement
            name="name"
            label="Name *"
            placeholder="Enter role name"
            :rules="['required', 'min:2', 'max:50']"
            required
          />

          <TextareaElement
            name="description"
            label="Description"
            placeholder="Enter role description"
            rows="3"
          />

          <TextElement
            name="permissions"
            label="Permissions"
            placeholder="Enter permissions (comma separated)"
          />

        <ButtonElement name="submit" submits>
            Submit
        </ButtonElement>

        </Vueform>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Vueform components

import { ROLE_ROUTES, ROLE_API_ROUTES } from '../../router/roleRoutes'
import { useAlert } from '../../composables/useAlert'

const router = useRouter()
const { alertSuccess, alertError } = useAlert()

// Handle form submission success
const handleSuccess = (response) => {
  alertSuccess('Success', 'Role created successfully!')
  router.push({ name: ROLE_ROUTES.ROLE_LIST })
}

// Handle form submission error
const handleError = (error) => {
  console.error('Error creating role:', error)
  alertError('Error', 'Failed to create role')
}

// Handle cancel
const handleCancel = () => {
  router.push({ name: ROLE_ROUTES.ROLE_LIST })
}
</script>

<style scoped>
.role-create-page {
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

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 0.5rem;
}
</style>