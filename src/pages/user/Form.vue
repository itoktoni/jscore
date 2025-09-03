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

// Define ref for FormContainer
const formContainerRef = ref(null)

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
    required: true
  },
  onCancel: {
    type: Function,
    required: true
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

// Expose resetForm method to parent components
defineExpose({
  resetForm: () => {
    console.log('Form resetForm called')
    // Reset the form to its initial state using forEach to set all fields to empty strings
    try {
      // Add a small delay to ensure any pending operations complete
      setTimeout(() => {
        if (formContainerRef.value && formContainerRef.value.formData) {
          // Set all form fields to empty strings
          Object.keys(formContainerRef.value.formData).forEach(key => {
            formContainerRef.value.formData[key] = ''
          })

          // Clear field errors
          if (formContainerRef.value.fieldErrors) {
            Object.keys(formContainerRef.value.fieldErrors).forEach(key => {
              delete formContainerRef.value.fieldErrors[key]
            })
          }

          // Clear global error
          if (formContainerRef.value.globalError) {
            formContainerRef.value.globalError.value = ''
          }
        }
      }, 10)
    } catch (error) {
      console.error('Error in formContainer reset:', error)
    }
  }
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
      option-label="name"
      option-value="id"
      col="6"
      label="Role"
    />

    <template #footer="{ isSubmitting }">
      <div class="footer-actions">
        <FormButton type="button" variant="secondary" text="← Back to Users" @click="handleCancel" />
        <FormButton
          type="submit"
          :variant="isEditing ? 'success' : 'primary'"
          :text="isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')"
          :disabled="isSubmitting"
        />
      </div>
    </template>
  </FormContainer>
</template>

<style scoped>
</style>