# TableComponent

A reusable Vue component for displaying tabular data with pagination and selection.

## Features

- Reusable across different views
- Pagination support
- Row selection (single and bulk)
- Custom cell rendering with slots
- Responsive design with horizontal scrolling
- Status display with color coding
- Sequential numbering

## Usage

### Basic Usage

```vue
<template>
  <TableComponent
    :items="items"
    :pagination="pagination"
    :select-all="selectAll"
    :columns="tableColumns"
    entity-name="users"
    @toggle-select-all="toggleSelectAll"
    @update-select-all="updateSelectAll"
  >
    <template #actions="{ item }">
      <button @click="handleView(item)">View</button>
      <button @click="handleEdit(item)">Edit</button>
      <button @click="handlePrint(item)">Print</button>
      <button @click="handleDelete(item)">Delete</button>
    </template>
  </TableComponent>
</template>

<script setup>
import TableComponent from '@/components/TableComponent.vue'

// Define table columns
const tableColumns = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'active', label: 'Status', type: 'status' },
  { key: 'price', label: 'Price', type: 'price' },
  { key: 'customField', label: 'Custom', type: 'custom' }
]
</script>
```

### Column Types

The component supports several column types:

- `number`: Sequential numbering based on pagination
- `status`: Boolean value displayed as "Active"/"Inactive" with color coding
- `price`: Numeric value prefixed with "$"
- `custom`: Custom rendering using slots

### Custom Cell Rendering

For custom cell rendering, use named slots that match the column key:

```vue
<TableComponent
  :items="items"
  :pagination="pagination"
  :select-all="selectAll"
  :columns="tableColumns"
  entity-name="users"
  @toggle-select-all="toggleSelectAll"
  @update-select-all="updateSelectAll"
>
  <template #actions="{ item }">
    <button @click="handleView(item)">View</button>
    <button @click="handleEdit(item)">Edit</button>
    <button @click="handlePrint(item)">Print</button>
    <button @click="handleDelete(item)">Delete</button>
  </template>

  <template #name="{ item }">
    <div class="user-name-cell">
      <span>{{ item.name || item.username }}</span>
    </div>
  </template>

  <template #status="{ item }">
    <span :class="item.active ? 'status-active' : 'status-inactive'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </span>
  </template>
</TableComponent>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | Array | Yes | Array of items to display in the table |
| pagination | Object | Yes | Pagination object with currentPage, perPage, total, from, to |
| selectAll | Boolean | Yes | Whether all items are selected |
| columns | Array | Yes | Array of column definitions |
| entityName | String | No | Name of the entity for display in pagination info (default: "items") |

### Column Definition

Each column in the columns array should have the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | String | Yes | Unique key for the column |
| label | String | Yes | Display label for the column |
| type | String | No | Type of column (number, status, price, custom) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| toggle-select-all | None | Emitted when the select all checkbox is toggled |
| update-select-all | None | Emitted when individual row selection changes |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| actions | { item, index } | Slot for rendering action buttons for each row |
| [column.key] | { item, index } | Custom slots for rendering specific column cells |

## Example Implementation

See `src/pages/user/List.vue` and `src/pages/product/List.vue` for complete examples of how to use this component.