<template>
  <div class="card">
    <FormContainer
      title="Edit User"
      :initial-data="initialFormData"
      :endpoint="API.UPDATE(userId)"
      @success="handleSuccess"
      @error="handleError"
    >
      <FormInput name="username" rules="required" disabled hint="Username cannot be changed" col="6" />
      <FormInput name="name" rules="required" col="6" />
      <FormInput name="email" rules="required" type="email" col="12" />

      <FormInput name="password" type="password" label="New Password (leave blank to keep current)" rules="min:6" placeholder="Enter new password" col="6" />
      <FormInput rules="confirmed:password" name="password_confirmation" type="password" col="6" />

      <FormSelect
        name="role"
        endpoint="roles"
        rules="required"
        searchable
        option-label="name"
        option-value="id"
        col="6"
        label="Role"
      />

      <template #footer="{ isSubmitting }">
        <div class="form-actions">
          <Button button-type="button" variant="secondary" @click="handleCancel" text="Button.back" />
          <Button button-type="submit" variant="primary" text="Button.update" loadingText="Saving..." :disabled="isSubmitting" />
        </div>
      </template>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlert } from '../../composables/useAlert'
import { UserModel } from '../../models'
import { ROUTES, API } from '../../router/userRoutes'
import { http } from '../../stores/http'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import Button from '../../components/Button.vue'
import FormSelect from '../../components/FormSelect.vue'

const route = useRoute()
const router = useRouter()
const { alertSuccess, alertError } = useAlert()

const userId = route.params.id
const initialFormData = ref(UserModel.createEmpty())

// Load user data on mount
onMounted(async () => {
  if (userId) {
    try {
      // Directly fetch user data using http client
      const response = await http.get(API.SHOW(userId))

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
      // Error loading user
      router.push({ name: ROUTES.LIST })
    }
  }
})

function handleSuccess(response) {
  alertSuccess('Success', 'User updated successfully!')
  router.push({ name: ROUTES.LIST })
}

function handleError(error) {
  alertError('Error', 'Failed to update user')
}

function handleCancel() {
  router.push({ name: ROUTES.LIST })
}
</script>