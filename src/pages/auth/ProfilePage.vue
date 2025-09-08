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
        <div class="form-actions">
          <Button type="button" variant="secondary" @click="handleLogout" text="Logout" />
          <Button type="submit" variant="success" :text="isSubmitting ? 'Saving...' : 'Save Changes'" :disabled="isSubmitting" />
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
import Button from '../../components/Button.vue'

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