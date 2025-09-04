<template>
  <div class="card">
    <FormContainer
      ref="formRef"
      title="Create New User"
      :initial-data="initialFormData"
      :action="handleSubmit"
      @success="handleSuccess"
      @error="handleError">

      <FormInput name="username" rules="required" hint="Username cannot be changed" col="6" />
      <FormInput name="name" rules="required" col="6" />
      <FormInput name="email" rules="required" type="email" col="12" />

      <FormInput name="password" type="password" rules="required|min:6" col="6" />
      <FormInput rules="required|confirmed:password" name="password_confirmation" type="password" col="6" />

      <ApiSelect name="role" endpoint="roles" rules="required" searchable option-label="name" option-value="id" col="6" label="Role" />

      <template #footer="{ isSubmitting }">
        <div class="footer-actions">
          <FormButton type="button" variant="secondary" @click="handleCancel" text="← Back" />
          <FormButton type="submit" variant="primary" :text="isSubmitting ? 'Saving...' : 'Create'" :disabled="isSubmitting" />
        </div>
      </template>

    </FormContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useSwalNotification } from '../../composables/useSwalNotification'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import ApiSelect from '../../components/ApiSelect.vue'

const router = useRouter()
const userStore = useUserStore()
const { showSuccess, showError } = useSwalNotification()
const formRef = ref(null)

const initialFormData = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: ''
})

const handleSubmit = async (data) => {
  return await userStore.createUser(data)
}

const handleSuccess = async (response) => {
  showSuccess('Success', 'User created successfully!')

  if (formRef.value) {
    formRef.value.resetForm()
  }

  router.push({ name: 'CreateUser' })
}

const handleError = (error) => {
  showError('Error', 'Failed to create user')
}

const handleCancel = () => {
  router.push({ name: 'UserList' })
}
</script>