<template>
  <div class="card">
    <Form
      ref="formRef"
      title="Create New User"
      :is-editing="false"
      :on-submit="handleSubmit"
      :on-success="handleSuccess"
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

  // Reset form using the simplified approach
  if (formRef.value) {
    formRef.value.resetForm()
  }

  // Navigate back to user list on success using route name
  router.push({ name: 'UserManagement' })
}

</script>

<style scoped>
</style>