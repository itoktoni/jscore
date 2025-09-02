# Script Setup + FormInput Components Guide

## Overview

This guide demonstrates using Vue 3 `<script setup>` syntax with inline FormInput components for clean, modern form handling. This approach eliminates boilerplate and provides a more intuitive development experience.

## Key Features

- **Script Setup Syntax**: Uses Vue 3's `<script setup>` for cleaner, more concise code
- **Inline FormInput Components**: Native HTML-like syntax with `name` attributes
- **Reactive Validation**: Real-time validation with automatic error display
- **Composition API**: Full power of Vue 3 Composition API
- **Less Boilerplate**: Dramatically reduced setup code

## Basic Pattern

### 1. Script Setup Structure

```vue
<script setup>
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  commonRules,
  submitForm
} = useFormValidation()

// Initialize form data directly
formData.username = ''
formData.password = ''

// Define validation rules
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3)
  },
  password: {
    ...commonRules.required('Password is required'),
    ...commonRules.minLength(4)
  }
}

// Handle form submission
const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      return await apiCall(data)
    },
    validationRules,
    { redirectUrl: '/success' }
  )
}
</script>
```

### 2. Template with Inline FormInput

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      name="username"
      v-model="formData.username"
      label="Username"
      placeholder="Enter your username"
      :error="fieldErrors.username"
      required
    />

    <FormInput
      name="password"
      v-model="formData.password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      :error="fieldErrors.password"
      required
    />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>

  <div v-if="globalError" class="error-message">
    {{ globalError }}
  </div>
</template>
```

## Complete Examples

### Login Page

```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <FormInput
          name="username"
          v-model="formData.username"
          label="Username"
          placeholder="Enter your username"
          :error="fieldErrors.username"
          required
        />

        <FormInput
          name="password"
          v-model="formData.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :error="fieldErrors.password"
          required
        />

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div v-if="globalError" class="error-message">
        {{ globalError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const authStore = useAuthStore()
const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  commonRules,
  submitForm
} = useFormValidation()

// Initialize form data
formData.username = ''
formData.password = ''

// Validation rules
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3, 'Username must be at least 3 characters')
  },
  password: {
    ...commonRules.required('Password is required'),
    ...commonRules.minLength(4, 'Password must be at least 4 characters')
  }
}

