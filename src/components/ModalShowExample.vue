<template>
  <div class="example-container">
    <h2>ModalShow Component Example</h2>

    <!-- Button to open the modal -->
    <FormButton
      variant="primary"
      text="Show User Modal"
      @click="showUserModal = true"
    />

    <!-- Example of ModalShow for a user -->
    <ModalShow
      v-if="showUserModal"
      :data="sampleUser"
      title="User Information"
      :fields="userFields"
      :show-avatar="true"
      @close="showUserModal = false"
    />

    <!-- Button to open the product modal -->
    <FormButton
      variant="secondary"
      text="Show Product Modal"
      @click="showProductModal = true"
    />

    <!-- Example of ModalShow for a product -->
    <ModalShow
      v-if="showProductModal"
      :data="sampleProduct"
      title="Product Details"
      :fields="productFields"
      @close="showProductModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalShow from './ModalShow.vue'
import FormButton from './FormButton.vue'

// Modal visibility states
const showUserModal = ref(false)
const showProductModal = ref(false)

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

const sampleProduct = {
  id: 101,
  name: 'Premium Headphones',
  description: 'High-quality wireless headphones with noise cancellation',
  price: 199.99,
  category: 'Electronics',
  in_stock: true,
  created_at: '2023-03-10T09:15:00Z'
}

// Field configurations
const userFields = [
  { key: 'name', label: 'Full Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email Address' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Member Since' },
  { key: 'updated_at', label: 'Last Updated' }
]

const productFields = [
  'name',
  'description',
  'price',
  'category',
  { key: 'in_stock', label: 'In Stock' },
  { key: 'created_at', label: 'Added On' }
]
</script>

<style scoped>
.example-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.example-container h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.example-container > * {
  margin-bottom: 1rem;
}
</style>