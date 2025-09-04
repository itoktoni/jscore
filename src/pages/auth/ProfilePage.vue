/**
 * Profile Page
 *
 * User profile management page with view and edit modes using FormContainer
 */

<template>
  <div class="card">
    <div class="page-header">
      <h2>Profile</h2>
    </div>

    <!-- View Mode -->
    <div v-if="!editMode" class="form-container">
      <div class="page-header">
        <h2>Profile Information</h2>
        <p>Your account details and information</p>
      </div>

      <div class="profile-info">
        <div class="info-item" v-for="(value, key) in displayData" :key="key">
          <label>{{ formatLabel(key) }}:</label>
          <span>{{ value || 'Not provided' }}</span>
        </div>
      </div>

      <footer class="content-footer">
        <div class="footer-actions">
          <div></div> <!-- Empty div for spacing -->
          <FormButton
            variant="primary"
            @click="toggleEditMode"
            text="Edit Profile"
          />
        </div>
      </footer>
    </div>

    <!-- Edit Mode -->
    <FormContainer
      v-else
      title="Edit Profile"
      subtitle="Update your account information"
      :initial-data="initialFormData"
      cancel-text="Cancel"
      submit-text="Save Changes"
      loading-text="Saving..."
      submit-variant="success"
      :submit-handler="handleUpdateProfile"
      @cancel="cancelEdit"
      ref="formContainer"
    >
      <template #default="{ formData, fieldErrors, isSubmitting }">
        <FormInput
          name="username"
          hint="Username cannot be changed"
          disabled
          col="12"
        />
        <FormInput name="name" rules="required|min:2" col="12" />
        <FormInput name="email" type="email" rules="required|email" col="12" />
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const formContainer = ref(null)

const editMode = ref(false)

// Computed property to get user data for display
const displayData = computed(() => {
  if (!authStore.user) return {}

  return {
    username: authStore.user.username,
    name: authStore.user.name,
    email: authStore.user.email
  }
})

// Initial form data for editing
const initialFormData = ref({
  username: '',
  name: '',
  email: ''
})

const toggleEditMode = () => {
  editMode.value = true
  // Populate form data with current user data
  const userData = {
    username: authStore.user.username || '',
    name: authStore.user.name || '',
    email: authStore.user.email || ''
  }

  // Update both initialFormData and form container
  Object.assign(initialFormData.value, userData)

  // Set form data in FormContainer (will be available after next tick)
  setTimeout(() => {
    if (formContainer.value) {
      formContainer.value.setFormData(userData)
    }
  }, 0)
}

const cancelEdit = () => {
  editMode.value = false
  // Reset form data
  if (formContainer.value) {
    formContainer.value.resetForm()
  }
}

const handleUpdateProfile = async (data) => {
  const result = await authStore.updateProfile({
    username: data.username,
    name: data.name,
    email: data.email
  })

  if (result.success) {
    // Exit edit mode on success
    editMode.value = false
    return result
  } else {
    // Return error for FormContainer to handle
    return result
  }
}

const formatLabel = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
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