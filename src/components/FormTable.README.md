# FormTable Component

A reusable Vue component that combines form filtering with table display and pagination.

## Features

- Form-based filtering that sends parameters to an API endpoint
- Automatic table data fetching with pagination support
- Customizable table rendering through slots
- Built-in pagination controls
- Loading states and error handling
- Responsive design

## Usage

```vue
<template>
  <FormTable
    endpoint="/api/users"
    :initial-data="{ name: '', email: '' }"
  >
    <!-- Filter Form -->
    <template #default="{ formData, fieldErrors }">
      <FormInput name="name" label="Name" />
      <FormInput name="email" label="Email" />
    </template>

    <!-- Table Content -->
    <template #table="{ data, loading }">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </FormTable>
</template>

<script setup>
import FormTable from '../components/FormTable.vue'
import FormInput from '../components/FormInput.vue'
</script>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| endpoint | String | Yes | API endpoint to fetch table data |
| initialData | Object | No | Initial form data for filters |

## Slots

### Default Slot
Contains the filter form elements. Has access to:
- `formData`: Reactive form data object
- `fieldErrors`: Form validation errors
- `isSubmitting`: Submit state
- `handleSearch`: Function to trigger search

### table
Custom table rendering. Has access to:
- `data`: Array of table data items
- `loading`: Loading state

### pagination
Custom pagination controls. Has access to:
- `pagination`: Pagination object with page info
- `changePage`: Function to change page

## Methods

The component exposes the following methods via `ref`:

- `handleSearch()`: Trigger a search with current filters
- `handleReset()`: Reset form and search
- `changePage(page)`: Change to a specific page

## API Response Format

The component expects API responses in one of these formats:

### Standard Pagination Format
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 10,
  "total": 50,
  "from": 1,
  "to": 10
}
```

### Simple Array Format
```json
[...]
```

## Example with Custom Pagination

```vue
<template>
  <FormTable endpoint="/api/users">
    <template #default="{ formData }">
      <FormInput name="search" label="Search" />
    </template>

    <template #table="{ data }">
      <!-- Table content -->
    </template>

    <template #pagination="{ pagination, changePage }">
      <nav>
        <button @click="changePage(pagination.current_page - 1)">
          Previous
        </button>
        <span>
          Page {{ pagination.current_page }} of {{ pagination.last_page }}
        </span>
        <button @click="changePage(pagination.current_page + 1)">
          Next
        </button>
      </nav>
    </template>
  </FormTable>
</template>