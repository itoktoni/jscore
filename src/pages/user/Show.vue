<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>User Details</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="user" class="user-details">
          <div class="user-avatar-large">
            {{ getInitials(user.name || user.username) }}
          </div>
          <div class="user-info">
            <p><strong>Name:</strong> {{ user.name || 'N/A' }}</p>
            <p><strong>Username:</strong> @{{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email || 'N/A' }}</p>
            <p><strong>Role:</strong> {{ user.role || 'user' }}</p>
            <p><strong>Status:</strong> {{ user.status || 'active' }}</p>
            <p><strong>Created:</strong> {{ formatDate(user.created_at) }}</p>
            <p><strong>Last Updated:</strong> {{ formatDate(user.updated_at) }}</p>
          </div>
        </div>
        <div v-else class="loading">
          Loading user details...
        </div>
      </div>
      <div class="modal-footer">
        <FormButton
          variant="secondary"
          text="Close"
          @click="closeModal"
        />
        <FormButton
          variant="primary"
          text="Edit User"
          @click="editUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FormButton from '../../components/FormButton.vue'

// Define props
const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

// Define emits
const emit = defineEmits(['close', 'edit'])

const router = useRouter()

// Methods
const closeModal = () => {
  emit('close')
}

const editUser = () => {
  if (props.user && props.user.id) {
    closeModal()
    router.push(`/users/${props.user.id}/edit`)
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.user-info {
  width: 100%;
}

.user-info p {
  margin: 0.5rem 0;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.user-info p:last-child {
  border-bottom: none;
}

.user-info strong {
  display: inline-block;
  width: 120px;
  color: #555;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .user-info strong {
    width: 100px;
  }
}
</style>