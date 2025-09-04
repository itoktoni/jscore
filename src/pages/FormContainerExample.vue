/**
 * FormContainer Example Page
 *
 * Demonstrates different ways to use the FormContainer component
 */

<template>
  <div class="example-container">
    <div class="example-card">
      <h2>FormContainer Usage Examples</h2>

      <!-- Example 1: Default footer -->
      <div class="example-section">
        <h3>Example 1: Default Footer</h3>
        <FormContainer
          title="Default Footer Example"
          :initial-data="{ name: '', email: '' }"
          submit-text="Save"
          :submit-handler="handleDefaultSubmit"
        >
          <template #default="{ formData, fieldErrors }">
            <FormInput name="name" label="Full Name" rules="required|min:2" />
            <FormInput name="email" label="Email Address" type="email" rules="required|email" />
          </template>
        </FormContainer>
      </div>

      <!-- Example 2: Custom footer slot -->
      <div class="example-section">
        <h3>Example 2: Custom Footer Slot</h3>
        <FormContainer
          title="Custom Footer Example"
          :initial-data="{ username: '', password: '' }"
          :show-footer="true"
          :submit-handler="handleCustomSubmit"
        >
          <template #default="{ formData, fieldErrors }">
            <FormInput name="username" label="Username" rules="required|min:3" />
            <FormInput name="password" label="Password" type="password" rules="required|min:6" />
          </template>

          <!-- Custom footer with custom buttons -->
          <template #footer="{ isSubmitting }">
            <div class="custom-footer">
              <FormButton
                type="button"
                variant="secondary"
                text="Reset"
                @click="handleReset"
              />
              <FormButton
                type="submit"
                variant="success"
                :text="isSubmitting ? 'Saving...' : 'Create Account'"
                :disabled="isSubmitting"
              />
            </div>
          </template>
        </FormContainer>
      </div>

      <!-- Example 3: No footer -->
      <div class="example-section">
        <h3>Example 3: No Footer</h3>
        <FormContainer
          title="No Footer Example"
          :initial-data="{ title: '', content: '' }"
          :show-footer="false"
          :submit-handler="handleNoFooterSubmit"
        >
          <template #default="{ formData, fieldErrors }">
            <FormInput name="title" label="Title" rules="required|min:5" />
            <FormInput name="content" label="Content" type="textarea" rules="required|min:10" />
            <div class="form-actions">
              <FormButton
                type="submit"
                variant="primary"
                text="Submit"
                :disabled="isSubmitting"
              />
            </div>
          </template>
        </FormContainer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormContainer from '../components/FormContainer.vue'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'

// We need to inject isSubmitting for the third example
import { inject } from 'vue'

const isSubmitting = inject('isSubmitting', ref(false))

const handleDefaultSubmit = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

const handleCustomSubmit = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

const handleNoFooterSubmit = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

const handleReset = () => {
  // Reset button clicked
}
</script>

<style scoped>
.example-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.example-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.example-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.example-section {
  margin-bottom: 40px;
}

.example-section h3 {
  margin-bottom: 20px;
  color: #555;
  font-size: 20px;
  font-weight: 500;
}

.custom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.form-actions {
  margin-top: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .example-card {
    padding: 20px;
  }

  .custom-footer {
    flex-direction: column;
  }
}
</style>