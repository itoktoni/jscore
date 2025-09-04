<template>
  <div class="card">
    <FormContainer
      title="Edit User"
      :initial-data="initialFormData"
      :action="handleSubmit"
      @success="handleSuccess"
      @error="handleError"
    >
      <FormInput name="username" rules="required" disabled hint="Username cannot be changed" col="6" />
      <FormInput name="name" rules="required" col="6" />
      <FormInput name="email" rules="required" type="email" col="12" />

      <FormInput name="password" type="password" label="New Password (leave blank to keep current)" rules="min:6" placeholder="Enter new password" col="6" />
      <FormInput rules="confirmed:password" name="password_confirmation" type="password" col="6" />

      <ApiSelect name="role" endpoint="roles" rules="required" searchable option-label="name" option-value="id" col="6" label="Role" />

      <template #footer="{ isSubmitting }">
        <div class="footer-actions">
          <FormButton type="button" variant="secondary" @click="handleCancel" text="← Back" />
          <FormButton type="submit" variant="success" :text="isSubmitting ? 'Saving...' : 'Update'" :disabled="isSubmitting" />
        </div>
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useSwalNotification } from '../../composables/useSwalNotification'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import ApiSelect from '../../components/ApiSelect.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { showSuccess, showError } = useSwalNotification()

const userId = route.params.id
const initialFormData = ref({})

// Load user data on mount
onMounted(async () => {
  if (userId) {
    try {
      const result = await userStore.fetchUserById(userId)
      if (result && result.success && result.data) {
        // Load data directly from API response
        initialFormData.value = result.data
        // Clear password fields for security
        initialFormData.value.password = ''
        initialFormData.value.password_confirmation = ''
      }
    } catch (error) {
      // Error loading user
      router.push({ name: 'UserList' })
    }
  }
})

const handleSubmit = async (data) =>
{
  return await userStore.updateUser(userId, data)
}

const handleSuccess = (response) =>
{
  showSuccess('Success', 'User updated successfully!')

  router.push({ name: 'UserList' })
}

const handleError = (error) =>
{
  showError('Error', 'Failed to update user')
}

const handleCancel = () =>
{
  router.push({ name: 'UserList' })
}
</script>