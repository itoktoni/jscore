<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Filler // Add Filler plugin
} from 'chart.js'

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,

  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Filler // Register Filler plugin
)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false
    }
  }
}

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

const renderChart = async () => {
  // Destroy existing chart instance if it exists
  destroyChart()

  // Wait for next tick to ensure DOM is updated
  await nextTick()

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    const options = { ...defaultOptions, ...props.chartOptions }

    try {
      chartInstance = new Chart(ctx, {
        type: props.chartType,
        data: props.chartData,
        options
      })
    } catch (error) {
      console.error('Error creating chart:', error)
    }
  }
}

// Watch for data changes
watch(() => props.chartData, () => {
  renderChart()
}, { deep: true })

// Watch for chart type changes
watch(() => props.chartType, () => {
  renderChart()
})

// Watch for chart options changes
watch(() => props.chartOptions, () => {
  renderChart()
}, { deep: true })

onMounted(() => {
  renderChart()
})

onUnmounted(() => {
  destroyChart()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>