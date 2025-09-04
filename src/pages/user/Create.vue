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

      <FormSelectApi name="role" endpoint="roles" rules="required" searchable option-label="name" option-value="id" col="6" label="Role" />

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
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'

import { useAlert } from '../../composables/useAlert'
import { useResponse } from '../../composables/useResponse'

import { UserModel } from '../../models'

import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import FormSelectApi from '../../components/FormSelectApi.vue'

const { alertSuccess, alertError } = useAlert()
const { responseSuccess, responseError } = useResponse()

const router = useRouter()
const formRef = ref(null)

const initialFormData = ref(UserModel.createEmpty())

async function handleSubmit(data) {
  try {
    // Prepare user data for API (remove password_confirmation)

    // Make API request
    const response = await http.post(USER_API_ROUTES.create, data)

    // Return success response
    return responseSuccess(response)
  } catch (error) {
    return responseError(error)
  }
}

function handleSuccess(response) {
  alertSuccess('Success', 'User created successfully!')
  router.push({ name: USER_ROUTES.USER_LIST })
}

function handleError(error) {
  alertError('Error', 'Failed to create user')
}

function handleCancel() {
  router.push({ name: USER_ROUTES.USER_LIST })
}
</script>