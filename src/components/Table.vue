<template>
  <div class="card">
    <div class="page-header">
      <h2>{{ header }}</h2>
    </div>

    <div class="card-table">
      <FormTable ref="TableRef" :endpoint="apiRoutes.LIST" :delete="apiRoutes.REMOVE">
        <!-- Filter Form -->
        <template #filterForm="{ formData, fieldErrors }">
          <div class="row">
            <template v-for="filter in filters" :key="filter.name">
              <FormInput
                v-if="!filter.options"
                :name="filter.name"
                :label="filter.label"
                :placeholder="filter.placeholder"
                :col="filter.col"
                :model-value="formData[filter.name] || ''"
                @update:model-value="val => formData[filter.name] = val"
              />
              <FormSelect
                v-else
                :name="filter.name"
                :label="filter.label"
                :options="filter.options"
                :col="filter.col"
                :model-value="formData[filter.name] || ''"
                @update:model-value="val => formData[filter.name] = val"
              />
            </template>
          </div>
        </template>

        <!-- Table Content -->
        <template #tableContent="{ data }">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th v-if="selectable">
                    <FormCheck
                      :data-array="data || []"
                      select-all
                      :selected-items="selectedItems"
                      :on-selection-change="updateSelectedItems"
                    />
                  </th>
                  <th class="text-center" v-if="hasActions">Actions</th>
                  <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in (data || [])" :key="item.id">
                  <td v-if="selectable">
                    <FormCheck
                      :value="item.id"
                      :selected-items="selectedItems"
                      :on-selection-change="updateSelectedItems"
                    />
                  </td>

                  <td data-label="Actions" v-if="hasActions">
                    <div class="action-table">
                      <Button
                        v-if="editRouteName"
                        button-type="link"
                        variant="primary"
                        :to="{ name: editRouteName, params: { id: item.id } }"
                        :text="editButtonText"
                      />

                      <Button
                        v-if="deleteApiRoute"
                        button-type="delete"
                        variant="danger"
                        :url="deleteApiRoute(item.id)"
                        :form-table-ref="TableRef"
                        :text="deleteButtonText"
                      />
                    </div>
                  </td>

                  <td v-for="column in columns" :key="column.key" :data-label="column.label">
                    {{ getItemValue(item, column.key) }}
                  </td>
                </tr>

                <tr v-if="(!data || (Array.isArray(data) && data.length === 0))">
                  <td :colspan="columns.length + (hasActions ? 1 : 0) + (selectable ? 1 : 0)" class="text-center">
                    {{ emptyText }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </FormTable>

      <footer class="content-footer safe-area-bottom" v-if="hasFooterActions">
        <div class="form-actions">
          <Button
            v-if="removeApiRoute && deleteSelectedButtonText"
            button-type="remove"
            variant="danger"
            :url="removeApiRoute"
            :selected-items="selectedItems"
            :form-table-ref="TableRef"
            :text="deleteSelectedButtonText"
          />

          <Button
            v-if="createRouteName && createButtonText"
            button-type="link"
            variant="success"
            :to="{ name: createRouteName }"
            :text="createButtonText"
          />
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSelectionState } from '../composables/useSelectionState'
import FormTable from './FormTable.vue'
import FormInput from './FormInput.vue'
import FormSelect from './FormSelect.vue'
import FormCheck from './FormCheck.vue'
import Button from './Button.vue'

const props = defineProps({
  // Module name (e.g., 'User', 'Role', etc.)
  module: {
    type: String,
    default: 'User'
  },
  // Header text
  header: {
    type: String,
    default: 'User List'
  },
  // API routes object
  apiRoutes: {
    type: Object,
    required: true
  },
  // Route constants object
  routes: {
    type: Object,
    required: true
  },
  // Route names
  editRouteName: {
    type: String,
    default: null
  },
  createRouteName: {
    type: String,
    default: null
  },
  // Columns definition
  columns: {
    type: Array,
    default: () => [
      { key: 'id', label: 'ID' },
      { key: 'username', label: 'Username' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'system_role_name', label: 'Role' }
    ]
  },
  // Filter fields definition
  filters: {
    type: Array,
    default: () => [
      { name: 'username', label: 'Username', placeholder: 'Search by username', col: '4' },
      { name: 'email', label: 'Email', placeholder: 'Search by email', col: '4' },
      { name: 'role', label: 'Role', placeholder: 'Search by role', col: '4' }
    ]
  },
  // Enable row selection
  selectable: {
    type: Boolean,
    default: true
  },
  // Show actions column
  hasActions: {
    type: Boolean,
    default: true
  },
  // Show footer actions
  hasFooterActions: {
    type: Boolean,
    default: true
  },
  // Text for empty state
  emptyText: {
    type: String,
    default: 'No data found'
  },
  // Button texts
  editButtonText: {
    type: String,
    default: 'Button.edit:icon'
  },
  deleteButtonText: {
    type: String,
    default: 'Button.delete:icon'
  },
  createButtonText: {
    type: String,
    default: 'Button.create'
  },
  deleteSelectedButtonText: {
    type: String,
    default: 'Delete'
  }
})

// Computed properties for API routes
const deleteApiRoute = props.apiRoutes.DELETE || null
const removeApiRoute = props.apiRoutes.REMOVE || null

const TableRef = ref(null)

// Use the selection state composable
const { selectedItems, updateSelectedItems } = useSelectionState()

// Get nested property value
const getItemValue = (item, key) => {
  return key.split('.').reduce((obj, prop) => obj?.[prop], item)
}
</script>