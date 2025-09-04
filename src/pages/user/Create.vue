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
import { useSwalNotification } from '../../composables/useSwalNotification'
import Form from './Form.vue'

const router = useRouter()
const userStore = useUserStore()
const { showSuccess } = useSwalNotification()
const formRef = ref(null)

const handleSubmit = async (data) => {
  return await userStore.createUser(data)
}

const handleSuccess = async (response) => {

  showSuccess('Success', 'User created successfully!')

  if (formRef.value)
  {
    formRef.value.resetForm()
  }

  router.push({ name: 'CreateUser' })
}

</script>