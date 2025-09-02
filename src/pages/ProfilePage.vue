/**
 * Profile Page
 *
 * User profile management page with view and edit modes
 */

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>Profile</h2>
      <FormButton
        variant="danger"
        @click="handleLogout"
        text="Logout"
      />
    </div>

    <div class="profile-content">
      <!-- View Mode -->
      <div v-if="!editMode" class="profile-view">
        <div class="profile-info">
          <div class="info-item" v-for="(value, key) in displayData" :key="key">
            <label>{{ formatLabel(key) }}:</label>
            <span>{{ value || 'Not provided' }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <FormButton
            variant="primary"
            @click="toggleEditMode"
            text="Edit Profile"
          />
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="profile-edit">
        <div class="edit-form">
          <form @submit.prevent="handleUpdateProfile">
            <FormInput
              name="username"
              hint="Username cannot be changed"
              disabled
            />
            <FormInput name="name" rules="required|min:2" />
            <FormInput name="email" type="email" rules="required|email" />

            <div class="form-actions">
              <FormButton
                type="submit"
                variant="success"
                :loading="isSubmitting"
                :text="isSubmitting ? 'Saving...' : 'Save Changes'"
                block
              />
              <FormButton
                type="button"
                variant="secondary"
                @click="cancelEdit"
                text="Cancel"
                block
              />
            </div>
          </form>

          <div v-if="globalError" class="error-message">
            {{ globalError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  commonRules,
  resetForm,
  setFormData,
  submitForm
} = useFormValidation()

const editMode = ref(false)

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''

// Computed property to get user data for display
const displayData = computed(() => {
  if (!authStore.user) return {}

  return {
    username: authStore.user.username,
    name: authStore.user.name,
    email: authStore.user.email
  }
})

const toggleEditMode = () => {
  editMode.value = true
  // Populate form data with current user data
  setFormData({
    username: authStore.user.username || '',
    name: authStore.user.name || '',
    email: authStore.user.email || ''
  })
}

const cancelEdit = () => {
  editMode.value = false
  resetForm()
}

const handleUpdateProfile = async () => {
  await submitForm(
    async (data) => {
      return await authStore.updateProfile({
        username: data.username,
        name: data.name,
        email: data.email
      })
    },
    {
      onSuccess: () => {
        editMode.value = false
      }
    }
  )
}

const formatLabel = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 15px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
  flex-wrap: wrap;
  gap: 15px;
}

.profile-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
  line-height: 1.4;
}

.profile-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-view {
  padding: 25px;
}

.profile-info {
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 10px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #555;
  min-width: 120px;
  font-size: 14px;
}

.info-item span {
  color: #333;
  flex: 1;
  word-break: break-word;
  font-size: 14px;
}

.profile-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.profile-edit {
  padding: 25px;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  flex-wrap: wrap;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  .profile-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .profile-header h2 {
    font-size: 22px;
    margin-bottom: 10px;
  }

  .profile-view, .profile-edit {
    padding: 20px 15px;
  }

  .info-item {
    flex-direction: column;
    gap: 5px;
    padding: 10px 0;
  }

  .info-item label {
    min-width: auto;
    font-size: 13px;
    color: #666;
  }

  .info-item span {
    font-size: 15px;
    font-weight: 500;
  }

  .profile-actions {
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
}

/* Small mobile screens */
@media (max-width: 480px) {
  .profile-container {
    padding: 8px;
  }

  .profile-content {
    border-radius: 8px;
  }

  .profile-view, .profile-edit {
    padding: 15px 12px;
  }

  .profile-header h2 {
    font-size: 20px;
  }
}
</style>