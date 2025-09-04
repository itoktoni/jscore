# FilterComponent

A reusable Vue component for implementing filter functionality in list pages.

## Features

- Automatic form data collection and query building
- URL query parameter synchronization
- Responsive design
- Customizable filter options
- Slot support for custom filters
- Per-page selection
- Search functionality
- Built-in URL routing and navigation

## Installation

The component is already part of the project. Simply import it:

```javascript
import FilterComponent from '@/components/FilterComponent.vue'
```

## Usage

### Basic Implementation

```vue
<template>
  <FilterComponent
    :search-data="searchData"
    :search-options="searchOptions"
    @filter-submit="handleFilterSubmit"
    @search="handleSearch"
    @per-page-change="handlePerPageChange"
    ref="filterComponent"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import FilterComponent from '@/components/FilterComponent.vue'

const filterComponent = ref(null)

const searchData = reactive({
  search: '',
  searchType: '',
  perPage: 10
})

const searchOptions = [
  { value: '', label: 'All Fields' },
  { value: 'name', label: 'Name' }
]

// The FilterComponent now handles URL routing internally
// These handlers just need to perform the actual search/filter operations
function handleFilterSubmit({ filterQuery, searchData }) {
  // Apply filters - URL routing is handled by the component
  performFiltering(searchData, filterQuery)
}

function handleSearch({ filterQuery, searchData }) {
  // Apply search - URL routing is handled by the component
  performSearch(searchData, filterQuery)
}

function handlePerPageChange(perPage) {
  // Handle per page change - URL routing is handled by the component
  searchData.perPage = perPage
  performFiltering(searchData)
}

function performFiltering(searchData, filterQuery = {}) {
  // Your filtering logic here
}

function performSearch(searchData, filterQuery = {}) {
  // Your search logic here
}
</script>
```

### With Default Filters

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
    <template #default-filters>
      <tr>
        <td class="col-4" data-label="Name">
          <p class="grouped">
            <label class="hide-mobile" for="">Name</label>
            <input type="text" name="name" placeholder="Filter by name...">
          </p>
        </td>
        <!-- More filter fields -->
      </tr>
    </template>
  </FilterComponent>
</template>
```

### With Custom Filters

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
    <template #custom-filters>
      <tr>
        <td class="col-6" data-label="Category">
          <p class="grouped">
            <label class="hide-mobile" for="">Category</label>
            <select name="category">
              <option value="">All Categories</option>
              <!-- Category options -->
            </select>
          </p>
        </td>
      </tr>
    </template>
  </FilterComponent>
</template>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| searchData | Object | Yes | - | Search data object with search, searchType, and perPage |
| searchOptions | Array | No | `[{ value: '', label: 'All Fields' }]` | Search options for the filter dropdown |
| perPageOptions | Array | No | `[10, 25, 50, 100]` | Options for per page selection |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| filter-submit | `{ filterQuery, searchData }` | Emitted when the filter form is submitted |
| search | `{ filterQuery, searchData }` | Emitted when a search is triggered |
| per-page-change | `perPage` | Emitted when the per page selection changes |

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

## Example Implementation

See `ProductListExample.vue` for a complete example of how to use this component in another list page.

## Migration from Previous Implementation

If you're migrating from the previous implementation in `List.vue`:

1. Remove the old filter form markup
2. Import and use the FilterComponent
3. Move filter fields to the appropriate slots
4. Simplify event handlers since URL routing is now handled internally
5. Remove old filter-related methods

## Benefits

- **Reusability**: Can be used in any list component
- **Maintainability**: Centralized filter logic
- **Flexibility**: Customizable through slots and props
- **Consistency**: Uniform filter behavior across the application
- **URL Synchronization**: Automatic synchronization with URL query parameters
- **Built-in Routing**: Handles URL navigation and query parameter management automatically