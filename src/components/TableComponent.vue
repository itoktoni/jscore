<template>
  <div class="col-12">
    <div class="table-info mb-2">
      <p>
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} {{ entityName }}
      </p>

      <p class="select-all">
        <input
          type="checkbox"
          :checked="selectAll"
          @change="$emit('toggle-select-all')"
        >
      </p>
    </div>

    <!-- Table wrapper for horizontal scrolling -->
    <div class="table-wrapper">
      <table class="data-table striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                :checked="selectAll"
                @change="$emit('toggle-select-all')"
              >
            </th>
            <th class="action-header text-center">Actions</th>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id">
            <td data-label="Select">
              <input
                type="checkbox"
                :checked="item.selected"
                @change="$emit('update-select-all')"
              >
            </td>
            <td class="column-action" data-label="Actions">
              <div class="action-table">
                <slot
                  name="actions"
                  :item="item"
                  :index="index"
                ></slot>
              </div>
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :data-label="column.label"
            >
              <div v-if="column.type === 'status'">
                <span :class="item[column.key] ? 'status-active' : 'status-inactive'">
                  {{ item[column.key] ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div v-else-if="column.type === 'price'">
                ${{ item[column.key] }}
              </div>
              <div v-else-if="column.type === 'number'">
                {{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}
              </div>
              <div v-else-if="column.type === 'custom'">
                <slot
                  :name="column.key"
                  :item="item"
                  :index="index"
                ></slot>
              </div>
              <div v-else>
                {{ item[column.key] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    required: true
  },
  selectAll: {
    type: Boolean,
    required: true
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  entityName: {
    type: String,
    default: 'items'
  }
})

const emit = defineEmits([
  'toggle-select-all',
  'update-select-all'
])
</script>

<style scoped>
/* Add wrapper for table with horizontal scrolling */
.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.table-info {
  border-top: 1px solid lightgray;
  font-size: 1.5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  color: #666;
  position: relative;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.select-all {
  display: none;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-info {
    text-align: center;
  }

  .select-all {
    display: block;
  }

  .hide-mobile{
    display: none;
  }

  td:not([data-label]) {
    display: none;
  }
}
</style>