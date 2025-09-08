<template>
  <div class="card">
    <FormContainer
      ref="formRef"
      title="Create New User"
      :endpoint="USER_API_ROUTES.create"
      @success="handleSuccess"
      @error="handleError">

      <FormInput name="username" rules="required" hint="Username cannot be changed" col="6" />
      <FormInput name="name" rules="required" col="6" />
      <FormInput name="email" rules="required" type="email" col="12" />

      <FormInput name="password" type="password" rules="required|min:6" col="6" />
      <FormInput rules="required|confirmed:password" name="password_confirmation" type="password" col="6" />

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
          <Button button-type="submit" variant="primary" text="Button.create" loadingText="Saving..." :disabled="isSubmitting" />
        </div>
      </template>

    </FormContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'

import { useAlert } from '../../composables/useAlert'

import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import Button from '../../components/Button.vue'
import FormSelect from '../../components/FormSelect.vue'

const { alertSuccess, alertError } = useAlert()

const router = useRouter()
const formRef = ref(null)

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