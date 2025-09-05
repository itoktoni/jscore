<template>
  <div class="role-show-page">
    <div class="page-header">
      <h2>Role Details</h2>
    </div>

    <div class="card w-full max-w-3xl mx-auto">
      <div class="card-header">
        <h3 class="m-0">Role Information</h3>
      </div>
      <div class="card-content">
        <div class="role-details">
          <div class="field mb-4">
            <label class="font-bold block mb-2">Name:</label>
            <div class="detail-value">
              {{ role.name }}
            </div>
          </div>

          <div class="field mb-4">
            <label class="font-bold block mb-2">Description:</label>
            <div class="detail-value">
              {{ role.description || 'No description provided' }}
            </div>
          </div>

          <div class="field mb-4">
            <label class="font-bold block mb-2">Permissions:</label>
            <div class="detail-value">
              <div v-if="Array.isArray(role.permissions) && role.permissions.length > 0">
                <span
                  v-for="(permission, index) in role.permissions"
                  :key="index"
                  class="permission-tag"
                >
                  {{ permission }}
                </span>
              </div>
              <div v-else>
                No permissions assigned
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button
            @click="handleBack"
            class="btn btn-secondary"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { roleService } from '../../services/roleService'

const router = useRouter()
const route = useRoute()
const role = ref({
  name: '',
  description: '',
  permissions: []
})

// Load role data when component mounts
onMounted(async () => {
  try {
    const roleId = route.params.id
    const roleData = await roleService.getRoleById(roleId)
    role.value = roleData
  } catch (error) {
    console.error('Error loading role:', error)
    router.push({ name: 'RoleList' })
  }
})

// Handle back navigation
const handleBack = () => {
  router.push({ name: 'RoleList' })
}
</script>

<style scoped>
.role-show-page {
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

.detail-value {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.permission-tag {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>