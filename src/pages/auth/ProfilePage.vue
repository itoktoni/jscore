<template>
  <div class="profile-edit-page">
    <div class="page-header">
      <h2>Profile</h2>
    </div>

    <div class="card w-full max-w-3xl mx-auto">
      <div class="card-header">
        <h3 class="m-0">Your Account Information</h3>
      </div>
      <div class="card-content">
        <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4">
          <div class="field mb-4">
            <label for="username" class="font-bold block mb-2">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="Enter username"
              class="form-input"
              disabled
            />
            <div class="field-hint">Username cannot be changed</div>
          </div>

          <div class="field mb-4">
            <label for="name" class="font-bold block mb-2">Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Enter your name"
              class="form-input"
              required
            />
            <div v-if="errors.name" class="error-message">
              {{ errors.name }}
            </div>
          </div>

          <div class="field mb-4">
            <label for="email" class="font-bold block mb-2">Email *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              class="form-input"
              required
            />
            <div v-if="errors.email" class="error-message">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-actions">
            <button
              @click="handleLogout"
              type="button"
              class="btn btn-secondary"
            >
              Logout
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useAlert } from '../../composables/useAlert'
import { http } from '../../stores/http'

const router = useRouter()
const authStore = useAuthStore()
const { alertSuccess, alertError } = useAlert()

// Form data
const form = reactive({
  username: '',
  name: '',
  email: ''
})

// Form state
const isSubmitting = ref(false)

// Form errors
const errors = ref({})

// Load user data on mount
onMounted(async () => {
  try {
    // Load user profile data if not already loaded
    if (!authStore.user) {
      await authStore.loadProfile()
    }

    if (authStore.user) {
      // Populate form data with current user data
      form.username = authStore.user.username || ''
      form.name = authStore.user.name || ''
      form.email = authStore.user.email || ''
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    alertError('Error', 'Failed to load profile data')
  }
})

// Validate form
const validateForm = () => {
  const newErrors = {}

  if (!form.name) {
    newErrors.name = 'Name is required.'
  } else if (form.name.length < 2) {
    newErrors.name = 'Name must be at least 2 characters.'
  }

  if (!form.email) {
    newErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address.'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
const onFormSubmit = async () => {
  if (validateForm()) {
    try {
      isSubmitting.value = true

      // Create profile data object
      const profileData = {
        name: form.name,
        email: form.email
      }

      // Update profile using our service
      const response = await http.post('/profile', profileData)

      // Update auth store with new user data
      if (response.data && response.data.data) {
        authStore.user = { ...authStore.user, ...response.data.data }
      }

      // Show success message
      alertSuccess('Success', 'Profile updated successfully!')

      // Reset form with updated data
      if (response.data && response.data.data) {
        form.name = response.data.data.name || form.name
        form.email = response.data.data.email || form.email
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alertError('Error', 'Failed to update profile')
    } finally {
      isSubmitting.value = false
    }
  }
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-edit-page {
  padding: 1rem;
}

.page-header {
  margin-bottom: 1rem;
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-hint {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.card-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
  margin-bottom: 1rem;
}

.card-content {
  padding: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.font-bold {
  font-weight: bold;
}

.block {
  display: block;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>