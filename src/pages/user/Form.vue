<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import ApiSelect from '../../components/ApiSelect.vue'
import { useFormValidation } from '../../composables/useFormValidation.js'

// Define ref for FormContainer
const formContainerRef = ref(null)

// Use form validation composable
const { resetForm: resetValidationForm } = useFormValidation()

// Define props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onSuccess: {
    type: Function,
    required: true
  },
  onError: {
    type: Function,
    default: (error) => {
      console.log('Form error:', error)
    }
  },
  onCancel: {
    type: Function,
    default: () => {
      console.log('Form cancel triggered')
    }
  },
  // Success notification props
  showSuccessNotification: {
    type: Boolean,
    default: true
  },
  successMessage: {
    type: String,
    default: 'Form submitted successfully!'
  },
  successNotificationTimer: {
    type: Number,
    default: 3000
  }
})

// Watch for initialData changes and update the form
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      // Wait a tick to ensure FormContainer is ready
      setTimeout(() => {
        if (formContainerRef.value && formContainerRef.value.setFormData) {
          formContainerRef.value.setFormData(newData)
        }
      }, 0)
    }
  },
  { immediate: true, deep: true }
)

// Expose FormContainer methods directly to parent components
defineExpose({
  resetForm: () => formContainerRef.value?.resetForm()
})

// Form event handlers
const handleSubmit = (data) => {
  return props.onSubmit(data)
}

const handleSuccess = (response) => {
  props.onSuccess(response)
}

const handleError = (error) => {
  props.onError(error)
}

const handleCancel = () => {
  props.onCancel()
}
</script>

<template>
  <FormContainer
    ref="formContainerRef"
    :title="title"
    :initial-data="initialData"
    :action="handleSubmit"
    :show-success-notification="showSuccessNotification"
    :success-message="successMessage"
    :success-notification-timer="successNotificationTimer"
    @success="handleSuccess"
    @error="handleError"
  >
    <FormInput name="username" rules="required" :disabled="isEditing" :hint="isEditing ? 'Username cannot be changed' : ''" col="6" />
    <FormInput name="name" rules="required" col="6" />
    <FormInput name="email" rules="required" type="email" col="12" />

    <FormInput
      name="password"
      type="password"
      :label="isEditing ? 'New Password (leave blank to keep current)' : 'Password'"
      :rules="!isEditing ? 'required|min:6' : 'min:6'"
      :placeholder="isEditing ? 'Enter new password' : 'Enter password'"
      col="6"
    />
    <FormInput
      v-if="!isEditing"
      rules="required|confirmed"
      name="password_confirmation"
      type="password"
      col="6"
    />

    <!-- Use ApiSelect for roles with automatic field detection -->
    <ApiSelect
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
      <div class="footer-actions">
        <FormButton type="button" variant="secondary" text="← Back" @click="handleCancel" />
        <FormButton
          type="submit"
          :variant="isEditing ? 'success' : 'primary'"
          :text="isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')"
          :disabled="isSubmitting"
        />
      </div>
    </template>
  </FormContainer>
</template>

<style scoped>
</style>
