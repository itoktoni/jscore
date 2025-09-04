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

      <FormSelectApi name="role" endpoint="roles" rules="required" searchable option-label="name" option-value="id" col="6" label="Role" />

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
// Removed useUserStore import
import { useAlert } from '../../composables/useAlert'
import { useResponse } from '../../composables/useResponse'
import { UserModel } from '../../models'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import FormSelectApi from '../../components/FormSelectApi.vue'

const route = useRoute()
const router = useRouter()
// Removed userStore reference
const { alertSuccess, alertError } = useAlert()
const { responseSuccess, responseError } = useResponse()

const userId = route.params.id
const initialFormData = ref(UserModel.createEmpty())

// Load user data on mount
onMounted(async () => {
  if (userId) {
    try {
      // Directly fetch user data using http client
      const response = await http.get(USER_API_ROUTES.show(userId))

      // Handle the response structure properly
      // API returns data in response.data.data or response.data
      const userData = response.data.data || response.data

      if (userData) {
        // Load data directly from API response
        initialFormData.value = userData
        // Clear password fields for security
        initialFormData.value.password = ''
        initialFormData.value.password_confirmation = ''
      }
    } catch (error) {
      console.error('Error loading user:', error)
      // Error loading user
      router.push({ name: USER_ROUTES.USER_LIST })
    }
  }
})

async function handleSubmit(data) {
  try {

    // Make API request to update user
    const response = await http.post(USER_API_ROUTES.update(userId), data)

    // Handle response structure properly
    const resultData = response.data.data || response.data
    return responseSuccess(resultData)
  } catch (error) {
    return responseError(error)
  }
}

function handleSuccess(response) {
  alertSuccess('Success', 'User updated successfully!')
  router.push({ name: USER_ROUTES.USER_LIST })
}

function handleError(error) {
  alertError('Error', 'Failed to update user')
}

function handleCancel() {
  router.push({ name: USER_ROUTES.USER_LIST })
}
</script>