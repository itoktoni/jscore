# Server Validation Error Fix

## Problem
Server validation errors (422 responses) were showing only as global errors instead of being mapped to specific input fields.

**Example Server Response:**
```json
{
    "message": "username yang dipilih tidak valid.",
    "errors": {
        "username": [
            "username yang dipilih tidak valid."
        ]
    }
}
```

**Expected Behavior:** Error should appear below the username input field
**Actual Behavior:** Error only appeared as global error message

## Root Cause

The auth store catches API errors and returns them in this format:
```javascript
{
  success: false,
  error: error.message,
  errorData: error.response?.data  // Contains the 422 validation response
}
```

But the validation composable was only looking for direct API exceptions, not for errors wrapped in the `errorData` field.

## Solution

### 1. Enhanced Error Handling in `useSimpleValidation.js`

Added logic in the `submitForm` function to detect when a result contains `errorData` with validation errors:

```javascript
// Check if this is actually an API error disguised as a result
if (result && result.errorData && result.errorData.errors) {
  // This looks like a 422 validation error from auth store
  const mockError = {
    response: {
      status: 422,
      data: result.errorData
    }
  }
  handleApiError(mockError, form)
}
```

### 2. Improved API Error Mapping

The `handleApiError` function now properly:
- Clears previous errors
- Sets global error message
- Maps field-specific errors to input elements
- Adds error styling and messages

## How It Works Now

1. **User submits form** with invalid data
2. **Server returns 422** with field errors
3. **Auth store catches error** and wraps it in `errorData`
4. **Validation composable detects** `errorData.errors`
5. **Converts wrapped error** to expected format
6. **Maps errors to fields** using `handleApiError`
7. **Error appears below input** with red styling

## Result

### Before (Global Error Only):
```
🔴 [Global Error] username yang dipilih tidak valid.

[Username Input] ← No field-specific error
[Password Input]
```

### After (Field-Specific Errors):
```
[Username Input] ← Red border + error below
🔴 username yang dipilih tidak valid.
[Password Input]

🔴 [Global Error] username yang dipilih tidak valid.
```

## Server Response Support

The fix supports Laravel-style validation responses:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "username": ["The username field is required."],
    "email": ["The email format is invalid."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

Each field error will automatically appear below the corresponding input element with proper styling.

## Usage

No changes required in existing forms. The fix works automatically with:

```html
<form ref="loginForm" @submit.prevent="handleLogin">
  <input name="username" rules="required|min:3" />
  <input name="password" rules="required|min:4" />
  <button type="submit">Login</button>
</form>
```

The validation errors will now properly map to the `name` attribute of each input field.