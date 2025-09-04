# FieldCell Component

A generic, reusable Vue component for displaying field values in a consistent and styled manner across different entities (users, products, orders, etc.).

## Features

- Generic component that can be used for any field type
- Supports various field types (text, number, boolean, email, username, status, price, etc.)
- Handles empty/null values with customizable empty text
- Customizable prefixes and suffixes
- Configurable boolean labels
- Consistent styling across the application
- Responsive design

## Usage

### Basic Usage

```vue
<template>
  <FieldCell :value="item.name" />
</template>

<script setup>
import FieldCell from '@/components/FieldCell.vue'
</script>
```

### With Field Type

```vue
<template>
  <FieldCell :value="item.price" field-type="price" />
  <FieldCell :value="item.active" field-type="status" />
  <FieldCell :value="item.email" field-type="email" />
</template>

<script setup>
import FieldCell from '@/components/FieldCell.vue'
</script>
```

### With Custom Configuration

```vue
<template>
  <FieldCell
    :value="item.active"
    field-type="status"
    :boolean-labels="{ true: 'Active', false: 'Inactive' }"
    :empty-text="'Not set'"
  />

  <FieldCell
    :value="item.username"
    field-type="username"
    :prefix="'@'"
  />

  <FieldCell
    :value="item.price"
    field-type="price"
    :prefix="'$'"
  />
</template>

<script setup>
import FieldCell from '@/components/FieldCell.vue'
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | String, Number, Boolean | null | The value to display |
| field | String | '' | The field name (for styling purposes) |
| fieldType | String | 'text' | The type of field (text, number, boolean, email, username, status, price) |
| prefix | String | '' | Text to prepend to the value |
| suffix | String | '' | Text to append to the value |
| emptyText | String | 'N/A' | Text to display when value is null/undefined/empty |
| booleanLabels | Object | { true: 'Yes', false: 'No' } | Labels for boolean true/false values |

## Field Types

The component supports the following field types:

- `text` - Basic text display
- `number` - Number display
- `boolean` - Boolean value display with customizable labels
- `email` - Email display with special styling
- `username` - Username display with @ prefix
- `status` - Status display with Active/Inactive labels and color coding
- `price` - Price display with $ prefix and special styling

## Examples

### User List Implementation

```vue
<template>
  <FieldCell :value="user.name || user.username" />
  <FieldCell :value="user.username" field-type="username" />
  <FieldCell
    :value="user.active"
    field-type="status"
    :boolean-labels="{ true: 'Active', false: 'Inactive' }"
  />
</template>
```

### Product List Implementation

```vue
<template>
  <FieldCell :value="product.name" />
  <FieldCell :value="product.price" field-type="price" />
  <FieldCell
    :value="product.in_stock"
    field-type="boolean"
    :boolean-labels="{ true: 'In Stock', false: 'Out of Stock' }"
  />
</template>
```

## Styling

The component uses scoped CSS with the following classes:

- `.field-cell` - Base class for all field cells
- `.field-cell--{type}` - Type-specific styling (e.g., .field-cell--status)
- `.field-cell__empty` - Styling for empty values

## Benefits

1. **Consistency** - Provides consistent styling and behavior across the application
2. **Reusability** - Can be used for any entity (users, products, orders, etc.)
3. **Flexibility** - Highly configurable through props
4. **Maintainability** - Centralized component for field display logic
5. **Responsive** - Works well on all screen sizes