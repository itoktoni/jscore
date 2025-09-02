# FormInput Component Validation Guide

## Overview

This guide demonstrates how to use FormInput components with the enhanced `useFormValidation` composable for reactive form validation. This approach provides a clean, maintainable, and reusable form validation system.

## Key Features

- **FormInput Components**: Reusable input components with built-in error handling
- **Reactive Validation**: Real-time form validation with reactive data
- **Common Rules**: Pre-built validation rules for common scenarios
- **API Error Mapping**: Automatic mapping of server validation errors
- **Mobile Optimized**: Touch-friendly and responsive design

## Basic Usage

### 1. Import Required Dependencies

```javascript
import { onMounted } from 'vue'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
```

### 2. Setup Form Validation

```javascript
export default {
  components: {
    FormInput
  },
  setup() {
    const {
      isSubmitting,
      globalError,
      fieldErrors,
      formData,
      commonRules,
      submitForm
    } = useFormValidation()

    // Initialize form data
    onMounted(() => {
      formData.username = ''
      formData.email = ''
      formData.password = ''
    })
  }
}
```

### 3. Create Validation Rules

```javascript
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3, 'Username must be at least 3 characters'),
    ...commonRules.alphaNum('Username must contain only letters and numbers')
  },
  email: {
    ...commonRules.required('Email is required'),
    ...commonRules.email()
  },
  password: {
    ...commonRules.required('Password is required'),
    ...commonRules.minLength(6, 'Password must be at least 6 characters')
  }
}
```

### 4. Template Usage

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      id="username"
      v-model="formData.username"
      label="Username"
      placeholder="Enter your username"
      :error="fieldErrors.username"
      hint="Must be 3-20 characters, letters and numbers only"
      required
    />

    <FormInput
      id="email"
      v-model="formData.email"
      type="email"
      label="Email Address"
      placeholder="Enter your email"
      :error="fieldErrors.email"
      required
    />

    <FormInput
      id="password"
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

### 5. Form Submission

```javascript
const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      return await apiService.submitData(data)
    },
    validationRules,
    {
      redirectUrl: '/success',
      onSuccess: (response) => {
        console.log('Success:', response)
      }
    }
  )
}
```

## Available Common Rules

### Basic Rules
```javascript
commonRules.required('Custom message')           // Required field
commonRules.email('Custom message')              // Email validation
commonRules.minLength(6, 'Custom message')       // Minimum length
commonRules.maxLength(50, 'Custom message')      // Maximum length
commonRules.numeric('Custom message')            // Numbers only
commonRules.alpha('Custom message')              // Letters only
commonRules.alphaNum('Custom message')           // Letters and numbers
```

### Specialized Rules
```javascript
commonRules.username(3)                          // Username validation (3+ chars, alphanumeric)
commonRules.password(8)                          // Password validation (8+ chars)
commonRules.confirmPassword('password')          // Password confirmation
```

### Custom Rules
```javascript
const validationRules = {
  customField: {
    ...commonRules.required(),
    custom: (value, formData) => {
      if (value !== 'expected') {
        return 'Custom validation failed'
      }
      return true
    }
  }
}
```

## FormInput Component Props

```javascript
// Required props
id: String              // Unique input ID
v-model: String/Number  // Reactive form data binding

// Optional props
type: String            // Input type (text, email, password, etc.)
label: String           // Field label
placeholder: String     // Placeholder text
error: String           // Error message to display
hint: String            // Help text
disabled: Boolean       // Disable input
required: Boolean       // Mark as required
```

## Complete Examples

### Login Form

```vue
<template>
  <form @submit.prevent="handleLogin">
    <FormInput
      id="username"
      v-model="formData.username"
      label="Username"
      placeholder="Enter your username"
      :error="fieldErrors.username"
      required
    />

    <FormInput
      id="password"
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
</template>

<script>
export default {
  setup() {
    const { /* ... validation setup ... */ } = useFormValidation()

    onMounted(() => {
      formData.username = ''
      formData.password = ''
    })

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

    return { formData, fieldErrors, globalError, isSubmitting, handleLogin }
  }
}
</script>
```

### Registration Form

```vue
<template>
  <form @submit.prevent="handleRegister">
    <FormInput
      id="username"
      v-model="formData.username"
      label="Username"
      :error="fieldErrors.username"
      hint="3-20 characters, letters and numbers only"
      required
    />

    <FormInput
      id="email"
      v-model="formData.email"
      type="email"
      label="Email"
      :error="fieldErrors.email"
      required
    />

    <FormInput
      id="password"
      v-model="formData.password"
      type="password"
      label="Password"
      :error="fieldErrors.password"
      hint="At least 6 characters"
      required
    />

    <FormInput
      id="password_confirmation"
      v-model="formData.password_confirmation"
      type="password"
      label="Confirm Password"
      :error="fieldErrors.password_confirmation"
      required
    />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
    </button>
  </form>
</template>

<script>
export default {
  setup() {
    const { /* ... validation setup ... */ } = useFormValidation()

    onMounted(() => {
      formData.username = ''
      formData.email = ''
      formData.password = ''
      formData.password_confirmation = ''
    })

    const validationRules = {
      username: {
        ...commonRules.required(),
        ...commonRules.minLength(3),
        ...commonRules.maxLength(20),
        ...commonRules.alphaNum()
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

    return { formData, fieldErrors, globalError, isSubmitting, handleRegister }
  }
}
</script>
```

## API Error Handling

The system automatically handles API validation errors (422 responses):

```json
{
  "message": "Validation failed",
  "errors": {
    "username": ["Username is already taken"],
    "email": ["Email format is invalid"]
  }
}
```

These errors will automatically appear in the corresponding FormInput components.

## Advantages Over Native Inputs

1. **Cleaner Templates**: No need for manual error handling in templates
2. **Consistent Styling**: Unified input appearance across the app
3. **Reactive Validation**: Real-time validation feedback
4. **Built-in Accessibility**: Proper ARIA attributes and labels
5. **Mobile Optimized**: Touch-friendly inputs with proper sizing
6. **Reusable Components**: Consistent behavior across forms
7. **Less Code**: Significantly reduced boilerplate code

## Migration from Native Inputs

To migrate from native HTML inputs to FormInput components:

1. Replace `<input>` elements with `<FormInput>` components
2. Remove manual error handling from templates
3. Use `v-model` with reactive `formData`
4. Bind `:error` to `fieldErrors[fieldName]`
5. Remove `rules` attributes (now handled by validation rules object)
6. Use the new `submitForm` method

## Best Practices

1. **Initialize Form Data**: Always initialize form fields in `onMounted()`
2. **Use Common Rules**: Leverage pre-built validation rules when possible
3. **Provide Hints**: Use the `hint` prop for user guidance
4. **Handle Success**: Use `onSuccess` callback for post-submission actions
5. **Error Handling**: Let the system handle API errors automatically
6. **Loading States**: Use `isSubmitting` for button states
7. **Form Validation**: Let the composable handle all validation logic

This approach provides a much cleaner, more maintainable, and more powerful form validation system!