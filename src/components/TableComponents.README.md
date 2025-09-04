# Table Components

A set of reusable Vue components for building consistent and responsive data tables.

## Components

1. [TableCell](#tablecell)
2. [TableAction](#tableaction)

## TableCell

A generic table cell component for displaying data with consistent styling and responsive behavior.

### Features

- Responsive design with data-label attributes for mobile
- Support for various data types (text, number, boolean, email, username, status, price)
- Customizable empty state display
- Prefix and suffix support
- Type-specific styling

### Usage

```vue
<template>
  <table>
    <tbody>
      <tr>
        <!-- Basic usage -->
        <TableCell label="Name" :value="user.name" />

        <!-- With type -->
        <TableCell label="Status" :value="user.active" type="status" />

        <!-- With custom configuration -->
        <TableCell
          label="Price"
          :value="product.price"
          type="price"
          empty-text="Not priced"
        />
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { TableCell } from '@/components'
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | String | '' | The label for the cell (used for mobile display) |
| value | String, Number, Boolean | null | The value to display |
| type | String | 'text' | The type of data (text, number, boolean, email, username, status, price) |
| prefix | String | '' | Text to prepend to the value |
| suffix | String | '' | Text to append to the value |
| emptyText | String | 'N/A' | Text to display when value is null/undefined/empty |
| booleanLabels | Object | { true: 'Yes', false: 'No' } | Labels for boolean true/false values |

### Data Types

- `text` - Basic text display
- `number` - Number display
- `boolean` - Boolean value display with customizable labels
- `email` - Email display with special styling
- `username` - Username display with @ prefix
- `status` - Status display with Active/Inactive labels and color coding
- `price` - Price display with $ prefix and special styling

## TableAction

A consistent action button component for use in table rows.

### Features

- Multiple style variants (primary, secondary, success, danger, warning, info)
- Support for icons and text
- Responsive design
- Accessible with title attributes
- Consistent hover and focus states

### Usage

```vue
<template>
  <div class="action-table">
    <!-- Icon only -->
    <TableAction
      variant="primary"
      icon="bi bi-eye"
      title="View"
      @click="handleView(item)"
    />

    <!-- Icon and text -->
    <TableAction
      variant="secondary"
      icon="bi bi-pencil-square"
      text="Edit"
      title="Edit"
      @click="handleEdit(item)"
    />

    <!-- Text only -->
    <TableAction
      variant="danger"
      text="Delete"
      title="Delete"
      @click="handleDelete(item)"
    />
  </div>
</template>

<script setup>
import { TableAction } from '@/components'
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | String | 'default' | Button style variant (default, primary, secondary, success, danger, warning, info) |
| icon | String | '' | CSS class for icon (e.g., 'bi bi-eye') |
| text | String | '' | Button text |
| title | String | '' | Title attribute for accessibility |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| click | Event | Emitted when the button is clicked |

## Example Implementation

### User List Table

```vue
<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Status</th>
        <th class="action-header">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <TableCell label="Name" :value="user.name || user.username" />
        <TableCell label="Username" :value="user.username" type="username" />
        <TableCell label="Status" :value="user.active" type="status" />
        <td class="column-action">
          <div class="action-table">
            <TableAction
              variant="primary"
              icon="bi bi-eye"
              title="View"
              @click="handleView(user)"
            />
            <TableAction
              variant="secondary"
              icon="bi bi-pencil-square"
              title="Edit"
              @click="handleEdit(user)"
            />
            <TableAction
              variant="danger"
              icon="bi bi-trash"
              title="Delete"
              @click="handleDelete(user)"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { TableCell, TableAction } from '@/components'
</script>
```

## Benefits

1. **Consistency** - Provides consistent styling and behavior across the application
2. **Reusability** - Can be used for any entity (users, products, orders, etc.)
3. **Responsive** - Works well on all screen sizes with mobile-friendly data labels
4. **Accessible** - Proper title attributes and semantic HTML
5. **Flexible** - Highly configurable through props
6. **Maintainable** - Centralized components for table display logic