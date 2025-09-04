<template>
  <div class="card">
    <FormContainer
      title="Profile"
      subtitle="Your account details and information"
      :initial-data="initialFormData"
      :action="handleUpdateProfile"
      @success="handleSuccess"
      @error="handleError"
    >
      <FormInput name="username" rules="required" disabled hint="Username cannot be changed" col="12" />
      <FormInput name="name" rules="required|min:2" col="12" />
      <FormInput name="email" type="email" rules="required|email" col="12" />

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
import { useAlert } from '../../composables/useAlert'
import { useResponse } from '../../composables/useResponse'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { alertSuccess, alertError } = useAlert()
const { responseSuccess, responseError } = useResponse()

const initialFormData = ref({
  username: '',
  name: '',
  email: ''
})

// Load user data on mount
onMounted(async () => {
  try {
    // Load user profile data
    await authStore.loadProfile()

    if (authStore.user) {
      // Populate form data with current user data
      initialFormData.value = {
        username: authStore.user.username || '',
        name: authStore.user.name || '',
        email: authStore.user.email || ''
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    alertError('Error', 'Failed to load profile data')
  }
})

async function handleUpdateProfile(data) {
  try {
    const result = await authStore.updateProfile(data)

    if (result.success) {
      return responseSuccess({ message: 'Profile updated successfully' })
    } else {
      return responseError(new Error(result.error || 'Failed to update profile'))
    }
  } catch (error) {
    return responseError(error)
  }
}

function handleSuccess(response) {
  alertSuccess('Success', 'Profile updated successfully!')
}

function handleError(error) {
  alertError('Error', 'Failed to update profile')
}

async function handleLogout() {
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