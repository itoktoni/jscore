<template>
  <div class="table-container">
    <div v-if="loading" class="loading-indicator">
      {{ loadingText }}
    </div>

    <div v-else class="table-responsive">
      <table class="data-table" :class="{ 'table-striped': striped, 'table-hover': hover }">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{
                'sortable': column.sortable,
                'sort-asc': sortBy === column.key && sortDirection === 'asc',
                'sort-desc': sortBy === column.key && sortDirection === 'desc'
              }"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              {{ column.label }}
              <span v-if="column.sortable" class="sort-indicator">
                <i v-if="sortBy !== column.key" class="sort-icon">↕</i>
                <i v-else-if="sortDirection === 'asc'" class="sort-icon">↑</i>
                <i v-else class="sort-icon">↓</i>
              </span>
            </th>

            <!-- Actions column if actions are provided -->
            <th v-if="hasActions" class="actions-header">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in processedData" :key="getRowKey(item, index)">
            <td v-for="column in columns" :key="`${column.key}-${index}`">
              <!-- Slot for custom cell rendering -->
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getItemValue(item, column.key)"
                :index="index"
              >
                <!-- Default cell rendering -->
                <template v-if="column.type === 'badge'">
                  <span
                    class="badge"
                    :class="getBadgeClass(item, column)"
                  >
                    {{ getItemValue(item, column.key) }}
                  </span>
                </template>

                <template v-else-if="column.type === 'boolean'">
                  <span :class="getItemValue(item, column.key) ? 'status-active' : 'status-inactive'">
                    {{ getItemValue(item, column.key) ? 'Yes' : 'No' }}
                  </span>
                </template>

                <template v-else-if="column.type === 'date'">
                  {{ formatDate(getItemValue(item, column.key)) }}
                </template>

                <template v-else-if="column.type === 'image'">
                  <img
                    :src="getItemValue(item, column.key)"
                    :alt="column.label"
                    class="table-image"
                    @error="handleImageError($event)"
                  />
                </template>

                <template v-else>
                  {{ getItemValue(item, column.key) }}
                </template>
              </slot>
            </td>

            <!-- Actions cell -->
            <td v-if="hasActions" class="actions-cell">
              <slot
                name="actions"
                :item="item"
                :index="index"
              >
                <button
                  v-if="showEdit"
                  @click="$emit('edit', item, index)"
                  class="btn btn-sm btn-outline-primary"
                >
                  Edit
                </button>
                <button
                  v-if="showDelete"
                  @click="$emit('delete', item, index)"
                  class="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </slot>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="processedData.length === 0">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="text-center">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && pagination" class="table-pagination">
      <slot name="pagination" :pagination="pagination" :changePage="changePage">
        <nav class="pagination">
          <button
            :disabled="pagination.current_page <= 1"
            @click="changePage(pagination.current_page - 1)"
            class="pagination-btn"
          >
            Previous
          </button>

          <span class="pagination-info">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
          </span>

          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
            class="pagination-btn"
          >
            Next
          </button>
        </nav>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue'

const slots = useSlots()

const props = defineProps({
  // Data to display in the table
  data: {
    type: Array,
    default: () => []
  },

  // Column definitions
  columns: {
    type: Array,
    default: () => [],
    required: true
  },

  // Unique key for rows (used for v-for key)
  rowKey: {
    type: String,
    default: 'id'
  },

  // Loading state
  loading: {
    type: Boolean,
    default: false
  },

  loadingText: {
    type: String,
    default: 'Loading...'
  },

  // Empty state text
  emptyText: {
    type: String,
    default: 'No data available'
  },

  // Striped rows
  striped: {
    type: Boolean,
    default: false
  },

  // Hover effect
  hover: {
    type: Boolean,
    default: true
  },

  // Pagination
  pagination: {
    type: Object,
    default: null
  },

  showPagination: {
    type: Boolean,
    default: false
  },

  // Sorting
  sortable: {
    type: Boolean,
    default: false
  },

  // Actions
  showEdit: {
    type: Boolean,
    default: false
  },

  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'sort', 'page-change'])

// Sorting state
const sortBy = ref('')
const sortDirection = ref('asc')

// Computed properties
const hasActions = computed(() => {
  return props.showEdit || props.showDelete || !!slots.actions
})

const processedData = computed(() => {
  if (!props.sortable || !sortBy.value) {
    return props.data
  }

  return [...props.data].sort((a, b) => {
    const aValue = getItemValue(a, sortBy.value)
    const bValue = getItemValue(b, sortBy.value)

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// Methods
const getRowKey = (item, index) => {
  return item[props.rowKey] !== undefined ? item[props.rowKey] : index
}

const getItemValue = (item, key) => {
  // Support nested properties (e.g., 'user.name')
  return key.split('.').reduce((obj, prop) => obj?.[prop], item)
}

const getBadgeClass = (item, column) => {
  const value = getItemValue(item, column.key)
  if (column.badgeClass) {
    // If badgeClass is a function, call it with the value
    if (typeof column.badgeClass === 'function') {
      return column.badgeClass(value, item)
    }
    // If badgeClass is a string, use it directly
    return column.badgeClass
  }
  // Default badge classes based on value
  if (typeof value === 'string') {
    return `badge-${value.toLowerCase()}`
  }
  return ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const handleSort = (key) => {
  if (sortBy.value === key) {
    // Toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new sort key
    sortBy.value = key
    sortDirection.value = 'asc'
  }

  emit('sort', { key: sortBy.value, direction: sortDirection.value })
}

const changePage = (page) => {
  emit('page-change', page)
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.png' // Fallback image
}
</script>

<style scoped>
.table-container {
  background-color: var(--bg-white, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8fafc;
}

.data-table.table-hover tbody tr:hover {
  background-color: #f1f5f9;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  position: relative;
  user-select: none;
}

.data-table th.sortable {
  cursor: pointer;
}

.data-table th.sortable:hover {
  background-color: #e2e8f0;
}

.sort-indicator {
  float: right;
  opacity: 0.5;
}

.sortable:hover .sort-indicator {
  opacity: 1;
}

.data-table th.sort-asc .sort-icon,
.data-table th.sort-desc .sort-icon {
  opacity: 1;
  color: #3b82f6;
}

.table-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-primary {
  background-color: #dbeafe;
  color: #2563eb;
}

.badge-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.badge-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.badge-info {
  background-color: #cffafe;
  color: #0891b2;
}

.status-active {
  color: #16a34a;
  font-weight: 500;
}

.status-inactive {
  color: #dc2626;
  font-weight: 500;
}

.btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  border: 1px solid transparent;
  margin-right: 0.25rem;
}

.btn-sm {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
}

.btn-outline-primary {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: white;
}

.btn-outline-danger {
  border-color: #ef4444;
  color: #ef4444;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  color: white;
}

.actions-header,
.actions-cell {
  text-align: right;
  white-space: nowrap;
}

.text-center {
  text-align: center;
}

.table-pagination {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}

/* Responsive styles */
@media (max-width: 768px) {
  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>