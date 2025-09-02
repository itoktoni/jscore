# Global Form Validation Composable

## Overview

The `useFormValidation` composable provides centralized form validation and error handling for API responses. It simplifies form management by handling validation rules, API errors, and form submission states.

## Features

- **Centralized Validation**: Define validation rules once and reuse across forms
- **API Error Handling**: Automatically maps API validation errors to form fields
- **Common Validation Rules**: Pre-built rules for common validations
- **Loading States**: Built-in submission state management
- **Field Error Management**: Reactive error handling for individual fields
- **Global Error Handling**: Centralized error messaging

## Usage

### Basic Setup

```javascript
import { reactive } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

export default {
  setup() {
    const {
      isSubmitting,
      globalError,
      submitForm,
      commonRules
    } = useFormValidation()

    const formData = reactive({
      username: '',
      email: '',
      password: ''
    })

    const fieldErrors = reactive({
      username: '',
      email: '',
      password: ''
    })

    return {
      formData,
      fieldErrors,
      globalError,
      isSubmitting
    }
  }
}
```

### Validation Rules

#### Using Common Rules

```javascript
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3, 'Username must be at least 3 characters')
  },
  email: {
    ...commonRules.required('Email is required'),
    ...commonRules.email()
  },
  password: commonRules.password(6), // Minimum 6 characters
  password_confirmation: commonRules.confirmPassword('password')
}
```

#### Available Common Rules

- `commonRules.required(message)` - Required field validation
- `commonRules.email(message)` - Email format validation
- `commonRules.minLength(length, message)` - Minimum length validation
- `commonRules.maxLength(length, message)` - Maximum length validation
- `commonRules.password(minLength)` - Password validation with minimum length
- `commonRules.confirmPassword(passwordField)` - Password confirmation validation
- `commonRules.username(minLength)` - Username validation with pattern matching

#### Custom Validation Rules

```javascript
const validationRules = {
  customField: {
    required: true,
    requiredMessage: 'This field is required',
    custom: (value, formData) => {
      if (value !== 'expected') {
        return 'Custom validation failed'
      }
      return true
    }
  }
}
```

### Form Submission

#### Basic Submission

```javascript
const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      // Your API call here
      return await api.submitData(data)
    },
    formData,
    fieldErrors,
    {
      validationRules,
      redirectUrl: '/success',
      onSuccess: (response) => {
        console.log('Form submitted successfully', response)
      }
    }
  )
}
```

#### Advanced Submission Options

```javascript
const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      return await api.submitData(data)
    },
    formData,
    fieldErrors,
    {
      validationRules: validationRules,
      redirectUrl: '/success',
      skipValidation: false, // Set to true to skip client-side validation
      onSuccess: (response) => {
        // Custom success handler
        console.log('Success:', response)
      },
      onError: (error) => {
        // Custom error handler
        console.log('Error:', error)
      }
    }
  )
}
```

### Template Usage

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      id="username"
      v-model="formData.username"
      label="Username"
      :error="fieldErrors.username"
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

    <FormButton
      type="submit"
      variant="primary"
      :loading="isSubmitting"
      text="Submit"
      block
    />

    <div v-if="globalError" class="error-message">
      {{ globalError }}
    </div>
  </form>
</template>
```

## API Response Format

The composable expects API error responses in the following format:

### Validation Errors (422 status)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "username": ["Username is required"],
    "email": ["Email format is invalid"]
  }
}
```

### General Errors

```json
{
  "message": "Something went wrong"
}
```

## Examples

### Login Form

```javascript
const handleLogin = async () => {
  await submitForm(
    async (data) => {
      return await authStore.login(data.username, data.password)
    },
    formData,
    fieldErrors,
    {
      validationRules: {
        username: commonRules.required('Username is required'),
        password: commonRules.required('Password is required')
      },
      redirectUrl: '/dashboard'
    }
  )
}
```

### User Registration

```javascript
const handleRegister = async () => {
  await submitForm(
    async (data) => {
      return await authStore.register(data)
    },
    formData,
    fieldErrors,
    {
      validationRules: {
        username: commonRules.username(3),
        email: commonRules.email(),
        password: commonRules.password(8),
        password_confirmation: commonRules.confirmPassword('password')
      },
      onSuccess: () => {
        alert('Registration successful!')
      }
    }
  )
}
```

### Profile Update

```javascript
const handleUpdateProfile = async () => {
  await submitForm(
    async (data) => {
      return await userStore.updateProfile(data)
    },
    formData,
    fieldErrors,
    {
      validationRules: {
        name: {
          ...commonRules.required('Name is required'),
          ...commonRules.minLength(2)
        },
        email: commonRules.email()
      },
      onSuccess: () => {
        editMode.value = false
      }
    }
  )
}
```

## Manual Validation

You can also use the validation manually without form submission:

```javascript
const { validateForm, resetErrors } = useFormValidation()

const checkForm = () => {
  const isValid = validateForm(formData, fieldErrors, validationRules)
  if (!isValid) {
    console.log('Form has errors')
    return
  }
  console.log('Form is valid')
}

// Reset all errors
const clearFormErrors = () => {
  resetErrors(fieldErrors)
}
```

## Benefits

1. **Consistency**: All forms use the same validation patterns
2. **Reusability**: Common validation rules can be reused across forms
3. **API Integration**: Automatic mapping of API errors to form fields
4. **Error Handling**: Centralized error management
5. **Loading States**: Built-in submission state management
6. **Type Safety**: Better TypeScript support with predictable patterns
7. **Maintainability**: Centralized validation logic is easier to maintain and update