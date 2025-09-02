/**
 * ConfirmModal Component
 *
 * Reusable confirmation modal for dangerous actions
 */

<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal confirm-modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="$emit('cancel')" class="close-button">&times;</button>
      </div>
      <div class="modal-content">
        <p>{{ message }}</p>
        <p v-if="warning" class="warning">{{ warning }}</p>
        <div class="modal-actions">
          <FormButton
            variant="danger"
            @click="$emit('confirm')"
            text="Confirm"
          />
          <FormButton
            variant="secondary"
            @click="$emit('cancel')"
            text="Cancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormButton from './FormButton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  warning: {
    type: String,
    default: ''
  }
})

defineEmits(['confirm', 'cancel'])
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

.confirm-modal {
  max-width: 400px;
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

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.warning {
  color: #dc3545;
  font-size: 14px;
  margin: 10px 0;
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