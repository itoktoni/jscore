# Modern Form Components Guide

## Overview

We've modernized the form components to use Vue 3 Composition API with `<script setup>` syntax and ultra-minimal inline usage patterns. All components now auto-bind to form context and provide seamless integration.

## Components Available

### 1. FormInput
- **Ultra-minimal syntax**: `<FormInput name="username" rules="required|min:3" />`
- **Auto-binding**: Automatically binds to `formData[name]` and `fieldErrors[name]`
- **Auto-generation**: Labels, placeholders, and required indicators
- **Inline validation**: Rules-based validation with `rules` attribute

### 2. FormButton
- **Auto-loading**: Automatically shows loading state for submit buttons
- **Multiple variants**: primary, secondary, success, danger, warning, info
- **Flexible sizing**: small, medium, large
- **Mobile-optimized**: Touch-friendly design

### 3. FormSelect
- **Auto-binding**: Same pattern as FormInput with auto-binding
- **Flexible options**: Supports arrays or objects
- **Auto-generation**: Labels and placeholders from field names
- **Validation support**: Rules-based validation

## Basic Usage Examples

### Ultra-Minimal Form
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Just name and rules - everything else is automatic! -->
    <FormInput name="username" rules="required|min:3|alpha_num" />
    <FormInput name="email" type="email" rules="required|email" />
    <FormInput name="password" type="password" rules="required|min:6" />

    <!-- Auto-loading submit button -->
    <FormButton type="submit" variant="primary" text="Submit" block />
  </form>
</template>

<script setup>
import { useFormValidation } from '../composables/useFormValidation'
import FormInput from '../components/FormInput.vue'
import FormButton from '../components/FormButton.vue'

const { formData, submitForm } = useFormValidation()

// Initialize form data
formData.username = ''
formData.email = ''
formData.password = ''

const handleSubmit = async () => {
  await submitForm(async (data) => await apiCall(data), {}, {})
}
</script>
```

### FormSelect Examples
```vue
<template>
  <!-- Simple array options -->
  <FormSelect
    name="user_role"
    rules="required"
    :options="['User', 'Admin', 'Moderator']"
  />

  <!-- Object options with custom keys -->
  <FormSelect
    name="country"
    rules="required"
    :options="countries"
    option-label="name"
    option-value="code"
    hint="Select your country"
  />
</template>

<script setup>
const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' }
]
</script>
```

### FormButton Variants
```vue
<template>
  <!-- Different variants -->
  <FormButton variant="primary" text="Primary" />
  <FormButton variant="secondary" text="Secondary" />
  <FormButton variant="success" text="Success" />
  <FormButton variant="danger" text="Delete" />

  <!-- Different sizes -->
  <FormButton size="small" text="Small" />
  <FormButton size="medium" text="Medium" />
  <FormButton size="large" text="Large" />

  <!-- Block button -->
  <FormButton block text="Full Width" />

  <!-- With loading state -->
  <FormButton :loading="isLoading" text="Save" />
</template>
```

## Advanced Features

### 1. Auto-Loading State
Submit buttons automatically show loading state when form is submitting:

```vue
<FormButton type="submit" text="Login" />
<!-- Automatically shows spinner and "Loading..." when submitting -->
```

### 2. Custom Validation
```vue
<FormInput
  name="username"
  rules="required|min:3|custom:checkAvailability"
  :customValidators="{ checkAvailability: asyncValidator }"
/>
```

### 3. Conditional Rules
```vue
<FormInput
  name="password"
  type="password"
  :rules="isEditing ? 'min:6' : 'required|min:6'"
/>
```

### 4. Form Context Auto-Binding
All components automatically:
- Bind to `formData[name]` for values
- Bind to `fieldErrors[name]` for errors
- Detect loading state from form submission
- Clear errors when user interacts

## Migration from Old Components

### Before (Old Pattern)
```vue
<template>
  <div class="form-group">
    <label for="username">Username</label>
    <input
      id="username"
      v-model="formData.username"
      :class="{ error: fieldErrors.username }"
      required
    />
    <div v-if="fieldErrors.username" class="error">
      {{ fieldErrors.username }}
    </div>
  </div>

  <button
    type="submit"
    :disabled="isSubmitting"
    class="btn btn-primary"
  >
    {{ isSubmitting ? 'Loading...' : 'Submit' }}
  </button>
</template>

<script>
export default {
  // Options API...
}
</script>
```

### After (New Pattern)
```vue
<template>
  <FormInput name="username" rules="required|min:3" />
  <FormButton type="submit" variant="primary" text="Submit" />
</template>

<script setup>
import { useFormValidation } from '../composables/useFormValidation'

const { formData, submitForm } = useFormValidation()
formData.username = ''
</script>
```

## Key Benefits

### 1. **90% Less Code**
- No manual v-model binding
- No manual error handling
- No manual loading states
- No validation rules objects

### 2. **Self-Documenting**
```vue
<!-- Rules are visible directly in template -->
<FormInput name="email" rules="required|email|min:5" />
```

### 3. **Consistent Behavior**
- All forms follow same patterns
- Automatic error handling
- Consistent styling
- Mobile-optimized

### 4. **Auto-Generation**
- Labels from field names (`user_name` → "User Name")
- Placeholders from labels ("Enter user name")
- Required indicators (asterisk)
- IDs and accessibility attributes

### 5. **Flexible Override**
```vue
<!-- Can still override when needed -->
<FormInput
  name="username"
  rules="required|min:3"
  label="Custom Label"
  placeholder="Custom placeholder"
  hint="Custom hint text"
/>
```

## Component Props

### FormInput Props
- `name` (string) - Field name (required for auto-binding)
- `rules` (string) - Validation rules (e.g., "required|email|min:3")
- `type` (string) - Input type (default: "text")
- `label` (string) - Custom label (auto-generated if not provided)
- `placeholder` (string) - Custom placeholder (auto-generated if not provided)
- `hint` (string) - Help text
- `disabled` (boolean) - Disable input
- `customValidators` (object) - Custom validation functions

### FormButton Props
- `type` (string) - Button type (default: "button")
- `variant` (string) - Style variant: primary, secondary, success, danger, warning, info
- `size` (string) - Size: small, medium, large
- `text` (string) - Button text
- `loading` (boolean) - Manual loading state
- `disabled` (boolean) - Disable button
- `block` (boolean) - Full width button

### FormSelect Props
- `name` (string) - Field name (required for auto-binding)
- `options` (array) - Select options
- `optionLabel` (string) - Key for option labels (default: "label")
- `optionValue` (string) - Key for option values (default: "value")
- `rules` (string) - Validation rules
- `label` (string) - Custom label (auto-generated if not provided)
- `placeholder` (string) - Custom placeholder (auto-generated if not provided)
- `hint` (string) - Help text
- `disabled` (boolean) - Disable select

## Best Practices

1. **Use semantic field names**: `password_confirmation` instead of `pwdConf`
2. **Leverage auto-generation**: Let components generate labels and placeholders
3. **Use rules for validation**: Define validation inline with rules attribute
4. **Initialize form data**: Always set initial values in formData
5. **Keep it minimal**: Only override auto-generated values when necessary

This modern approach provides the cleanest, most maintainable way to handle forms while maintaining full flexibility when needed!