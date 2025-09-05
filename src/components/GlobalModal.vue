<template>
  <div v-if="isVisible" class="modal-overlay" @click="onClose">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="onClose">&times;</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- View Mode -->
        <div v-if="mode === 'view' && data" class="view-mode">
          <div v-if="showAvatar" class="data-avatar-large">
            {{ getInitials(getDisplayName()) }}
          </div>
          <div class="data-info">
            <div v-for="(value, key) in displayedFields" :key="key" class="data-field">
              <p>
                <strong>{{ formatLabel(key) }}:</strong>
                <span v-if="isDateField(key)">{{ formatDate(value) }}</span>
                <span v-else>{{ value || 'N/A' }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Form Mode (Create/Edit) -->
        <div v-else-if="(mode === 'create' || mode === 'edit') && fields" class="form-mode">
          <form @submit.prevent="handleSubmit">
            <div v-for="field in formFields" :key="field.name" class="form-field">
              <!-- Text Input -->
              <FormInput
                v-if="!field.type || field.type === 'text' || field.type === 'email' || field.type === 'password'"
                :name="field.name"
                :label="field.label"
                :type="field.type || 'text'"
                :rules="field.rules"
                :placeholder="field.placeholder"
                :disabled="field.disabled"
              />

              <!-- Select Input -->
              <FormSelect
                v-else-if="field.type === 'select' && field.endpoint"
                :name="field.name"
                :label="field.label"
                :endpoint="field.endpoint"
                :option-label="field.optionLabel || 'name'"
                :option-value="field.optionValue || 'id'"
                :rules="field.rules"
                :searchable="field.searchable"
              />

              <!-- Textarea -->
              <FormInput
                v-else-if="field.type === 'textarea'"
                :name="field.name"
                :label="field.label"
                type="textarea"
                :rules="field.rules"
                :placeholder="field.placeholder"
                :rows="field.rows || 3"
              />
            </div>
          </form>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="loading">
          {{ loadingText }}
        </div>

        <!-- Empty State -->
        <div v-else class="empty">
          No data available
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <slot name="footer">
          <!-- View Mode Buttons -->
          <template v-if="mode === 'view'">
            <FormButton
              variant="secondary"
              text="Close"
              @click="onClose"
            />
            <FormButton
              v-if="showEditButton"
              variant="primary"
              :text="editButtonText"
              @click="switchToEdit"
            />
          </template>

          <!-- Form Mode Buttons -->
          <template v-else-if="mode === 'create' || mode === 'edit'">
            <FormButton
              variant="secondary"
              :text="cancelButtonText"
              @click="onCancel"
              :disabled="submitting"
            />
            <FormButton
              variant="primary"
              :text="submitting ? submittingText : submitButtonText"
              @click="handleSubmit"
              :disabled="submitting"
            />
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormButton from './FormButton.vue'
import FormInput from './FormInput.vue'
import FormSelect from './FormSelect.vue'

// Define props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'view', // 'view', 'create', 'edit'
    validator: (value) => ['view', 'create', 'edit'].includes(value)
  },
  title: {
    type: String,
    default: 'Modal'
  },
  data: {
    type: Object,
    default: null
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
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  editButtonText: {
    type: String,
    default: 'Edit'
  },
  submitButtonText: {
    type: String,
    default: 'Submit'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel'
  },
  submittingText: {
    type: String,
    default: 'Submitting...'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  dateFields: {
    type: Array,
    default: () => ['created_at', 'updated_at', 'date']
  }
})

// Define emits
const emit = defineEmits([
  'close',
  'cancel',
  'submit',
  'edit',
  'update:data',
  'update:isVisible'
])

// Form state
const submitting = ref(false)
const formData = ref({})

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
      } else if (field.name) {
        result[field.name] = props.data[field.name]
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

const formFields = computed(() => {
  return props.fields || []
})

// Watch for data changes
watch(() => props.data, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  }
}, { immediate: true })

// Methods
const onClose = () => {
  emit('close')
  emit('update:isVisible', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:isVisible', false)
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await emit('submit', { ...formData.value })
    submitting.value = false
    emit('update:isVisible', false)
  } catch (error) {
    submitting.value = false
    throw error
  }
}

const switchToEdit = () => {
  emit('edit', props.data)
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

const isDateField = (key) => {
  return props.dateFields.includes(key) || key.endsWith('_at') || key.includes('date')
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

.view-mode {
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

.form-mode .form-field {
  margin-bottom: 1rem;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #666;
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