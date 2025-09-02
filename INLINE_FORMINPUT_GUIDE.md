# Ultra-Minimal Inline FormInput Guide

## Overview

The FormInput component now supports ultra-minimal inline usage where you only need to specify the `name` attribute. Everything else (v-model, label, placeholder, error binding) is automatically inferred and handled.

## Key Features

- **Auto v-model**: Automatically binds to `formData[name]`
- **Auto Label**: Generates human-readable labels from field names
- **Auto Placeholder**: Creates placeholders from labels
- **Auto Error Binding**: Automatically shows errors from `fieldErrors[name]`
- **Minimal Syntax**: Just `<FormInput name="username" />` is enough!

## How It Works

### 1. FormInput Component Enhancement

The FormInput component now:
- **Injects form context** using Vue's provide/inject system
- **Auto-generates labels** from field names (e.g., `password_confirmation` → "Password Confirmation")
- **Auto-generates placeholders** (e.g., "Enter username")
- **Auto-binds to reactive data** through formData and fieldErrors
- **Handles v-model internally** while still supporting explicit v-model if needed

### 2. Form Validation Composable Enhancement

The `useFormValidation` composable now:
- **Provides form context** via Vue's provide system
- **Exposes formData and fieldErrors** to all child FormInput components
- **Maintains backward compatibility** with explicit prop usage

## Basic Usage

### Ultra-Minimal Syntax

```vue
<template>
  <form @submit.prevent="handleLogin">
    <!-- Just the name - everything else is automatic! -->
    <FormInput name="username" required />
    <FormInput name="password" type="password" required />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script setup>
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const {
  isSubmitting,
  formData,
  submitForm,
  commonRules
} = useFormValidation()

// Initialize form data
formData.username = ''
formData.password = ''

// Validation rules
const validationRules = {
  username: commonRules.required('Username is required'),
  password: commonRules.required('Password is required')
}

const handleLogin = async () => {
  await submitForm(
    async (data) => await authStore.login(data.username, data.password),
    validationRules,
    { redirectUrl: '/profile' }
  )
}
</script>
```

## Complete Examples

### 1. Login Page (Minimal)

```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <FormInput name="username" required />
        <FormInput name="password" type="password" required />

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
const { isSubmitting, globalError, formData, commonRules, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.password = ''

// Validation rules
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

const handleLogin = async () => {
  await submitForm(
    async (data) => await authStore.login(data.username, data.password),
    validationRules,
    { redirectUrl: '/profile' }
  )
}
</script>
```

### 2. Registration Page (With Hints)

```vue
<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Create Account</h2>

      <form @submit.prevent="handleRegister">
        <FormInput
          name="username"
          hint="Must be 3-20 characters, letters and numbers only"
          required
        />
        <FormInput name="name" required />
        <FormInput name="email" type="email" required />
        <FormInput
          name="password"
          type="password"
          hint="Must be at least 6 characters"
          required
        />
        <FormInput name="password_confirmation" type="password" required />

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
const { isSubmitting, globalError, formData, commonRules, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''
formData.password = ''
formData.password_confirmation = ''

// Validation rules
const validationRules = {
  username: {
    ...commonRules.required(),
    ...commonRules.minLength(3),
    ...commonRules.maxLength(20),
    ...commonRules.alphaNum()
  },
  name: {
    ...commonRules.required(),
    ...commonRules.minLength(2)
  },
  email: {
    ...commonRules.required(),
    ...commonRules.email()
  },
  password: {
    ...commonRules.required(),
    ...commonRules.minLength(6)
  },
  password_confirmation: {
    ...commonRules.required(),
    ...commonRules.confirmPassword('password')
  }
}

const handleRegister = async () => {
  await submitForm(
    async (data) => await authStore.register(data),
    validationRules,
    { redirectUrl: '/profile' }
  )
}
</script>
```

### 3. User Form (Dynamic Labels)

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      name="username"
      :disabled="isEditing"
      :hint="isEditing ? 'Username cannot be changed' : ''"
      required
    />
    <FormInput name="name" required />
    <FormInput name="email" type="email" required />
    <FormInput
      name="password"
      type="password"
      :label="isEditing ? 'New Password (leave blank to keep current)' : 'Password'"
      :required="!isEditing"
    />
    <FormInput
      v-if="!isEditing"
      name="password_confirmation"
      type="password"
      required
    />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
    </button>
  </form>
</template>
```

## Auto-Generated Features

### 1. Labels from Field Names

```javascript
// Field name → Generated label
"username"              → "Username"
"email"                 → "Email"
"password"              → "Password"
"password_confirmation" → "Password Confirmation"
"first_name"            → "First Name"
"user_role"             → "User Role"
```

### 2. Placeholders from Labels

```javascript
// Label → Generated placeholder
"Username"              → "Enter username"
"Email"                 → "Enter email"
"Password Confirmation" → "Enter password confirmation"
```

### 3. Automatic Data Binding

```javascript
// FormInput automatically binds to:
formData[fieldName]     // For values
fieldErrors[fieldName]  // For error messages
```

## Advanced Usage

### Custom Labels and Placeholders

You can still override auto-generated values:

```vue
<FormInput
  name="username"
  label="Your Username"
  placeholder="Choose a unique username"
  required
/>
```

### Explicit v-model (Still Supported)

```vue
<FormInput
  name="username"
  v-model="customValue"
  :error="customError"
  required
/>
```

### Conditional Logic

```vue
<FormInput
  name="password"
  type="password"
  :label="isEditing ? 'New Password (optional)' : 'Password'"
  :required="!isEditing"
/>
```

## Benefits

### 1. **Dramatically Less Code**

```vue
<!-- Before: Explicit everything -->
<FormInput
  name="username"
  v-model="formData.username"
  label="Username"
  placeholder="Enter your username"
  :error="fieldErrors.username"
  required
/>

<!-- After: Minimal inline -->
<FormInput name="username" required />
```

### 2. **Self-Documenting**

Field names become the source of truth for labels and structure.

### 3. **Consistent Behavior**

All forms automatically follow the same patterns.

### 4. **Flexible Override**

Can still override any auto-generated value when needed.

### 5. **Backward Compatible**

Existing explicit usage still works perfectly.

## Migration Guide

### From Explicit to Minimal

1. **Remove explicit props** that can be auto-generated:
   ```vue
   <!-- Remove these if using standard patterns -->
   v-model="formData.fieldName"
   label="Field Name"
   placeholder="Enter field name"
   :error="fieldErrors.fieldName"
   ```

2. **Keep necessary props**:
   ```vue
   <!-- Keep these -->
   type="password"
   required
   disabled
   hint="Custom hint text"
   ```

3. **Custom labels only when needed**:
   ```vue
   <!-- Only when auto-generated label isn't suitable -->
   label="Custom Label"
   placeholder="Custom placeholder"
   ```

## Best Practices

1. **Use semantic field names**: `password_confirmation` instead of `pwdConf`
2. **Leverage auto-generation**: Let the component generate labels and placeholders
3. **Override only when necessary**: Custom labels/placeholders only for special cases
4. **Initialize form data**: Always set initial values in formData
5. **Use consistent naming**: Follow underscore_case for compound field names

This approach provides the cleanest, most maintainable way to handle forms while maintaining full flexibility when needed!