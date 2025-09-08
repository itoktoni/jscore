<template>
  <div class="user-management">
    <div class="page-header">
      <h2>User Management</h2>
      <Button
        button-type="button"
        variant="primary"
        text="Create User"
        @click="showCreateModal = true"
      />
    </div>

    <!-- User Create Modal -->
    <UserCreateModal
      :is-visible="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- User List would go here -->
    <div class="user-list-placeholder">
      <p>User list would be displayed here</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCreateModal from './UserCreateModal.vue'
import Button from '../../components/Button.vue'

// Modal visibility
const showCreateModal = ref(false)

// Methods
const handleUserCreated = (userData) => {
  console.log('User created:', userData)
  // Here you would typically refresh the user list or update the UI
}
</script>

<style scoped>
.user-management {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.user-list-placeholder {
  text-align: center;
  padding: 2rem;
  color: #666;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>