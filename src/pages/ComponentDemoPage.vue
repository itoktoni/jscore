/**
 * Component Demo Page
 *
 * Demonstrates the ultra-minimal FormInput, FormSelect, and FormButton components
 */

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

        <!-- Multiple FormButton variants -->
        <div class="button-row">
          <FormButton
            type="submit"
            variant="primary"
            text="Submit Form"
            block
          />
        </div>

        <div class="button-row">
          <FormButton
            variant="secondary"
            text="Cancel"
            size="small"
            @click="handleCancel"
          />
          <FormButton
            variant="success"
            text="Save Draft"
            size="small"
            @click="handleSave"
          />
          <FormButton
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
import FormButton from '../components/FormButton.vue'

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

<style scoped>
.demo-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.demo-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.demo-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.button-row .form-button {
  flex: 1;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
}

.debug-panel {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.debug-panel h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #495057;
}

.debug-panel pre {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  font-size: 12px;
  overflow-x: auto;
  margin: 0 0 15px 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .demo-container {
    padding: 10px;
  }

  .demo-card {
    padding: 20px;
  }

  .button-row {
    flex-direction: column;
    gap: 8px;
  }

  .debug-panel {
    padding: 15px;
  }

  .debug-panel pre {
    font-size: 11px;
    padding: 8px;
  }
}
</style>