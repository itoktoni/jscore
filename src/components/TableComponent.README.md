# TableComponent

A flexible and reusable table component for displaying data with sorting, pagination, and customization options.

## Features

- Sortable columns
- Pagination support
- Custom cell rendering with slots
- Loading states
- Empty state handling
- Striped and hover effects
- Responsive design
- Custom actions support

## Usage

```vue
<template>
  <TableComponent
    :data="users"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    :show-pagination="true"
    :striped="true"
    row-key="id"
    show-edit
    show-delete
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <!-- Custom cell rendering -->
    <template #cell-role="{ item }">
      <span class="badge" :class="`badge-${item.role}`">
        {{ item.role }}
      </span>
    </template>

    <!-- Custom actions -->
    <template #actions="{ item }">
      <button @click="editUser(item)">Edit</button>
      <button @click="deleteUser(item)">Delete</button>
    </template>
  </TableComponent>
</template>

<script setup>
import TableComponent from '../components/TableComponent.vue'

const users = ref([
  { id: 1, username: 'john_doe', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
])

const columns = ref([
  { key: 'id', label: 'ID', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'name', label: 'Full Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true }
])

const pagination = ref({
  current_page: 1,
  last_page: 5,
  per_page: 10,
  total: 50,
  from: 1,
  to: 10
})
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array | `[]` | Array of data to display in the table |
| columns | Array | `[]` | Column definitions (required) |
| rowKey | String | `'id'` | Unique key for rows |
| loading | Boolean | `false` | Loading state |
| loadingText | String | `'Loading...'` | Text to show when loading |
| emptyText | String | `'No data available'` | Text to show when no data |
| striped | Boolean | `false` | Enable striped rows |
| hover | Boolean | `true` | Enable hover effect |
| pagination | Object | `null` | Pagination data |
| showPagination | Boolean | `false` | Show pagination controls |
| sortable | Boolean | `false` | Enable sorting |
| showEdit | Boolean | `false` | Show edit button |
| showDelete | Boolean | `false` | Show delete button |

## Column Definition

Each column in the `columns` array can have the following properties:

```js
{
  key: 'username',        // Required: Property name from data object
  label: 'Username',      // Required: Column header text
  sortable: true,         // Optional: Enable sorting for this column
  type: 'string',         // Optional: Data type (string, date, boolean, image, badge)
  badgeClass: 'badge-primary' // Optional: CSS class for badge type
}
```

### Column Types

- `string` (default): Plain text
- `date`: Formatted date
- `boolean`: Yes/No display
- `image`: Image display
- `badge`: Badge styling

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| edit | `(item, index)` | Emitted when edit button is clicked |
| delete | `(item, index)` | Emitted when delete button is clicked |
| sort | `{ key, direction }` | Emitted when column is sorted |
| page-change | `page` | Emitted when page is changed |

## Slots

### Cell Slots

Customize individual cells with `cell-{columnKey}` slots:

```vue
<template #cell-username="{ item, value, index }">
  <strong>{{ value }}</strong>
</template>
```

### Actions Slot

Customize the actions column:

```vue
<template #actions="{ item, index }">
  <button @click="customAction(item)">Custom</button>
</template>
```

### Pagination Slot

Customize pagination controls:

```vue
<template #pagination="{ pagination, changePage }">
  <!-- Custom pagination controls -->
</template>
```

## Examples

### Basic Table

```vue
<TableComponent
  :data="users"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]"
/>
```

### Table with Sorting and Pagination

```vue
<TableComponent
  :data="users"
  :columns="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true }
  ]"
  :pagination="pagination"
  :show-pagination="true"
  :sortable="true"
/>
```

### Table with Custom Cells

```vue
<TableComponent
  :data="users"
  :columns="[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ]"
>
  <template #cell-status="{ item }">
    <span :class="item.status === 'active' ? 'status-active' : 'status-inactive'">
      {{ item.status }}
    </span>
  </template>
</TableComponent>
```