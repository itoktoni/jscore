/**
 * User Form Page
 *
 * Dedicated page for creating and editing users with FormContainer wrapper
 */

<template>
  <FormContainer
    :title="isEditing ? 'Edit User' : 'Create New User'"
    :initial-data="initialFormData"
    :cancel-text="'← Back to Users'"
    :submit-text="isEditing ? 'Update User' : 'Create User'"
    loading-text="Saving..."
    submit-variant="success"
    :submit-handler="handleFormSubmit"
    @cancel="handleCancel"
    ref="formContainer"
  >
    <template #default="{ formData, fieldErrors, isSubmitting }">
      <!-- Username and name side by side (using default col=6) -->
      <FormInput
        name="username"
        rules="required|min:3|alpha_num"
        :disabled="isEditing"
        :hint="isEditing ? 'Username cannot be changed' : ''"
      />
      <FormInput name="name" rules="required|min:2" />

      <!-- Email takes full width -->
      <FormInput name="email" type="email" rules="required|email" col="12" />

      <!-- Password fields side by side (using default col=6) -->
      <FormInput
        name="password"
        type="password"
        :rules="!isEditing ? 'required|min:6' : 'min:6'"
        :label="isEditing ? 'New Password (leave blank to keep current)' : 'Password'"
        :placeholder="isEditing ? 'Enter new password' : 'Enter password'"
      />
      <FormInput
        v-if="!isEditing"
        name="password_confirmation"
        type="password"
        rules="required|confirmed"
      />

      <!-- Role and status side by side (using default col=6) -->
      <FormSelect
        name="role"
        rules="required"
        :options="roleOptions"
        option-label="label"
        option-value="value"
      />
      <FormSelect
        name="status"
        rules="required"
        :options="statusOptions"
        option-label="label"
        option-value="value"
      />
    </template>
  </FormContainer>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import FormContainer from '../components/FormContainer.vue'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formContainer = ref(null)

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

// Initial form data - reactive ref instead of computed
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

        // Update both initialFormData and form container data
        Object.assign(initialFormData.value, userData)

        // Update form data in the FormContainer
        if (formContainer.value) {
          formContainer.value.setFormData(userData)
        }
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
    if (!isEditing) {
      submitData.password_confirmation = data.password_confirmation
    }
  }

  let result
  if (isEditing && userId) {
    result = await userStore.updateUser(userId, submitData)
  } else {
    result = await userStore.createUser(submitData)
  }

  if (result.success) {
    // Navigate back on success
    router.push('/users')
    return result
  } else {
    // Return the error result to let the validation composable handle it
    return result
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
/* Additional styles if needed */
</style>