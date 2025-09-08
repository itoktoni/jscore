# Route Names Usage Guide

This document explains how to use route names instead of paths for navigation in the application.

## Available Route Names

The following route names are available in the application:

| Route Name | Path | Component |
|------------|------|-----------|
| Login | /login | LoginPage |
| Register | /register | RegisterPage |
| Profile | /profile | ProfilePage |
| UserList | /users | TablePage |
| UserTable | /users/table | TablePage |
| UserCreate | /users/create | CreatePage |
| UserEdit | /users/:id/edit | EditPage |
| UserDashboard | /dashboard | DashboardPage |
| SystemSettings | /system/settings | SystemSettingsPage |
| TestSafeArea | /test-safe-area | TestSafeArea |
| TestSafeAreaPage | /test-safe-area-page | TestSafeAreaPage |

## Usage Examples

### Navigate to a Route by Name

Instead of using the path:
```javascript
router.push('/users/create')
```

Use the route name:
```javascript
router.push({ name: 'CreateUser' })
```

### Navigate to a Route with Parameters

For routes that require parameters (like EditUser):
```javascript
router.push({ name: 'EditUser', params: { id: userId } })
```

### Navigate with Query Parameters

To add query parameters:
```javascript
router.push({ name: 'UserList', query: { page: 2, search: 'john' } })
```

## Benefits of Using Route Names

1. **Maintainability**: If a route path changes, you only need to update it in the router configuration, not in every component that uses it.
2. **Readability**: Route names are more descriptive and easier to understand than paths.
3. **Refactoring**: Makes it easier to refactor routes without breaking navigation.
4. **Type Safety**: Some IDEs can provide better autocomplete and error checking with named routes.

## Implementation in Components

All user management components have been updated to use route names:

1. **Create.vue**: Navigates to `UserList` after successful user creation
2. **Edit.vue**: Navigates to `UserList` after successful user update
3. **List.vue**: Navigates to `UserCreate` when creating a new user, and to `UserEdit` when editing a user

This approach ensures consistency and makes the application easier to maintain.