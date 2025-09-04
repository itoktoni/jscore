<template>
  <GlobalModal
    :is-visible="isVisible"
    mode="create"
    title="Create New User"
    :fields="userFields"
    submit-button-text="Create User"
    cancel-button-text="Cancel"
    @close="handleClose"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { USER_ROUTES, USER_API_ROUTES } from '../../router/userRoutes'
import { http } from '../../stores/http'
import { useAlert } from '../../composables/useAlert'
import { useResponse } from '../../composables/useResponse'
import GlobalModal from '../../components/GlobalModal.vue'

// Define props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Define emits
const emit = defineEmits(['close', 'created'])

const router = useRouter()
const { alertSuccess, alertError } = useAlert()
const { responseSuccess, responseError } = useResponse()

// Define fields for user creation
const userFields = [
  { name: 'username', label: 'Username', type: 'text', rules: 'required', placeholder: 'Enter username' },
  { name: 'name', label: 'Full Name', type: 'text', rules: 'required', placeholder: 'Enter full name' },
  { name: 'email', label: 'Email', type: 'email', rules: 'required|email', placeholder: 'Enter email address' },
  { name: 'password', label: 'Password', type: 'password', rules: 'required|min:6', placeholder: 'Enter password' },
  {
    name: 'password_confirmation',
    label: 'Confirm Password',
    type: 'password',
    rules: 'required|confirmed:password',
    placeholder: 'Confirm password'
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    endpoint: 'roles',
    optionLabel: 'name',
    optionValue: 'id',
    rules: 'required',
    searchable: true
  }
]

// Methods
const handleClose = () => {
  emit('close')
}

const handleSubmit = async (userData) => {
  try {
    // Remove password_confirmation from the data sent to the API
    const { password_confirmation, ...userDataToSend } = userData

    // Make API request
    const response = await http.post(USER_API_ROUTES.create, userDataToSend)
    const result = responseSuccess(response)

    if (result.success) {
      alertSuccess('Success', 'User created successfully!')
      emit('created', result.data)
      handleClose()

      // Optionally redirect to user list
      router.push({ name: USER_ROUTES.USER_LIST })
    } else {
      alertError('Error', 'Failed to create user')
      throw new Error('Failed to create user')
    }
  } catch (error) {
    const result = responseError(error)
    alertError('Error', result.error || 'Failed to create user')
    throw error
  }
}
</script>