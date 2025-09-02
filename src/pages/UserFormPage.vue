/**
 * User Form Page
 *
 * Dedicated page for creating and editing users with ultra-minimal FormInput components
 */

<template>
  <div class="user-form-page">
    <div class="page-header">
      <h2>{{ isEditing ? 'Edit User' : 'Create New User' }}</h2>
      <FormButton
        variant="secondary"
        @click="handleCancel"
        text="← Back to Users"
      />
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <FormInput
          name="username"
          rules="required|min:3|alpha_num"
          :disabled="isEditing"
          :hint="isEditing ? 'Username cannot be changed' : ''"
        />
        <FormInput name="name" rules="required|min:2" />
        <FormInput name="email" type="email" rules="required|email" />
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

        <div class="form-row">
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
        </div>

        <div class="form-actions">
          <FormButton
            type="submit"
            variant="success"
            :text="isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')"
            block
          />
          <FormButton
            type="button"
            variant="secondary"
            @click="handleCancel"
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
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'
import FormButton from '../components/FormButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  resetForm,
  setFormData,
  submitForm
} = useFormValidation()

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

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''
formData.password = ''
formData.password_confirmation = ''
formData.role = 'user'
formData.status = 'active'

// Methods
const loadUser = async () => {
  if (isEditing && userId) {
    try {
      const result = await userStore.getUserById(userId)
      if (result.success && result.data) {
        const user = result.data
        setFormData({
          username: user.username || '',
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'active',
          password: '',
          password_confirmation: ''
        })
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

const handleSubmit = async () => {
  await submitForm(
    async (data) => {
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

      if (isEditing && userId) {
        return await userStore.updateUser(userId, submitData)
      } else {
        return await userStore.createUser(submitData)
      }
    },
    {
      onSuccess: (response) => {
        resetForm()
        router.push('/users')
      }
    }
  )
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
.user-form-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.page-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row > * {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
  white-space: pre-line;
  font-size: 14px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .user-form-page {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .form-container {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>