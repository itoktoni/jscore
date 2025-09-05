<template>
  <div class="plugin-section">
    <h2>Local Notifications</h2>
    <div class="plugin-content">
      <p><strong>Send Local Notifications:</strong></p>

      <div v-if="pluginError">
        <p><strong>Error loading plugin:</strong> {{ pluginError }}</p>
      </div>

      <div v-else>
        <div class="form-group">
          <label for="notificationTitle">Title:</label>
          <input id="notificationTitle" v-model="notificationTitle" type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label for="notificationBody">Body:</label>
          <textarea id="notificationBody" v-model="notificationBody" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="notificationDelay">Delay (seconds):</label>
          <input id="notificationDelay" v-model.number="notificationDelay" type="number" class="form-control" min="1" max="60" />
        </div>
        <div v-if="notificationResult">
          <p><strong>Result:</strong> {{ notificationResult }}</p>
        </div>
        <div v-if="notificationError">
          <p><strong>Error:</strong> {{ notificationError }}</p>
        </div>
        <div v-if="Capacitor.isNativePlatform()">
          <button class="button primary" @click="scheduleNotification">Schedule Notification</button>
          <button class="button secondary" @click="listNotifications">List Notifications</button>
          <button class="button secondary" @click="cancelAllNotifications">Cancel All</button>
        </div>
        <div v-else>
          <p>Local notifications functionality is only available on mobile devices.</p>
          <button class="button primary" @click="simulateNotification" disabled>Schedule Notification (Web - Disabled)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

// Reactive data
const pluginError = ref(null)
const notificationTitle = ref('Test Notification')
const notificationBody = ref('This is a test notification from Capacitor')
const notificationDelay = ref(5)
const notificationResult = ref('')
const notificationError = ref('')
let notificationListener = null

// Local Notifications Plugin
const scheduleNotification = async () => {
  try {
    notificationError.value = ''

    // Request permission
    const permission = await LocalNotifications.requestPermissions()
    if (permission.display !== 'granted') {
      notificationError.value = 'Permission not granted for notifications'
      return
    }

    // Schedule notification with a proper integer ID
    const notifId = Math.floor(Math.random() * 1000000) // Ensure it's an integer
    await LocalNotifications.schedule({
      notifications: [
        {
          title: notificationTitle.value,
          body: notificationBody.value,
          id: notifId,
          schedule: { at: new Date(Date.now() + notificationDelay.value * 1000) },
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: null
        }
      ]
    })

    notificationResult.value = `Notification scheduled with ID: ${notifId}`
    console.log('Notification scheduled')
  } catch (error) {
    console.error('Error scheduling notification:', error)
    notificationError.value = error.message || 'Failed to schedule notification'
  }
}

const listNotifications = async () => {
  try {
    notificationError.value = ''
    const pending = await LocalNotifications.getPending()
    notificationResult.value = `Pending notifications: ${pending.notifications.length}`
    console.log('Pending notifications:', pending)
  } catch (error) {
    console.error('Error listing notifications:', error)
    notificationError.value = error.message || 'Failed to list notifications'
  }
}

const cancelAllNotifications = async () => {
  try {
    notificationError.value = ''
    await LocalNotifications.removeAllDeliveredNotifications()
    await LocalNotifications.cancel({ notifications: [] }) // Cancel all
    notificationResult.value = 'All notifications cancelled'
    console.log('All notifications cancelled')
  } catch (error) {
    console.error('Error cancelling notifications:', error)
    notificationError.value = error.message || 'Failed to cancel notifications'
  }
}

// For web simulation only
const simulateNotification = () => {
  notificationResult.value = 'SIMULATED: Notification would be scheduled'
}

// Set up notification listener
onMounted(async () => {
  try {
    notificationListener = await LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification)
      notificationResult.value = `Notification received: ${notification.title}`
    })
  } catch (error) {
    console.error('Error setting up notification listener:', error)
  }
})

// Clean up listener
onUnmounted(() => {
  if (notificationListener) {
    notificationListener.remove()
  }
})
</script>

<style scoped>
.plugin-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}

.plugin-section h2 {
  margin-top: 0;
  color: #333;
}

.plugin-content {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>