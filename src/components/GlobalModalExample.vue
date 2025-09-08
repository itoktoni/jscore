<template>
  <div class="example-container">
    <h2>GlobalModal Component Examples</h2>

    <!-- Button to open the create user modal -->
    <Button
      button-type="button"
      variant="primary"
      text="Create New User"
      @click="openCreateModal"
    />

    <!-- Button to open the view user modal -->
    <Button
      button-type="button"
      variant="secondary"
      text="View User Details"
      @click="openViewModal"
    />

    <!-- Global Modal for Creating a User -->
    <GlobalModal
      :is-visible="isCreateModalOpen"
      mode="create"
      title="Create New User"
      :fields="userCreateFields"
      submit-button-text="Create User"
      cancel-button-text="Cancel"
      @close="isCreateModalOpen = false"
      @submit="handleCreateUser"
    />

    <!-- Global Modal for Viewing a User -->
    <GlobalModal
      :is-visible="isViewModalOpen"
      mode="view"
      title="User Details"
      :data="sampleUser"
      :fields="userViewFields"
      :show-avatar="true"
      show-edit-button
      edit-button-text="Edit User"
      @close="isViewModalOpen = false"
      @edit="openEditModal"
    />

    <!-- Global Modal for Editing a User -->
    <GlobalModal
      :is-visible="isEditModalOpen"
      mode="edit"
      title="Edit User"
      :data="sampleUser"
      :fields="userEditFields"
      submit-button-text="Update User"
      cancel-button-text="Cancel"
      @close="isEditModalOpen = false"
      @submit="handleUpdateUser"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GlobalModal from './GlobalModal.vue'
import Button from './Button.vue'
import { useAlert } from '../composables/useAlert.js'

// Modal visibility states
const isCreateModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isEditModalOpen = ref(false)

// Alert composable
const { alertSuccess, alertError } = useAlert()

// Sample data
const sampleUser = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  role: 'admin',
  status: 'active',
  created_at: '2023-01-15T10:30:00Z',
  updated_at: '2023-06-20T14:45:00Z'
}

// Field configurations
const userCreateFields = [
  { name: 'name', label: 'Full Name', type: 'text', rules: 'required' },
  { name: 'username', label: 'Username', type: 'text', rules: 'required' },
  { name: 'email', label: 'Email Address', type: 'email', rules: 'required|email' },
  { name: 'password', label: 'Password', type: 'password', rules: 'required|min:6' },
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

const userViewFields = [
  { key: 'name', label: 'Full Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email Address' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Member Since' },
  { key: 'updated_at', label: 'Last Updated' }
]

const userEditFields = [
  { name: 'name', label: 'Full Name', type: 'text', rules: 'required' },
  { name: 'username', label: 'Username', type: 'text', rules: 'required', disabled: true },
  { name: 'email', label: 'Email Address', type: 'email', rules: 'required|email' },
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
const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const openViewModal = () => {
  isViewModalOpen.value = true
}

const openEditModal = () => {
  isViewModalOpen.value = false
  isEditModalOpen.value = true
}

const handleCreateUser = async (userData) => {
  try {
    // Simulate API call
    console.log('Creating user:', userData)
    // Here you would typically make an API call:
    // await http.post('/api/users', userData)

    alertSuccess('Success', 'User created successfully!')
    isCreateModalOpen.value = false
  } catch (error) {
    alertError('Error', 'Failed to create user')
    throw error
  }
}

const handleUpdateUser = async (userData) => {
  try {
    // Simulate API call
    console.log('Updating user:', userData)
    // Here you would typically make an API call:
    // await http.put(`/api/users/${userData.id}`, userData)

    alertSuccess('Success', 'User updated successfully!')
    isEditModalOpen.value = false
  } catch (error) {
    alertError('Error', 'Failed to update user')
    throw error
  }
}
</script>