<template>
  <div class="card">
    <Form
      title="Edit User"
      :is-editing="true"
      :initial-data="initialFormData"
      :on-submit="handleSubmit"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useSwalNotification } from '../../composables/useSwalNotification'
import Form from './Form.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { showSuccess } = useSwalNotification()

const userId = route.params.id
const initialFormData = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  status: 'active'
})

// Load user data on mount
onMounted(async () => {
  if (userId) {
    try {
      const result = await userStore.fetchUserById(userId)
      if (result && result.success && result.data) {
        const user = result.data
        initialFormData.value = {
          username: user.username || '',
          name: user.name || '',
          email: user.email || '',
          password: '',
          password_confirmation: '',
          role: user.role || 'user',
          status: user.status || 'active'
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
      router.push({ name: 'UserManagement' })
    }
  }
})

const handleSubmit = async (data) => {
  // Directly submit all form data to the API
  return await userStore.updateUser(userId, data)
}

const handleSuccess = (response) => {
  // Show success notification manually
  showSuccess('Success', 'User updated successfully!')

  // Navigate back to user list on success
  router.push({ name: 'UserList' })
}

const handleError = (error) => {
  // Log error for debugging
  console.error('Update user error:', error)
}

const handleCancel = () => {
  // Always navigate to the user list
  router.push({ name: 'UserList' })
}
</script>

<style scoped>
</style>