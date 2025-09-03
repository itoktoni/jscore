<template>
  <div>
    <FormSelect
      v-if="!loading && !error"
      :name="name"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :col="col"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <div v-else-if="loading" class="loading-placeholder">
      {{ loadingText }}
    </div>
    <div v-else-if="error" class="error-placeholder">
      {{ errorText }}: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormSelect from './FormSelect.vue'
import apiService from '../stores/api'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  // Optional props for manual mapping
  labelField: {
    type: String,
    default: null
  },
  valueField: {
    type: String,
    default: null
  },
  col: {
    type: [String, Number],
    default: '12'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  errorText: {
    type: String,
    default: 'Error loading data'
  }
})

const options = ref([])
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    // Ensure endpoint starts with a forward slash
    const url = props.endpoint.startsWith('/') ? props.endpoint : `/${props.endpoint}`

    // Fetch data from the API endpoint using the same apiService as the rest of the application
    const response = await apiService.get(url)

    const data = response.data

    // Transform data based on props
    if (Array.isArray(data)) {
      options.value = data.map(item => {
        // Use manual mapping if provided, otherwise auto-detect
        const label = props.labelField
          ? item[props.labelField]
          : (item.name || item.label || item.title || item.text || String(item[props.optionLabel]))

        const value = props.valueField
          ? item[props.valueField]
          : (item.id || item.value || item.key || item[props.optionValue])

        return {
          [props.optionLabel]: label,
          [props.optionValue]: value
        }
      })
    } else if (data.data && Array.isArray(data.data)) {
      // Handle paginated API responses
      options.value = data.data.map(item => {
        // Use manual mapping if provided, otherwise auto-detect
        const label = props.labelField
          ? item[props.labelField]
          : (item.name || item.label || item.title || item.text || String(item[props.optionLabel]))

        const value = props.valueField
          ? item[props.valueField]
          : (item.id || item.value || item.key || item[props.optionValue])

        return {
          [props.optionLabel]: label,
          [props.optionValue]: value
        }
      })
    } else {
      options.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('Error fetching select options:', err)
    options.value = []
  } finally {
    loading.value = false
  }
}

// Fetch data when component is mounted
onMounted(() => {
  fetchData()
})

// Expose method to refresh data
defineExpose({
  refresh: fetchData
})
</script>

<style scoped>
.loading-placeholder,
.error-placeholder {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.error-placeholder {
  color: #e53e3e;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 0.375rem;
}
</style>