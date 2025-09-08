/**
 * UserDetailModal Component
 *
 * Modal for displaying detailed user information
 */

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>User Details</h3>
        <button @click="$emit('close')" class="close-button">&times;</button>
      </div>
      <div class="modal-content">
        <div v-if="user" class="user-detail">
          <div class="detail-item">
            <label>ID:</label>
            <span>{{ user.id }}</span>
          </div>
          <div class="detail-item">
            <label>Username:</label>
            <span>{{ user.username }}</span>
          </div>
          <div class="detail-item">
            <label>Name:</label>
            <span>{{ user.name || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>{{ user.email || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Role:</label>
            <span>{{ user.role || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span>{{ user.status || 'Not provided' }}</span>
          </div>
          <div class="detail-item">
            <label>Created:</label>
            <span>{{ formatDate(user.created_at) }}</span>
          </div>
          <div class="detail-item">
            <label>Updated:</label>
            <span>{{ formatDate(user.updated_at) }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <Button
            button-type="button"
            variant="primary"
            @click="$emit('edit', user)"
            text="Edit User"
          />
          <Button
            button-type="button"
            variant="secondary"
            @click="$emit('close')"
            text="Close"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'close'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

.modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #f8f9fa;
  border-radius: 50%;
}

.modal-content {
  padding: 20px;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-item label {
  font-weight: 600;
  color: #555;
  min-width: 100px;
}

.detail-item span {
  color: #333;
  word-break: break-word;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>