<template>
  <GlobalModal :show="true" @close="handleClose" size="medium">
    <template #header>
      <h2>Role Details</h2>
    </template>

    <template #default>
      <div v-if="role" class="role-details">
        <div class="detail-row">
          <label>Name:</label>
          <span>{{ role.name }}</span>
        </div>

        <div class="detail-row">
          <label>Description:</label>
          <span>{{ role.description || 'N/A' }}</span>
        </div>

        <div class="detail-row">
          <label>Permissions:</label>
          <span v-if="Array.isArray(role.permissions) && role.permissions.length > 0">
            {{ role.permissions.join(', ') }}
          </span>
          <span v-else-if="typeof role.permissions === 'string' && role.permissions">
            {{ role.permissions }}
          </span>
          <span v-else>N/A</span>
        </div>

        <div class="detail-row">
          <label>Created At:</label>
          <span>{{ formatDate(role.created_at) || 'N/A' }}</span>
        </div>

        <div class="detail-row">
          <label>Updated At:</label>
          <span>{{ formatDate(role.updated_at) || 'N/A' }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="modal-actions">
        <FormButton variant="secondary" @click="handleClose" text="Close" />
        <FormButton variant="primary" @click="handleEdit" text="Edit" />
      </div>
    </template>
  </GlobalModal>
</template>

<script setup>
import { computed } from 'vue'
import GlobalModal from '../../components/GlobalModal.vue'
import FormButton from '../../components/FormButton.vue'

const props = defineProps({
  role: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const handleClose = () => {
  emit('close')
}

const handleEdit = () => {
  emit('edit', props.role)
}

const formatDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.role-details {
  padding: 1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-row label {
  font-weight: bold;
  min-width: 120px;
  margin-right: 1rem;
}

.detail-row span {
  flex: 1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}
</style>