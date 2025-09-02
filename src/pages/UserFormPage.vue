<template>
  <div class="card">
    <FormContainer :title="isEditing ? 'Edit User' : 'Create New User'" :action="handleFormSubmit"
      :initial-data="initialFormData">
      <!-- Username and name side by side -->
      <FormInput name="username" rules="required" :disabled="isEditing" :hint="isEditing ? 'Username cannot be changed' : ''" col="6" />
      <FormInput name="name" rules="required" col="6" />

      <!-- Email takes full width -->
      <FormInput name="email" rules="required" type="email" col="12" />

      <!-- Password fields side by side -->
      <FormInput  name="password" type="password"
        :label="isEditing ? 'New Password (leave blank to keep current)' : 'Password'"
        :rules="!isEditing ? 'required|min:6' : 'min:6'"
        :placeholder="isEditing ? 'Enter new password' : 'Enter password'" col="6" />
      <FormInput v-if="!isEditing" rules="required|confirmed" name="password_confirmation" type="password" col="6" />

      <!-- Role and status side by side -->
      <FormSelect name="role" :options="roleOptions" option-label="label" option-value="value" col="6" />
      <FormSelect name="status" :options="statusOptions" option-label="label" option-value="value" col="6" />

      <!-- Using the footer slot for buttons -->
      <template #footer="{ isSubmitting }">
        <div class="footer-actions">
          <FormButton type="button" variant="secondary" text="← Back to Users" @click="handleCancel" />
          <FormButton type="submit" :variant="isEditing ? 'success' : 'primary'"
            :text="isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')" :disabled="isSubmitting"
            />
        </div>

      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import FormContainer from '../components/FormContainer.vue'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'
import FormButton from '../components/FormButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Determine if we're editing based on route params
const isEditing = !!route.params.id
const userId = route.params.id

// Options for FormSelect components
const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Administrator', value: 'admin' },
  { label: 'Moderator', value: 'moderator' }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' }
]

// Initial form data
const initialFormData = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  status: 'active'
})

// Methods
const loadUser = async () => {
  if (isEditing && userId) {
    try {
      const result = await userStore.getUserById(userId)
      if (result.success && result.data) {
        const user = result.data
        const userData = {
          username: user.username || '',
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'active',
          password: '',
          password_confirmation: ''
        }

        // Update initialFormData
        Object.assign(initialFormData.value, userData)
      } else {
        console.error('User not found')
        router.push('/users')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/users')
    }
  }
}

const handleFormSubmit = async (data) => {
  console.log('Form submit called with data:', data)

  // Prepare data for submission
  const submitData = {
    username: data.username.trim(),
    name: data.name.trim(),
    email: data.email.trim(),
    role: data.role,
    status: data.status
  }

  // Add password fields if provided
  if (data.password && data.password.trim()) {
    submitData.password = data.password
    // Only add password_confirmation if it exists (when creating new user)
    if (data.password_confirmation !== undefined) {
      submitData.password_confirmation = data.password_confirmation
    }
  }

  console.log('Submitting data:', submitData)
  let result
  try {
    if (isEditing && userId) {
      console.log('Updating user:', userId)
      result = await userStore.updateUser(userId, submitData)
    } else {
      console.log('Creating new user')
      result = await userStore.createUser(submitData)
    }

    console.log('Submission result:', result)
    if (result && result.success) {
      // Navigate back on success
      console.log('User saved successfully, navigating back to users list')
      router.push('/users')
      return { success: true }
    } else {
      // Return the error result to let the validation composable handle it
      console.log('User save failed:', result)
      return result || { success: false, error: 'Unknown error occurred' }
    }
  } catch (error) {
    console.error('Error during form submission:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

const handleCancel = () => {
  router.push('/users')
}

// Load user data on mount if editing
onMounted(() => {
  if (isEditing) {
    loadUser()
  }
})
</script>

<style scoped>


</style>