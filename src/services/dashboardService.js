/**
 * Dashboard Service
 *
 * Service for fetching dashboard data from the backend API
 */

import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api', // This should be your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Fetch dashboard summary data
 * @param {string} period - Time period (7, 30, 90 days)
 * @returns {Promise<Object>} Summary data
 */
export async function fetchDashboardSummary(period = '30') {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get(`/dashboard/summary?period=${period}`)
    // return response.data

    // For now, return dummy data
    return {
      users: Math.floor(Math.random() * 1000) + 1000,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 200) + 100,
      tasks: Math.floor(Math.random() * 50) + 10
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    throw error
  }
}

/**
 * Fetch revenue chart data
 * @param {string} period - Time period (7, 30, 90 days)
 * @returns {Promise<Object>} Revenue chart data
 */
export async function fetchRevenueData(period = '30') {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get(`/dashboard/revenue?period=${period}`)
    // return response.data

    // Generate dummy data based on period
    const labels = generateLabels(period)
    const data = generateRandomData(labels.length, 10000, 30000)

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    throw error
  }
}

/**
 * Fetch user growth data
 * @param {string} period - Time period (7, 30, 90 days)
 * @returns {Promise<Object>} User growth chart data
 */
export async function fetchUserGrowthData(period = '30') {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get(`/dashboard/users?period=${period}`)
    // return response.data

    // Generate dummy data based on period
    const labels = generateLabels(period)
    const newUserCount = generateRandomData(labels.length, 50, 300)
    const activeUserCount = generateRandomData(labels.length, 800, 1200)

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUserCount,
          backgroundColor: '#10b981'
        },
        {
          label: 'Active Users',
          data: activeUserCount,
          backgroundColor: '#8b5cf6'
        }
      ]
    }
  } catch (error) {
    console.error('Error fetching user growth data:', error)
    throw error
  }
}

/**
 * Fetch order status data
 * @returns {Promise<Object>} Order status chart data
 */
export async function fetchOrderStatusData() {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get('/dashboard/orders/status')
    // return response.data

    // Return dummy data
    return {
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
    }
  } catch (error) {
    console.error('Error fetching order status data:', error)
    throw error
  }
}

/**
 * Fetch performance metrics data
 * @returns {Promise<Object>} Performance metrics chart data
 */
export async function fetchPerformanceData() {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get('/dashboard/performance')
    // return response.data

    // Return dummy data
    return {
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
    }
  } catch (error) {
    console.error('Error fetching performance data:', error)
    throw error
  }
}

/**
 * Fetch recent activities
 * @returns {Promise<Array>} Recent activities
 */
export async function fetchRecentActivities() {
  try {
    // In a real implementation, you would call your API endpoint
    // const response = await api.get('/dashboard/activities')
    // return response.data

    // Return dummy data
    return [
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
    ]
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    throw error
  }
}

// Helper functions
function generateLabels(period) {
  const days = parseInt(period)

  if (days <= 7) {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (days <= 30) {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  } else {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
}

function generateRandomData(count, min, max) {
  return Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}