<script setup>
import { ref, onMounted } from 'vue'
import { useApiRoutes } from '../composables/useApiRoutes'

const props = defineProps({
  endpoint: {
    type: String,
    required: true
  },
  transform: {
    type: Function,
    default: null
  }
})

const modelData = ref([])
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    // Initialize api routes inside the function to avoid circular dependency
    const apiRoutes = useApiRoutes()

    // Fetch data from the API endpoint
    const response = await fetch(apiRoutes.get(props.endpoint))

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transform data if a transform function is provided
    if (props.transform && typeof props.transform === 'function') {
      modelData.value = props.transform(data)
    } else {
      modelData.value = data
    }
  } catch (err) {
    error.value = err.message
    console.error('Error fetching model data:', err)
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