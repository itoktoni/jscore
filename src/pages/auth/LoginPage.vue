/**
 * Login Page
 *
 * User authentication page with mobile-optimized design
 */

<template>
  <div class="login-container">
    <div class="login-card">
      <FormContainer
        title="Login"
        :action="handleLogin"
        :show-footer="false"
      >
        <FormInput col="12" name="username" rules="required|min:3" />
        <FormInput col="12" name="password" type="password" rules="required|min:4" />

        <div class="form-actions">
          <FormButton col="12" type="submit" variant="primary" text="Login" />
        </div>
      </FormContainer>

      <div class="register-link">
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormButton from '../../components/FormButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async (data) => {
  console.log('Login attempt with:', data)

  try {
    const result = await authStore.login(data.username, data.password)

    if (result.success) {
      console.log('Login successful')
      // Redirect to profile on successful login
      router.push('/profile')
      return { success: true }
    } else {
      console.log('Login failed:', result)
      // Return error for FormContainer to handle
      return {
        success: false,
        error: result.error || 'Login failed',
        errors: result.errorData?.errors || {}
      }
    }
  } catch (error) {
    console.log('Login error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      errors: {}
    }
  }
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