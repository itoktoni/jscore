<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { ref } from 'vue'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
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
    default: (error) => {
      // Removed console.log statement
    }
  },
  onCancel: {
    type: Function,
    default: () => {
      // Removed console.log statement
    }
  }
})

// Expose FormContainer methods directly to parent components
defineExpose({
  resetForm: () => formContainerRef.value?.resetForm()
})
</script>

<template>
  <FormContainer
    ref="formContainerRef"
    :title="title"
    :initial-data="initialData"
    :action="onSubmit"
    @success="onSuccess"
    @error="onError"
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
        <button type="button" class="button secondary" @click="onCancel">← Back</button>
        <button
          type="submit"
          :class="['button', isEditing ? 'success' : 'primary']"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
        </button>
      </div>
    </template>
  </FormContainer>
</template>