<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="data" class="data-details">
          <div v-if="showAvatar" class="data-avatar-large">
            {{ getInitials(getDisplayName()) }}
          </div>
          <div class="data-info">
            <div v-for="(value, key) in displayedFields" :key="key" class="data-field">
              <p>
                <strong>{{ formatLabel(key) }}:</strong>
                <span v-if="key === 'created_at' || key === 'updated_at'">{{ formatDate(value) }}</span>
                <span v-else>{{ value || 'N/A' }}</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="loading">
          Loading details...
        </div>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <FormButton
            variant="secondary"
            text="Close"
            @click="closeModal"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FormButton from './FormButton.vue'

// Define props
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Details'
  },
  fields: {
    type: Array,
    default: () => []
  },
  showAvatar: {
    type: Boolean,
    default: false
  },
  nameField: {
    type: String,
    default: 'name'
  },
  usernameField: {
    type: String,
    default: 'username'
  }
})

// Define emits
const emit = defineEmits(['close'])

// Computed properties
const displayedFields = computed(() => {
  if (!props.data) return {}

  if (props.fields && props.fields.length > 0) {
    const result = {}
    props.fields.forEach(field => {
      if (typeof field === 'string') {
        result[field] = props.data[field]
      } else if (field.key && field.label) {
        result[field.key] = props.data[field.key]
      }
    })
    return result
  }

  // Default: return all fields except id and any fields that look like internal data
  const result = {}
  Object.keys(props.data).forEach(key => {
    if (key !== 'id' && !key.startsWith('_') && !key.endsWith('_at')) {
      result[key] = props.data[key]
    }
  })
  return result
})

// Methods
const closeModal = () => {
  emit('close')
}

const getDisplayName = () => {
  if (!props.data) return '?'
  return props.data[props.nameField] || props.data[props.usernameField] || '?'
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

const formatLabel = (key) => {
  // Convert camelCase to Title Case
  return key.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
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

.data-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.data-avatar-large {
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

.data-info {
  width: 100%;
}

.data-field p {
  margin: 0.5rem 0;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-field p:last-child {
  border-bottom: none;
}

.data-field strong {
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

  .data-field strong {
    width: 100px;
  }
}
</style>