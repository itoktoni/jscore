<template>
  <div class="col-12">
    <div class="table-info mb-2">
      <p>
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} {{ entityName }}
      </p>

      <p v-if="showSelectAll" class="select-all">
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
            <slot name="header"></slot>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id">
            <slot :item="item" :index="index">
              <!-- Default rendering if no slot content is provided -->
              <td v-if="showCheckbox" data-label="Select">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  @change="$emit('update-select-all')"
                >
              </td>
              <td v-if="showActions" class="column-action" data-label="Actions">
                <div class="action-table">
                  <slot
                    name="actions"
                    :item="item"
                    :index="index"
                  ></slot>
                </div>
              </td>
              <template v-for="column in columns" :key="column.key">
                <td
                  v-if="column.type === 'custom'"
                  :data-label="column.label"
                >
                  <slot
                    :name="column.key"
                    :item="item"
                    :index="index"
                  ></slot>
                </td>
                <td
                  v-else-if="column.type === 'status'"
                  :data-label="column.label"
                  class="table-cell table-cell--status"
                >
                  <div class="table-cell__content">
                    <span :class="item[column.key] ? 'status-active' : 'status-inactive'">
                      {{ item[column.key] ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </td>
                <td
                  v-else-if="column.type === 'price'"
                  :data-label="column.label"
                  class="table-cell table-cell--price"
                >
                  <div class="table-cell__content">
                    <span>${{ item[column.key] }}</span>
                  </div>
                </td>
                <td
                  v-else-if="column.type === 'number'"
                  :data-label="column.label"
                  class="table-cell table-cell--number"
                >
                  <div class="table-cell__content">
                    <span>{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}</span>
                  </div>
                </td>
                <td
                  v-else
                  :data-label="column.label"
                  class="table-cell"
                >
                  <div class="table-cell__content">
                    <span>{{ item[column.key] }}</span>
                  </div>
                </td>
              </template>
            </slot>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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
    default: false
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  entityName: {
    type: String,
    default: 'items'
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showSelectAll: {
    type: Boolean,
    default: true
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

.table-cell {
  padding: 0.5rem;
}

.table-cell__content {
  display: flex;
  align-items: center;
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