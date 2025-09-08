<template>
  <div class="demo-container">
    <div class="demo-card">
      <h2>Modern Form Components Demo</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Ultra-minimal FormInput components -->
        <FormInput name="username" rules="required|min:3|alpha_num" />
        <FormInput name="email" type="email" rules="required|email" />
        <FormInput name="password" type="password" rules="required|min:6" />

        <!-- FormSelect with auto-binding -->
        <FormSelect
          name="user_role"
          rules="required"
          :options="roleOptions"
          hint="Select your role"
        />

        <!-- FormSelect with custom options -->
        <FormSelect
          name="country"
          rules="required"
          :options="countryOptions"
          option-label="name"
          option-value="code"
        />

        <!-- Multiple Button variants -->
        <div class="button-row">
          <Button
            button-type="submit"
            variant="primary"
            text="Submit Form"
            block
          />
        </div>

        <div class="button-row">
          <Button
            button-type="button"
            variant="secondary"
            text="Cancel"
            size="small"
            @click="handleCancel"
          />
          <Button
            button-type="button"
            variant="success"
            text="Save Draft"
            size="small"
            @click="handleSave"
          />
          <Button
            button-type="button"
            variant="danger"
            text="Delete"
            size="small"
            @click="handleDelete"
          />
        </div>
      </form>

      <div v-if="globalError" class="error-message">
        {{ globalError }}
      </div>

      <!-- Show form data for debugging -->
      <div class="debug-panel">
        <h3>Form Data (Auto-bound)</h3>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>

        <h3>Field Errors</h3>
        <pre>{{ JSON.stringify(fieldErrors, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'
import Button from '../components/Button.vue'

const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  submitForm
} = useFormValidation()

// Initialize form data
formData.username = ''
formData.email = ''
formData.password = ''
formData.user_role = ''
formData.country = ''

// Options for select components
const roleOptions = [
  'User',
  'Admin',
  'Moderator',
  'Guest'
]

const countryOptions = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' }
]

const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      // Simulate API call
      console.log('Submitting form data:', data)

      // Simulate success response
      return { success: true, message: 'Form submitted successfully!' }
    },
    {
      onSuccess: (response) => {
        console.log('Form submission successful:', response)
      }
    }
  )
}

const handleCancel = () => {
  console.log('Form cancelled')
  // Reset form data
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })

  // Clear errors
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })
}

const handleSave = () => {
  console.log('Draft saved:', formData)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete?')) {
    console.log('Item deleted')
  }
}
</script>