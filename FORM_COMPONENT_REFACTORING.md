# Form Component Refactoring

This document explains the refactoring of the form components to simplify their structure and usage.

## Changes Made

### 1. Form.vue Component (Simplified)
- Removed unnecessary imports (FormButton, useFormValidation)
- Simplified the component to be just a form definition
- Kept only essential props and methods
- Replaced FormButton components in the footer with standard HTML buttons
- Removed unused props (showSuccessNotification, successMessage, successNotificationTimer)
- Maintained the FormContainer structure with FormInput and ApiSelect elements

### 2. Create.vue Component
- Updated to use the simplified Form component
- Added explicit handlers for all form events (onSuccess, onError, onCancel)
- Simplified the script setup

### 3. Edit.vue Component
- Updated to use the simplified Form component
- Added explicit handlers for all form events (onSuccess, onError, onCancel)
- Maintained user data loading logic

## New Component Structure

### Form.vue (Definition Only)
The Form.vue component now serves as a pure form definition:

```vue
<FormContainer
  ref="formContainerRef"
  :title="title"
  :initial-data="initialData"
  :action="onSubmit"
  @success="onSuccess"
  @error="onError"
>
  <FormInput name="username" rules="required" :disabled="isEditing" col="6" />
  <FormInput name="name" rules="required" col="6" />
  <FormInput name="email" rules="required" type="email" col="12" />

  <FormInput
    name="password"
    type="password"
    :rules="!isEditing ? 'required|min:6' : 'min:6'"
    col="6"
  />
  <FormInput
    v-if="!isEditing"
    rules="required|confirmed"
    name="password_confirmation"
    type="password"
    col="6"
  />

  <ApiSelect
    name="role"
    endpoint="roles"
    rules="required"
    searchable
    option-label="name"
    option-value="id"
    col="6"
    label="Role"
  />

  <template #footer="{ isSubmitting }">
    <button type="button" @click="onCancel">← Back</button>
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
    </button>
  </template>
</FormContainer>
```

### Usage in Create.vue
```vue
<Form
  ref="formRef"
  title="Create New User"
  :is-editing="false"
  :on-submit="handleSubmit"
  :on-success="handleSuccess"
  :on-error="handleError"
  :on-cancel="handleCancel"
/>
```

### Usage in Edit.vue
```vue
<Form
  title="Edit User"
  :is-editing="true"
  :initial-data="initialFormData"
  :on-submit="handleSubmit"
  :on-success="handleSuccess"
  :on-error="handleError"
  :on-cancel="handleCancel"
/>
```

## Benefits

1. **Simpler Components**: Form.vue is now a pure definition component
2. **Clearer Separation**: Logic is moved to the page components (Create.vue, Edit.vue)
3. **Easier Maintenance**: Changes to form structure only need to be made in one place
4. **Consistent API**: Both Create and Edit components use the same Form component
5. **Better Event Handling**: Explicit event handlers make the code more readable
6. **Reduced Complexity**: Removed unnecessary props and dependencies

## Implementation Details

### Form.vue
- Still uses FormContainer for form management
- Still includes all necessary form fields
- Uses standard HTML buttons instead of FormButton components
- Exposes resetForm method for parent components
- Removed unused props to simplify the API

### Create.vue and Edit.vue
- Handle all form events explicitly
- Manage their own navigation logic
- Handle success, error, and cancel events
- Maintain references to the form for resetting

## Migration Notes

When using the new Form component:
1. Always provide handlers for onSuccess, onError, and onCancel events
2. Use the isEditing prop to control field behavior
3. Provide initialData for edit forms
4. Use the ref to access the resetForm method when needed

This refactoring makes the form components more modular and easier to maintain while preserving all existing functionality.