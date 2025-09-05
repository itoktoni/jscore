<template>
  <div class="settings-page">
    <div class="card">
      <h2>Website Settings</h2>

      <form @submit.prevent="saveSettings">
        <div class="form-group">
          <label for="websiteName">Website Name</label>
          <input
            id="websiteName"
            v-model="form.websiteName"
            type="text"
            placeholder="Enter website name"
            class="form-input"
          >
          <p class="help-text">If not provided, the system will use the value from .env file</p>
        </div>

        <div class="form-group">
          <label for="websiteUrl">Website URL</label>
          <input
            id="websiteUrl"
            v-model="form.websiteUrl"
            type="url"
            placeholder="https://example.com"
            class="form-input"
          >
          <p class="help-text">API requests will be sent to this URL. If not provided, the system will use the value from .env file</p>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.darkMode"
              type="checkbox"
              class="form-checkbox"
            >
            <span>Enable Dark Mode</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="button primary">Save Settings</button>
          <button type="button" class="button secondary" @click="resetToDefaults">Reset to Defaults</button>
        </div>
      </form>
    </div>

    <div class="card">
      <h3>Current Configuration</h3>
      <div class="config-info">
        <div class="config-item">
          <strong>Website Name:</strong>
          <span>{{ currentWebsiteName }}</span>
        </div>
        <div class="config-item">
          <strong>Website URL:</strong>
          <span>{{ currentWebsiteUrl }}</span>
        </div>
        <div class="config-item">
          <strong>Dark Mode:</strong>
          <span>{{ settingsStore.isDarkMode ? 'Enabled' : 'Disabled' }}</span>
        </div>
        <div class="config-item">
          <strong>Environment:</strong>
          <span>{{ environment }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useAlert } from '../composables/useAlert'
import { http } from '../stores/http'

const settingsStore = useSettingsStore()
const { alertSuccess, alertError } = useAlert()

// Form data
const form = ref({
  websiteName: '',
  websiteUrl: '',
  darkMode: false
})

// Environment info
const environment = import.meta.env.VITE_APP_ENV || 'production'

// Computed properties for current values
const currentWebsiteName = computed(() => {
  return settingsStore.getWebsiteName
})

const currentWebsiteUrl = computed(() => {
  return settingsStore.getWebsiteUrl
})

// Load settings on component mount
onMounted(() => {
  form.value.websiteName = settingsStore.websiteName || ''
  form.value.websiteUrl = settingsStore.websiteUrl || ''
  form.value.darkMode = settingsStore.darkMode
})

// Save settings
const saveSettings = async () => {
  try {
    // Update settings in store
    if (form.value.websiteName) {
      await settingsStore.setWebsiteName(form.value.websiteName)
    } else {
      await settingsStore.setWebsiteName(null)
    }

    if (form.value.websiteUrl) {
      await settingsStore.setWebsiteUrl(form.value.websiteUrl)
    } else {
      await settingsStore.setWebsiteUrl(null)
    }

    await settingsStore.setDarkMode(form.value.darkMode)

    // Update HTTP service baseURL
    http.updateBaseURL()

    console.log('Settings saved. Current HTTP baseURL:', http.baseURL)

    alertSuccess('Settings saved successfully')
  } catch (error) {
    console.error('Error saving settings:', error)
    alertError('Error', 'Failed to save settings: ' + (error.message || 'Unknown error'))
  }
}

// Reset to defaults
const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await settingsStore.resetToDefaults()
      form.value.websiteName = ''
      form.value.websiteUrl = ''
      form.value.darkMode = false

      // Update HTTP service baseURL
      http.updateBaseURL()

      console.log('Settings reset. Current HTTP baseURL:', http.baseURL)

      alertSuccess('Settings reset to defaults')
    } catch (error) {
      console.error('Error resetting settings:', error)
      alertError('Error', 'Failed to reset settings: ' + (error.message || 'Unknown error'))
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.card h2 {
  margin-top: 0;
  color: #333;
}

.card h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.help-text {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-checkbox {
  margin-right: 10px;
  width: 18px;
  height: 18px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.primary:hover {
  background-color: #0069d9;
}

.button.secondary {
  background-color: #6c757d;
  color: white;
}

.button.secondary:hover {
  background-color: #5a6268;
}

.config-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.config-item:last-child {
  border-bottom: none;
}

.config-item strong {
  color: #333;
}

.config-item span {
  color: #666;
  text-align: right;
}

/* Dark mode styles */
.dark .settings-page .card {
  background: #2d3748;
  color: #e2e8f0;
}

.dark .form-input {
  background: #4a5568;
  border-color: #718096;
  color: #e2e8f0;
}

.dark .form-group label,
.dark .config-item strong {
  color: #e2e8f0;
}

.dark .help-text,
.dark .config-item span {
  color: #a0aec0;
}

.dark .config-info {
  background: #4a5568;
}
</style>