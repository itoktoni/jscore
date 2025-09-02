/**
 * Login Page
 *
 * User authentication page with mobile-optimized design
 */

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>

      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <FormInput name="username" rules="required|min:3" />
          <FormInput name="password" type="password" rules="required|min:4" />
          <FormButton type="submit" variant="primary" block text="Login"/>
        </form>

        <div v-if="globalError" class="error-message">
          {{ globalError }}
        </div>

        <div class="register-link">
          <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'

const authStore = useAuthStore()
const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  commonRules,
  submitForm
} = useFormValidation()

const handleLogin = async () => {
  await submitForm(
    async (data) => {
      return await authStore.login(data.username, data.password)
    },
    {
      redirectUrl: '/profile'
    }
  )
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.login-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  background-color: #fff5f5;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.field-error {
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 0;
  font-weight: 500;
}

.login-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 16px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
  line-height: 1.4;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.register-link p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Mobile-specific optimizations */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    align-items: flex-start;
    padding-top: 40px;
  }

  .login-card {
    padding: 25px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .login-card h2 {
    font-size: 22px;
    margin-bottom: 25px;
  }

  .form-input {
    padding: 16px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 6px;
  }

  .login-button {
    padding: 18px 20px;
    font-size: 16px;
    border-radius: 6px;
    margin-top: 15px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .field-error {
    font-size: 12px;
    margin-top: 4px;
  }

  .error-message {
    padding: 10px 12px;
    font-size: 13px;
    margin-top: 12px;
  }

  .register-link {
    margin-top: 15px;
    padding-top: 12px;
  }

  .register-link p {
    font-size: 13px;
  }
}

/* Very small screens */
@media (max-width: 320px) {
  .login-container {
    padding: 5px;
  }

  .login-card {
    padding: 20px 12px;
  }

  .login-card h2 {
    font-size: 20px;
  }
}

/* Landscape phones */
@media (max-width: 768px) and (orientation: landscape) {
  .login-container {
    padding: 15px;
    align-items: center;
  }

  .login-card {
    max-width: 450px;
  }
}
</style>