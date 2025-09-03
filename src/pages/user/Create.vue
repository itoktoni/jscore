<template>
  <div class="card">
    <Form
      ref="formRef"
      title="Create New User"
      :is-editing="false"
      :on-submit="handleSubmit"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import Form from './Form.vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)

const handleSubmit = async (data) => {
  console.log('Form submit called with data:', data)
  // Directly submit all form data to the API
  return await userStore.createUser(data)
}

const handleSuccess = async (response) => {
  console.log('Form submit success:', response)

  // Add a small delay to ensure any pending operations complete
  setTimeout(() => {
    formRef.value?.resetForm?.()
  }, 10)

  // Navigate back to user list on success
  router.push('/users/create')
}

const handleError = (error) => {
  console.log('Form submit error:', error)
  // Log error for debugging
  console.error('Create user error:', error)
}

const handleCancel = () => {
  console.log('Form cancel called')
  // Always navigate to the user list
  router.push('/users')
}
</script>

<style scoped>
</style>