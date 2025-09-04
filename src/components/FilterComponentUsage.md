# FilterComponent Usage Guide

The FilterComponent is a reusable Vue component that provides filtering functionality for list pages. Here's how to use it:

## Basic Usage

```vue
<template>
  <FilterComponent
    :search-data="searchData"
    :search-options="searchOptions"
    @filter-submit="handleFilterSubmit"
    @search="handleSearch"
    @per-page-change="handlePerPageChange"
    ref="filterComponent"
  >
    <!-- Default filters (optional) -->
    <template #default-filters>
      <tr>
        <td class="col-4" data-label="Name">
          <p class="grouped">
            <label class="hide-mobile" for="">Name</label>
            <input type="text" name="name" placeholder="Filter by name...">
          </p>
        </td>
        <td class="col-4" data-label="Email">
          <p class="grouped">
            <label class="hide-mobile" for="">Email</label>
            <input type="text" name="email" placeholder="Filter by email...">
          </p>
        </td>
        <td class="col-4" data-label="Status">
          <p class="grouped">
            <label class="hide-mobile" for="">Status</label>
            <select name="status">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </p>
        </td>
      </tr>
    </template>

    <!-- Custom filters (optional) -->
    <template #custom-filters>
      <tr>
        <td class="col-6" data-label="Category">
          <p class="grouped">
            <label class="hide-mobile" for="">Category</label>
            <select name="category">
              <option value="">All Categories</option>
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
            </select>
          </p>
        </td>
        <td class="col-6" data-label="Date Range">
          <p class="grouped">
            <label class="hide-mobile" for="">Date Range</label>
            <input type="date" name="start_date">
            <input type="date" name="end_date">
          </p>
        </td>
      </tr>
    </template>
  </FilterComponent>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FilterComponent from '@/components/FilterComponent.vue'

const filterComponent = ref(null)

// Search data
const searchData = reactive({
  search: '',
  searchType: '',
  perPage: 10
})

// Define search options
const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' }
]

// Event handlers
function handleFilterSubmit({ filterQuery, searchData }) {
  // Handle filter submission
  console.log('Filter submitted:', filterQuery, searchData)
}

function handleSearch({ filterQuery, searchData }) {
  // Handle search
  console.log('Search triggered:', filterQuery, searchData)
}

function handlePerPageChange(perPage) {
  // Handle per page change
  console.log('Per page changed:', perPage)
}
</script>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| searchData | Object | Yes | The search data object containing search, searchType, and perPage |
| searchOptions | Array | No | Array of search options for the filter dropdown (default: [{ value: '', label: 'All Fields' }]) |
| perPageOptions | Array | No | Array of per page options (default: [10, 25, 50, 100]) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| filter-submit | { filterQuery, searchData } | Emitted when the filter form is submitted |
| search | { filterQuery, searchData } | Emitted when a search is triggered |
| per-page-change | perPage | Emitted when the per page selection changes |

## Slots

| Slot | Description |
|------|-------------|
| default-filters | Default filter fields (optional) |
| custom-filters | Additional custom filter fields (optional) |

## Methods (via ref)

| Method | Description |
|--------|-------------|
| buildFilterQuery() | Builds and returns the filter query from form data |
| resetFormFields() | Resets all form fields to empty values |
| populateFormFromQuery() | Populates form fields from URL query parameters |

## Example with Ref Methods

```javascript
import { ref } from 'vue'

const filterComponent = ref(null)

// Get filter query
const filterQuery = filterComponent.value.buildFilterQuery()

// Reset form
filterComponent.value.resetFormFields()

// Populate from query
filterComponent.value.populateFormFromQuery()
```