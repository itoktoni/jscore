# TableComponent

A reusable Vue component for displaying tabular data with pagination and selection.

## Features

- Reusable across different views
- Pagination support
- Row selection (single and bulk)
- Custom cell rendering with slots
- Responsive design with horizontal scrolling
- Sequential numbering
- Built-in support for common field types (status, price, number)
- Optional checkboxes and action columns

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
      <TableAction variant="primary" icon="bi bi-eye" title="View" @click="handleView(item)" />
      <TableAction variant="secondary" icon="bi bi-pencil-square" title="Edit" @click="handleEdit(item)" />
      <TableAction variant="info" icon="bi bi-printer" title="Print" @click="handlePrint(item)" />
      <TableAction variant="danger" icon="bi bi-trash" title="Delete" @click="handleDelete(item)" />
    </template>
  </TableComponent>
</template>

<script setup>
import TableComponent from '@/components/TableComponent.vue'
import TableAction from '@/components/TableAction.vue'

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

### Usage Without Checkboxes or Actions

```vue
<template>
  <TableComponent
    :items="items"
    :pagination="pagination"
    :columns="tableColumns"
    entity-name="items"
    :show-checkbox="false"
    :show-actions="false"
    :show-select-all="false"
  >
    <template #header>
      <th>ID</th>
      <th>Name</th>
      <th>Description</th>
      <th>Status</th>
    </template>
  </TableComponent>
</template>
```

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
    <TableAction variant="primary" icon="bi bi-eye" title="View" @click="handleView(item)" />
    <TableAction variant="secondary" icon="bi bi-pencil-square" title="Edit" @click="handleEdit(item)" />
    <TableAction variant="info" icon="bi bi-printer" title="Print" @click="handlePrint(item)" />
    <TableAction variant="danger" icon="bi bi-trash" title="Delete" @click="handleDelete(item)" />
  </template>

  <template #name="{ item, index }">
    <div class="custom-name">
      <strong>{{ index + 1 }}.</strong> {{ item.name || item.username }}
    </div>
  </template>

  <template #active="{ item }">
    <span :class="item.active ? 'status-active' : 'status-inactive'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </span>
  </template>
</TableComponent>
```

### Column Types

The component supports several column types:

- `number`: Sequential numbering based on pagination
- `status`: Boolean value displayed as "Active"/"Inactive" with color coding
- `price`: Numeric value prefixed with "$"
- `custom`: Custom rendering using slots

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | Array | Yes | - | Array of items to display in the table |
| pagination | Object | Yes | - | Pagination object with currentPage, perPage, total, from, to |
| selectAll | Boolean | No | false | Whether all items are selected |
| columns | Array | Yes | [] | Array of column definitions |
| entityName | String | No | "items" | Name of the entity for display in pagination info |
| showCheckbox | Boolean | No | true | Whether to show the checkbox column |
| showActions | Boolean | No | true | Whether to show the actions column |
| showSelectAll | Boolean | No | true | Whether to show the select all checkbox in the info bar |

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
| header | None | Slot for manually defining table headers |
| actions | { item, index } | Slot for rendering action buttons for each row |
| [column.key] | { item, index, column } | Custom slots for rendering specific column cells |

## Manual Table Implementation

For cases where you need more control over the table rendering, you can manually create tables using `v-for` loops:

### Manual Table with Actions
See `src/components/ManualTableWithActions.vue` for an example of a manually created table with selection and actions.

### Simple Manual Table
See `src/components/ManualTableSimple.vue` for an example of a simple manually created table without selection or actions.

## Example Implementation

See `src/pages/user/List.vue` for a complete example of how to use this component with actions and checkboxes.
See `src/components/TableComponentExample.vue` for an example of how to use this component without actions or checkboxes.
See `src/components/ManualTableExample.vue` for an example of how to manually create tables with foreach loops.