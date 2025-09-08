<template>
  <div class="card">
    <FormContainer
      title="Profile"
      :initial-data="initialFormData"
      endpoint="/profile"
      method="post"
      @success="handleSuccess"
      @error="handleError"
    >
      <FormInput name="username" rules="required" disabled hint="Username cannot be changed" col="6" />
      <FormInput name="name" rules="required" col="6" />
      <FormInput name="email" rules="required" type="email" col="12" />

      <FormInput name="password" type="password" label="New Password (leave blank to keep current)" rules="min:6" placeholder="Enter new password" col="6" />
      <FormInput rules="confirmed:password" name="password_confirmation" type="password" col="6" />

      <template #footer="{ isSubmitting }">
        <div class="footer-actions">
          <FormButton type="button" variant="secondary" @click="handleLogout" text="Logout" />
          <FormButton type="submit" variant="success" :text="isSubmitting ? 'Saving...' : 'Save Changes'" :disabled="isSubmitting" />
        </div>
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useUser } from '../../stores/user'
import { useAlert } from '../../composables/useAlert'
import { http } from '../../stores/http'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUser()
const { alertSuccess, alertError } = useAlert()

const initialFormData = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// Load user data on mount
onMounted(async () => {
  try {
    // Load user profile data if not already loaded
    if (!userStore.user) {
      await userStore.loadProfile()
    }

    if (userStore.user) {
      // Load data directly from user store
      initialFormData.value = {
        ...userStore.user,
        password: '',
        password_confirmation: ''
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    alertError('Error', 'Failed to load profile data')
  }
})

function handleSuccess(response) {
  alertSuccess('Success', 'Profile updated successfully!')

  // Update user store with new data
  if (response.data && response.data.data) {
    userStore.user = response.data.data
  }
}

function handleError(error) {
  alertError('Error', 'Failed to update profile')
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-edit-page {
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

.field-hint {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
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
</style>