# Rules-Based FormInput Validation Guide

## Overview

The FormInput component now supports inline validation using a `rules` attribute, eliminating the need for separate validation rules objects in the script section. This provides a more intuitive, self-documenting approach to form validation.

## Key Features

- **Inline Validation Rules**: Define validation directly on FormInput components
- **Automatic Required Detection**: Auto-detects required fields from rules
- **Real-time Validation**: Validates on blur and shows errors immediately
- **Visual Indicators**: Required asterisk (*) and error styling
- **Self-Documenting**: Rules are visible directly in the template
- **No Script Setup**: No validation rules objects needed in script section

## Basic Syntax

```vue
<FormInput name="fieldName" rules="rule1|rule2|rule3" />
```

## Available Rules

### Basic Rules
- `required` - Field is required
- `email` - Must be valid email format
- `min:X` - Minimum length (X characters)
- `max:X` - Maximum length (X characters)
- `numeric` - Must be numeric only
- `alpha` - Must be letters only
- `alpha_num` - Must be letters and numbers only
- `confirmed` - Must match password field (for password confirmation)

### Rule Examples

```vue
<!-- Username: required, 3-20 chars, alphanumeric -->
<FormInput name="username" rules="required|min:3|max:20|alpha_num" />

<!-- Email: required, valid email format -->
<FormInput name="email" type="email" rules="required|email" />

<!-- Password: required, minimum 6 characters -->
<FormInput name="password" type="password" rules="required|min:6" />

<!-- Password confirmation: required, must match password -->
<FormInput name="password_confirmation" type="password" rules="required|confirmed" />

<!-- Optional field with validation when provided -->
<FormInput name="phone" rules="numeric|min:10" />
```

## Complete Examples

### 1. Login Form

```vue
<template>
  <form @submit.prevent="handleLogin">
    <FormInput name="username" rules="required|min:3" />
    <FormInput name="password" type="password" rules="required|min:4" />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Logging in...' : 'Login' }}
    </button>
  </form>

  <div v-if="globalError" class="error-message">
    {{ globalError }}
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const authStore = useAuthStore()
const { isSubmitting, globalError, formData, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.password = ''

const handleLogin = async () => {
  await submitForm(
    async (data) => {
      return await authStore.login(data.username, data.password)
    },
    {}, // No validation rules needed - handled by FormInput
    {
      redirectUrl: '/profile'
    }
  )
}
</script>
```

### 2. Registration Form

```vue
<template>
  <form @submit.prevent="handleRegister">
    <FormInput
      name="username"
      rules="required|min:3|max:20|alpha_num"
      hint="Must be 3-20 characters, letters and numbers only"
    />
    <FormInput name="name" rules="required|min:2|max:50" />
    <FormInput name="email" type="email" rules="required|email" />
    <FormInput
      name="password"
      type="password"
      rules="required|min:6"
      hint="Must be at least 6 characters"
    />
    <FormInput name="password_confirmation" type="password" rules="required|confirmed" />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
    </button>
  </form>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'

const authStore = useAuthStore()
const { isSubmitting, globalError, formData, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''
formData.password = ''
formData.password_confirmation = ''

const handleRegister = async () => {
  await submitForm(
    async (data) => await authStore.register(data),
    {}, // No validation rules needed
    { redirectUrl: '/profile' }
  )
}
</script>
```

### 3. Dynamic Validation (User Form)

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      name="username"
      rules="required|min:3|alpha_num"
      :disabled="isEditing"
      :hint="isEditing ? 'Username cannot be changed' : ''"
    />
    <FormInput name="name" rules="required|min:2" />
    <FormInput name="email" type="email" rules="required|email" />

    <!-- Dynamic rules based on editing state -->
    <FormInput
      name="password"
      type="password"
      :rules="!isEditing ? 'required|min:6' : 'min:6'"
      :label="isEditing ? 'New Password (leave blank to keep current)' : 'Password'"
    />

    <FormInput
      v-if="!isEditing"
      name="password_confirmation"
      type="password"
      rules="required|confirmed"
    />

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
    </button>
  </form>
</template>

<script setup>
const props = defineProps({
  isEditing: { type: Boolean, default: false }
})