const handleLogin = async () => {
  await submitForm(
    async (data) => {
      return await authStore.login(data.username, data.password)
    },
    validationRules,
    {
      redirectUrl: '/profile'
    }
  )
}
</script>
```

### Registration Page

```vue
<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Create Account</h2>

      <form @submit.prevent="handleRegister">
        <FormInput
          name="username"
          v-model="formData.username"
          label="Username"
          placeholder="Enter your username"
          :error="fieldErrors.username"
          hint="Must be 3-20 characters, letters and numbers only"
          required
        />

        <FormInput
          name="name"
          v-model="formData.name"
          label="Full Name"
          placeholder="Enter your full name"
          :error="fieldErrors.name"
          required
        />

        <FormInput
          name="email"
          v-model="formData.email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          :error="fieldErrors.email"
          required
        />

        <FormInput
          name="password"
          v-model="formData.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :error="fieldErrors.password"
          hint="Must be at least 6 characters"
          required
        />

        <FormInput
          name="password_confirmation"
          v-model="formData.password_confirmation"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          :error="fieldErrors.password_confirmation"
          required
        />

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div v-if="globalError" class="error-message">
        {{ globalError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const authStore = useAuthStore()
const {
  isSubmitting,
  globalError,
  fieldErrors,
  formData,
  commonRules,
  submitForm
} = useFormValidation()

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''
formData.password = ''
formData.password_confirmation = ''

// Validation rules
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3, 'Username must be at least 3 characters'),
    ...commonRules.maxLength(20, 'Username must be no more than 20 characters'),
    ...commonRules.alphaNum('Username must contain only letters and numbers')
  },
  name: {
    ...commonRules.required('Full name is required'),\n    ...commonRules.minLength(2, 'Name must be at least 2 characters'),\n    ...commonRules.maxLength(50, 'Name must be no more than 50 characters')\n  },\n  email: {\n    ...commonRules.required('Email is required'),\n    ...commonRules.email()\n  },\n  password: {\n    ...commonRules.required('Password is required'),\n    ...commonRules.minLength(6, 'Password must be at least 6 characters')\n  },\n  password_confirmation: {\n    ...commonRules.required('Password confirmation is required'),\n    ...commonRules.confirmPassword('password')\n  }\n}\n\nconst handleRegister = async () => {\n  await submitForm(\n    async (data) => {\n      return await authStore.register(data)\n    },\n    validationRules,\n    {\n      redirectUrl: '/profile'\n    }\n  )\n}\n</script>\n```\n\n### User Form Component\n\n```vue\n<template>\n  <div class=\"user-form-container\">\n    <form @submit.prevent=\"handleSubmit\">\n      <FormInput\n        name=\"username\"\n        v-model=\"formData.username\"\n        label=\"Username\"\n        placeholder=\"Enter username\"\n        :error=\"fieldErrors.username\"\n        :disabled=\"isEditing\"\n        :hint=\"isEditing ? 'Username cannot be changed' : ''\"\n        required\n      />\n\n      <FormInput\n        name=\"name\"\n        v-model=\"formData.name\"\n        label=\"Full Name\"\n        placeholder=\"Enter full name\"\n        :error=\"fieldErrors.name\"\n        required\n      />\n\n      <FormInput\n        name=\"email\"\n        v-model=\"formData.email\"\n        type=\"email\"\n        label=\"Email Address\"\n        placeholder=\"Enter email address\"\n        :error=\"fieldErrors.email\"\n        required\n      />\n\n      <!-- Dynamic form fields based on editing state -->\n      <FormInput\n        name=\"password\"\n        v-model=\"formData.password\"\n        type=\"password\"\n        :label=\"isEditing ? 'New Password (leave blank to keep current)' : 'Password'\"\n        :placeholder=\"isEditing ? 'Enter new password' : 'Enter password'\"\n        :error=\"fieldErrors.password\"\n        :required=\"!isEditing\"\n      />\n\n      <FormButton\n        type=\"submit\"\n        :loading=\"isSubmitting\"\n        :text=\"isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')\"\n      />\n    </form>\n\n    <div v-if=\"globalError\" class=\"error-message\">\n      {{ globalError }}\n    </div>\n  </div>\n</template>\n\n<script setup>\nimport { watch } from 'vue'\nimport { useUserStore } from '../stores/user'\nimport { useFormValidation } from '../composables/useFormValidation'\nimport FormInput from './FormInput.vue'\nimport FormButton from './FormButton.vue'\n\nconst props = defineProps({\n  user: {\n    type: Object,\n    default: null\n  },\n  isEditing: {\n    type: Boolean,\n    default: false\n  }\n})\n\nconst emit = defineEmits(['saved', 'cancelled'])\n\nconst userStore = useUserStore()\nconst {\n  isSubmitting,\n  globalError,\n  fieldErrors,\n  formData,\n  commonRules,\n  resetForm,\n  setFormData,\n  submitForm\n} = useFormValidation()\n\n// Initialize form data\nformData.username = ''\nformData.name = ''\nformData.email = ''\nformData.password = ''\nformData.password_confirmation = ''\nformData.role = 'user'\nformData.status = 'active'\n\n// Dynamic validation rules\nconst getValidationRules = () => {\n  const rules = {\n    username: {\n      ...commonRules.required('Username is required'),\n      ...commonRules.minLength(3),\n      ...commonRules.alphaNum()\n    },\n    name: {\n      ...commonRules.required('Full name is required'),\n      ...commonRules.minLength(2)\n    },\n    email: {\n      ...commonRules.required('Email is required'),\n      ...commonRules.email()\n    }\n  }\n\n  // Conditional password validation\n  if (!props.isEditing) {\n    rules.password = commonRules.password(6)\n    rules.password_confirmation = commonRules.confirmPassword('password')\n  } else if (formData.password && formData.password.trim()) {\n    rules.password = commonRules.minLength(6)\n  }\n\n  return rules\n}\n\nconst handleSubmit = async () => {\n  await submitForm(\n    async (data) => {\n      if (props.isEditing && props.user) {\n        return await userStore.updateUser(props.user.id, data)\n      } else {\n        return await userStore.createUser(data)\n      }\n    },\n    getValidationRules(),\n    {\n      onSuccess: (response) => {\n        resetForm()\n        emit('saved', response.data)\n      }\n    }\n  )\n}\n\n// Watch for prop changes\nwatch(() => props.user, (newUser) => {\n  if (newUser && props.isEditing) {\n    setFormData({\n      username: newUser.username || '',\n      name: newUser.name || '',\n      email: newUser.email || '',\n      role: newUser.role || 'user',\n      status: newUser.status || 'active',\n      password: '',\n      password_confirmation: ''\n    })\n  } else {\n    resetForm()\n  }\n}, { immediate: true })\n</script>\n```\n\n## FormInput Component Props\n\n```javascript\n// All props are optional except v-model\nname: String            // Form field name (used as fallback for id)\nv-model: String/Number  // Reactive form data binding\ntype: String            // Input type (text, email, password, etc.)\nlabel: String           // Field label\nplaceholder: String     // Placeholder text\nerror: String           // Error message to display\nhint: String            // Help text\ndisabled: Boolean       // Disable input\nrequired: Boolean       // Mark as required\nid: String              // Optional explicit ID (uses name if not provided)\n```\n\n## Key Advantages of This Approach\n\n### 1. **Cleaner Script Setup**\n```javascript\n// Before: Options API with export default\nexport default {\n  name: 'LoginPage',\n  components: { FormInput },\n  setup() {\n    // ... setup logic\n    return { /* all reactive values */ }\n  }\n}\n\n// After: Script setup\n<script setup>\nimport FormInput from '../components/FormInput.vue'\n// ... direct reactive logic\n</script>\n```\n\n### 2. **Native HTML-like Syntax**\n```vue\n<!-- Clean, semantic, self-documenting -->\n<FormInput\n  name=\"username\"\n  v-model=\"formData.username\"\n  label=\"Username\"\n  :error=\"fieldErrors.username\"\n  required\n/>\n```\n\n### 3. **No ID Management**\n- Uses `name` attribute primarily\n- `id` is automatically generated from `name`\n- No need to manage unique IDs manually\n\n### 4. **Direct Form Data Access**\n```javascript\n// Direct assignment\nformData.username = ''\nformData.password = ''\n\n// Direct usage in validation\nif (formData.password && formData.password.trim()) {\n  // conditional logic\n}\n```\n\n### 5. **Simplified Component Definition**\n```javascript\n// defineProps and defineEmits at top level\nconst props = defineProps({ /* props */ })\nconst emit = defineEmits(['saved', 'cancelled'])\n\n// Direct reactive access\nconst { formData, fieldErrors } = useFormValidation()\n```\n\n## Best Practices\n\n1. **Use name attributes**: Always provide `name` for FormInput components\n2. **Initialize data early**: Set form data immediately after composable setup\n3. **Semantic naming**: Use descriptive names that match your data model\n4. **Consistent validation**: Use common rules and extend as needed\n5. **Error handling**: Let the composable handle all error states\n6. **Loading states**: Use `isSubmitting` for button states\n7. **Direct assignment**: No need for reactive() wrappers in script setup\n\nThis approach provides the cleanest, most maintainable way to handle forms in Vue 3 applications!