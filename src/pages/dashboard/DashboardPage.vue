<template>
  <div class="card dashboard">
    <div class="dashboard-header row">
      <div class="col-6">
        <h1>Dashboard</h1>
      </div>
      <div class="col-6 date-range-container">
        <select v-model="selectedPeriod" @change="updateCharts" class="period-select">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
    </div>

    <!-- Summary Cards using Chota grid -->
    <div class="row summary-cards">
      <div class="col-3 col-3-md col-12-sm">
        <div class="card summary-card">
          <div class="card-content">
            <h3>Total Users</h3>
            <div class="value">{{ summaryData.users }}</div>
            <div class="trend positive">↑ 12% from last month</div>
          </div>
        </div>
      </div>

      <div class="col-3 col-3-md col-12-sm">
        <div class="card summary-card">
          <div class="card-content">
            <h3>Total Revenue</h3>
            <div class="value">${{ summaryData.revenue.toLocaleString() }}</div>
            <div class="trend positive">↑ 8% from last month</div>
          </div>
        </div>
      </div>

      <div class="col-3 col-3-md col-12-sm">
        <div class="card summary-card">
          <div class="card-content">
            <h3>New Orders</h3>
            <div class="value">{{ summaryData.orders }}</div>
            <div class="trend negative">↓ 3% from last month</div>
          </div>
        </div>
      </div>

      <div class="col-3 col-3-md col-12-sm">
        <div class="card summary-card">
          <div class="card-content">
            <h3>Pending Tasks</h3>
            <div class="value">{{ summaryData.tasks }}</div>
            <div class="trend positive">↓ 15% from last month</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row charts-container">
      <div class="col-6">
        <div class="card chart-card">
          <h2>Revenue Overview</h2>
          <BaseChart
            :chart-data="revenueChartData"
            chart-type="line"
            :chart-options="lineChartOptions"
          />
        </div>
      </div>

      <div class="col-6">
        <div class="card chart-card">
          <h2>User Growth</h2>
          <BaseChart
            :chart-data="userGrowthData"
            chart-type="bar"
            :chart-options="barChartOptions"
          />
        </div>
      </div>

      <div class="col-6">
        <div class="card chart-card">
          <h2>Order Status</h2>
          <BaseChart
            :chart-data="orderStatusData"
            chart-type="doughnut"
            :chart-options="doughnutChartOptions"
          />
        </div>
      </div>

      <div class="col-6">
        <div class="card chart-card">
          <h2>Performance Metrics</h2>
          <BaseChart
            :chart-data="performanceData"
            chart-type="radar"
            :chart-options="radarChartOptions"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseChart from '../../components/BaseChart.vue'
import {
  fetchDashboardSummary,
  fetchRevenueData,
  fetchUserGrowthData,
  fetchOrderStatusData,
  fetchPerformanceData,
  fetchRecentActivities
} from '../../services/dashboardService'

// Reactive data
const selectedPeriod = ref('30')
const summaryData = ref({
  users: 1242,
  revenue: 24560,
  orders: 186,
  tasks: 24
})

const recentActivities = ref([
  {
    type: 'user',
    icon: 'bi bi-person-plus',
    title: 'New User Registered',
    description: 'John Doe has joined the platform',
    time: '2 minutes ago'
  },
  {
    type: 'order',
    icon: 'bi bi-cart',
    title: 'New Order Placed',
    description: 'Order #12345 for $245.00',
    time: '15 minutes ago'
  },
  {
    type: 'payment',
    icon: 'bi bi-currency-dollar',
    title: 'Payment Received',
    description: 'Payment for order #12342 received',
    time: '1 hour ago'
  },
  {
    type: 'task',
    icon: 'bi bi-check-circle',
    title: 'Task Completed',
    description: 'Server maintenance completed',
    time: '3 hours ago'
  },
  {
    type: 'alert',
    icon: 'bi bi-exclamation-triangle',
    title: 'System Alert',
    description: 'High CPU usage detected on server 2',
    time: '5 hours ago'
  }
])

// Chart data
const revenueChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [12000, 19000, 15000, 18000, 22000, 19500, 24500],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const userGrowthData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'New Users',
      data: [120, 190, 150, 180, 220, 195, 245],
      backgroundColor: '#10b981'
    },
    {
      label: 'Active Users',
      data: [820, 910, 880, 920, 980, 950, 1020],
      backgroundColor: '#8b5cf6'
    }
  ]
})

const orderStatusData = ref({
  labels: ['Completed', 'Pending', 'Cancelled', 'Refunded'],
  datasets: [
    {
      data: [75, 15, 5, 5],
      backgroundColor: [
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#6b7280'
      ]
    }
  ]
})

// Performance metrics data (Radar chart)
const performanceData = ref({
  labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
  datasets: [
    {
      label: 'Current Month',
      data: [85, 92, 78, 90, 88],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
    },
    {
      label: 'Previous Month',
      data: [78, 85, 70, 82, 80],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 1)',
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
    }
  ]
})

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    }
  },
  cutout: '60%'
}

const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    r: {
      angleLines: {
        display: true
      },
      suggestedMin: 50,
      suggestedMax: 100
    }
  }
}

// Methods
const updateCharts = async () => {
  try {
    // Fetch data from the service
    const summary = await fetchDashboardSummary(selectedPeriod.value)
    summaryData.value = summary

    const revenueData = await fetchRevenueData(selectedPeriod.value)
    revenueChartData.value = revenueData

    const userGrowthDataResponse = await fetchUserGrowthData(selectedPeriod.value)
    userGrowthData.value = userGrowthDataResponse

    const orderStatusDataResponse = await fetchOrderStatusData()
    orderStatusData.value = orderStatusDataResponse

    const performanceDataResponse = await fetchPerformanceData()
    performanceData.value = performanceDataResponse

    const activities = await fetchRecentActivities()
    recentActivities.value = activities
  } catch (error) {
    console.error('Error updating charts:', error)
    // In a real app, you would show an error message to the user
  }
}

onMounted(() => {
  // Initialize charts
  updateCharts()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1e293b;
}

.date-range-container {
  text-align: right;
}

.period-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: white;
}

.summary-cards {
  margin-bottom: 1rem;
  gap: 1rem 0;
}

.summary-card {
  height: 100%;
}

.card-content{
    padding: 1rem;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #1e293b;
}

.trend {
  font-size: 0.875rem;
}

.trend.positive {
  color: #10b981;
}

.trend.negative {
  color: #ef4444;
}

.charts-container {
  margin-bottom: 30px;
  gap: 1rem 0;
}

.chart-card {
  height: 100%;
  padding: 20px;
}

.chart-card h2 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.recent-activity {
  padding: 20px;
}

.recent-activity h2 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.activity-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.activity-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.activity-icon.user {
  background-color: #dbeafe;
  color: #3b82f6;
}

.activity-icon.order {
  background-color: #dcfce7;
  color: #10b981;
}

.activity-icon.payment {
  background-color: #fef3c7;
  color: #f59e0b;
}

.activity-icon.task {
  background-color: #ede9fe;
  color: #8b5cf6;
}

.activity-icon.alert {
  background-color: #fee2e2;
  color: #ef4444;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #1e293b;
}

.activity-description {
  color: #64748b;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.activity-time {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .date-range-container {
    text-align: left;
  }

  .summary-cards .col-3 {
    width: 50%;
    margin-bottom: 20px;
  }

  .charts-container .col-6 {
    width: 100%;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .summary-cards .col-3 {
    width: 100%;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }
}
</style>