const { isSubmitting, formData, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.name = ''
formData.email = ''
formData.password = ''
formData.password_confirmation = ''

const handleSubmit = async () => {
  await submitForm(
    async (data) => {
      // Handle create/update logic
      return await userStore.saveUser(data)
    },
    {}, // No validation rules needed
    {
      onSuccess: () => {
        console.log('User saved successfully')
      }
    }
  )
}
</script>
```

## Auto-Generated Features

### 1. Required Field Detection
```vue
<!-- Automatically shows asterisk (*) for required fields -->
<FormInput name="username" rules="required|min:3" />
<!-- Label becomes: "Username *" -->
```

### 2. Label Generation
```vue
<!-- Automatic label generation from field names -->
<FormInput name="password_confirmation" rules="required|confirmed" />
<!-- Label becomes: "Password Confirmation *" -->
```

### 3. Error Display
```vue
<!-- Automatic error display with styling -->
<FormInput name="email" rules="required|email" />
<!-- Shows error: "Please enter a valid email address" -->
```

### 4. Validation Timing
- **On Blur**: Validates when user leaves the field
- **On Input**: Clears errors when user starts typing
- **On Submit**: Final validation before form submission

## Rule Combinations

### Common Patterns

```vue
<!-- Username validation -->
<FormInput name="username" rules="required|min:3|max:20|alpha_num" />

<!-- Email validation -->
<FormInput name="email" type="email" rules="required|email" />

<!-- Strong password -->
<FormInput name="password" type="password" rules="required|min:8" />

<!-- Password confirmation -->
<FormInput name="password_confirmation" type="password" rules="required|confirmed" />

<!-- Optional phone number -->
<FormInput name="phone" rules="numeric|min:10|max:15" />

<!-- Name validation -->
<FormInput name="first_name" rules="required|min:2|max:30|alpha" />

<!-- Numeric field -->
<FormInput name="age" rules="required|numeric|min:1|max:3" />
```

### Conditional Rules

```vue
<!-- Dynamic rules based on component state -->
<FormInput
  name="password"
  type="password"
  :rules="isEditing ? 'min:6' : 'required|min:6'"
/>

<!-- Required only in certain conditions -->
<FormInput
  name="company"
  :rules="userType === 'business' ? 'required|min:2' : 'min:2'"
/>
```

## Migration Guide

### From Validation Rules Objects

**Before:**
```vue
<template>
  <FormInput
    name="username"
    v-model="formData.username"
    label="Username"
    :error="fieldErrors.username"
    required
  />
</template>

<script setup>
const validationRules = {
  username: {
    ...commonRules.required('Username is required'),
    ...commonRules.minLength(3, 'Username must be at least 3 characters'),
    ...commonRules.alphaNum('Username must contain only letters and numbers')
  }
}

const handleSubmit = async () => {
  await submitForm(apiCall, validationRules, options)
}
</script>
```

**After:**
```vue
<template>
  <FormInput name="username" rules="required|min:3|alpha_num" />
</template>

<script setup>
const handleSubmit = async () => {
  await submitForm(apiCall, {}, options) // No validation rules needed
}
</script>
```

### Migration Steps

1. **Remove validation rules objects** from script section
2. **Add rules attribute** to FormInput components
3. **Remove explicit props** that are now auto-generated:
   - `v-model` (auto-bound to formData)
   - `label` (auto-generated from name)
   - `:error` (auto-bound to fieldErrors)
   - `required` (auto-detected from rules)
4. **Pass empty object** `{}` as validation rules to submitForm
5. **Keep hints and custom labels** when needed

## Benefits

### 1. **Self-Documenting Code**
```vue
<!-- Rules are immediately visible in template -->
<FormInput name="email" rules="required|email" />
```

### 2. **Reduced Code Complexity**
```javascript
// Before: 15+ lines of validation rules
const validationRules = { /* complex object */ }

// After: 0 lines - handled inline
const handleSubmit = async () => {
  await submitForm(apiCall, {}, options)
}
```

### 3. **Better Developer Experience**
- Rules visible directly in template
- No context switching between template and script
- Easier to understand form requirements
- Faster to implement and modify

### 4. **Consistent Validation**
- Same validation logic across all components
- Centralized rule processing
- Automatic error handling and display

### 5. **Flexible Override**
```vue
<!-- Can still override auto-generated features -->
<FormInput
  name="username"
  rules="required|min:3"
  label="Custom Label"
  placeholder="Custom placeholder"
  hint="Custom hint"
/>
```

## Advanced Features

### Custom Error Messages
```vue
<!-- Future enhancement - custom error messages -->
<FormInput
  name="username"
  rules="required:Username is mandatory|min:3:Too short"
/>
```

### Rule Validation
The FormInput component validates rules in order and stops at the first failure, providing immediate feedback to users.

### Server-Side Integration
Client-side rules validation works seamlessly with server-side validation errors from 422 responses, maintaining consistent error display.

This approach provides the most intuitive and maintainable form validation experience while maintaining full flexibility and power!