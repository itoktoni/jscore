/**
 * Registration Page
 *
 * User registration page with comprehensive form validation
 */

<template>
  <div class="register-container">
    <div class="register-card">
      <FormContainer
        title="Create Account"
        subtitle="Join us today! Fill in your details below to get started."
        :initial-data="initialFormData"
        submit-text="Create Account"
        loading-text="Creating Account..."
        submit-variant="success"
        :submit-handler="handleRegister"
        :show-footer="false"
      >
        <template #default="{ formData, fieldErrors, isSubmitting }">
          <FormInput
            name="username"
            rules="required|min:3|max:20|alpha_num"
            hint="Must be 3-20 characters, letters and numbers only"
          />
          <FormInput name="name" rules="required|min:2|max:50" />
          <FormInput name="email" type="email" rules="required|email" />
          <FormInput
            name="password"
            type="password"
            rules="required|min:6"
            hint="Must be at least 6 characters"
          />
          <FormInput
            name="password_confirmation"
            type="password"
            rules="required|confirmed"
          />

          <FormButton
            type="submit"
            variant="success"
            :text="isSubmitting ? 'Creating Account...' : 'Create Account'"
            :disabled="isSubmitting"
            block
            @click="handleRegisterSubmit"
          />
        </template>
      </FormContainer>

      <FormLink
        text="Already have an account?"
        link-text="Login here"
        to="/login"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'
import FormLink from '../../components/FormLink.vue'

const router = useRouter()
const authStore = useAuthStore()

// Initial form data
const initialFormData = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async (data) => {
  const result = await authStore.register(data)

  if (result.success) {
    // Redirect to profile on successful registration
    router.push('/profile')
    return result
  } else {
    // Return error for FormContainer to handle
    return result
  }
}

// Handle form submission when footer is disabled
const handleRegisterSubmit = async (event) => {
  event.preventDefault()
  // This will be handled by FormContainer internally
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.register-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
}

/* Mobile-specific optimizations */
@media (max-width: 480px) {
  .register-container {
    padding: 10px;
    align-items: flex-start;
    padding-top: 40px;
  }

  .register-card {
    padding: 25px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .register-card h2 {
    font-size: 22px;
    margin-bottom: 25px;
  }

}

/* Very small screens */
@media (max-width: 320px) {
  .register-container {
    padding: 5px;
  }

  .register-card {
    padding: 20px 12px;
  }

  .register-card h2 {
    font-size: 20px;
  }
}

/* Landscape phones */
@media (max-width: 768px) and (orientation: landscape) {
  .register-container {
    padding: 15px;
    align-items: center;
  }

  .register-card {
    max-width: 500px;
  }
}
</style>