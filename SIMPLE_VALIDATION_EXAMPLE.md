# Simple Rule-Based Validation

## Overview

The new simple validation approach allows you to add validation rules directly to HTML input elements using the `rules` attribute. This eliminates the need for complex validation objects and reduces code significantly.

## Basic Usage

### Login Form (Before vs After)

**Before (34 lines of logic):**
```javascript
const { isSubmitting, globalError, submitForm, commonRules } = useFormValidation()

const formData = reactive({
  username: '',
  password: ''
})

const fieldErrors = reactive({
  username: '',
  password: ''
})

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
    formData,
    fieldErrors,
    {
      validationRules,
      redirectUrl: '/profile'
    }
  )
}
```

**After (10 lines of logic):**
```javascript
const { isSubmitting, globalError, submitForm } = useSimpleValidation()
const loginForm = ref(null)

const handleLogin = async () => {
  await submitForm(
    loginForm.value,
    async (data) => {
      return await authStore.login(data.username, data.password)
    },
    { redirectUrl: '/profile' }
  )
}
```

### Template Usage

**Simple HTML with inline rules:**
```html
<form ref="loginForm" @submit.prevent="handleLogin">
  <div class="form-group">
    <label for="username">Username</label>
    <input
      id="username"
      name="username"
      type="text"
      rules="required|min:3"
      data-label="Username"
      required
    />
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input
      id="password"
      name="password"
      type="password"
      rules="required|min:4"
      data-label="Password"
      required
    />
  </div>

  <button type="submit" :disabled="isSubmitting">
    {{ isSubmitting ? 'Logging in...' : 'Login' }}
  </button>
</form>

<div v-if="globalError" class="error-message">
  {{ globalError }}
</div>
```

## Available Validation Rules

### Basic Rules
- `required` - Field is required
- `email` - Must be valid email format
- `min:3` - Minimum length (3 characters)
- `max:50` - Maximum length (50 characters)
- `numeric` - Must be numeric only
- `alpha` - Must be letters only
- `alpha_num` - Must be letters and numbers only
- `confirmed` - Must match password field

### Usage Examples

```html
<!-- Email field -->
<input
  name="email"
  type="email"
  rules="required|email"
  data-label="Email"
/>

<!-- Username field -->
<input
  name="username"
  type="text"
  rules="required|min:3|max:20|alpha_num"
  data-label="Username"
/>

<!-- Password field -->
<input
  name="password"
  type="password"
  rules="required|min:6"
  data-label="Password"
/>

<!-- Password confirmation -->
<input
  name="password_confirmation"
  type="password"
  rules="required|confirmed"
  data-label="Password Confirmation"
/>

<!-- Phone number -->
<input
  name="phone"
  type="tel"
  rules="required|numeric|min:10"
  data-label="Phone Number"
/>
```

## Complete Registration Form Example

```html
<template>
  <form ref="registerForm" @submit.prevent="handleRegister">
    <input
      name="username"
      type="text"
      placeholder="Username"
      rules="required|min:3|alpha_num"
      data-label="Username"
    />

    <input
      name="email"
      type="email"
      placeholder="Email"
      rules="required|email"
      data-label="Email"
    />

    <input
      name="password"
      type="password"
      placeholder="Password"
      rules="required|min:6"
      data-label="Password"
    />

    <input
      name="password_confirmation"
      type="password"
      placeholder="Confirm Password"
      rules="required|confirmed"
      data-label="Password Confirmation"
    />

    <button type="submit" :disabled="isSubmitting">
      Register
    </button>
  </form>

  <div v-if="globalError">{{ globalError }}</div>
</template>

<script>
import { ref } from 'vue'
import { useSimpleValidation } from '@/composables/useSimpleValidation'

export default {
  setup() {
    const { isSubmitting, globalError, submitForm } = useSimpleValidation()
    const registerForm = ref(null)

    const handleRegister = async () => {
      await submitForm(
        registerForm.value,
        async (data) => {
          return await authStore.register(data)
        },
        { redirectUrl: '/dashboard' }
      )
    }

    return {
      registerForm,
      isSubmitting,
      globalError,
      handleRegister
    }
  }
}
</script>
```

## Benefits

1. **Much Less Code**: Reduced from 34+ lines to ~10 lines of logic
2. **Inline Rules**: Validation rules directly on HTML elements
3. **No Form Data Objects**: No need for reactive form data or field errors
4. **Automatic Error Display**: Errors appear automatically below fields
5. **API Error Mapping**: Still handles API validation errors (422 responses)
6. **Simple Syntax**: Easy to read and understand
7. **Native HTML**: Works with standard HTML form elements

## API Error Handling

The system still automatically handles API errors just like before:

```json
{
  "message": "Validation failed",
  "errors": {
    "username": ["Username is already taken"],
    "email": ["Email format is invalid"]
  }
}
```

These errors will automatically appear below the corresponding form fields.

## Migration from Complex Validation

To migrate existing forms:

1. Replace `FormInput` components with native `<input>` elements
2. Add `rules` attribute to inputs
3. Add `name` attribute to inputs
4. Add `data-label` attribute for custom error messages
5. Add `ref` to the form element
6. Replace complex validation logic with simple `submitForm` call
7. Add CSS for `.field-error` and `.error` classes

This approach provides the same functionality with dramatically less code!