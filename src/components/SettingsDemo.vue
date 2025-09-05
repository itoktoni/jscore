<template>
  <div class="settings-demo">
    <h3>Settings Demo</h3>

    <div class="current-settings">
      <h4>Current Settings</h4>
      <div class="setting-item">
        <strong>Website Name:</strong> {{ getWebsiteName() }}
      </div>
      <div class="setting-item">
        <strong>Website URL:</strong> {{ getWebsiteUrl() }}
      </div>
      <div class="setting-item">
        <strong>Dark Mode:</strong> {{ isDarkMode() ? 'Enabled' : 'Disabled' }}
      </div>
    </div>

    <div class="actions">
      <button @click="toggleDarkMode" class="button">
        Toggle Dark Mode
      </button>
      <button @click="resetSettings" class="button secondary">
        Reset to Defaults
      </button>
    </div>

    <div class="test-section">
      <h4>Test Settings Update</h4>
      <div class="form-group">
        <label for="testName">Test Website Name:</label>
        <input
          id="testName"
          v-model="testName"
          type="text"
          placeholder="Enter test name"
          class="form-input"
        >
      </div>
      <div class="form-group">
        <label for="testUrl">Test Website URL:</label>
        <input
          id="testUrl"
          v-model="testUrl"
          type="url"
          placeholder="https://example.com"
          class="form-input"
        >
      </div>
      <button @click="updateSettings" class="button primary">
        Update Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettings } from '../composables/useSettings'
import { http } from '../stores/http'

// Initialize the settings composable
const {
  getWebsiteName,
  getWebsiteUrl,
  isDarkMode,
  setWebsiteName,
  setWebsiteUrl,
  toggleDarkMode,
  resetToDefaults
} = useSettings()

// Test data
const testName = ref('')
const testUrl = ref('')

// Load settings on component mount
onMounted(() => {
  // Settings are automatically loaded in main.js, but we can ensure they're loaded here too
  // useSettings().loadSettings()
})

// Update settings with test values
const updateSettings = async () => {
  try {
    if (testName.value) {
      await setWebsiteName(testName.value)
    }
    if (testUrl.value) {
      await setWebsiteUrl(testUrl.value)
    }

    // Update the HTTP service base URL
    http.updateBaseURL()

    // Clear the test inputs
    testName.value = ''
    testUrl.value = ''

    console.log('Settings updated successfully')
  } catch (error) {
    console.error('Error updating settings:', error)
  }
}

// Reset settings to defaults
const resetSettings = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await resetToDefaults()
      // Update the API service base URL
      http.updateBaseURL()
      console.log('Settings reset to defaults')
    } catch (error) {
      console.error('Error resetting settings:', error)
    }
  }
}
</script>

<style scoped>
.settings-demo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
}

.current-settings {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.setting-item {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.actions {
  margin-bottom: 20px;
}

.actions .button {
  margin-right: 10px;
}

.test-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.button:hover {
  background-color: #0069d9;
}

.button.secondary {
  background-color: #6c757d;
}

.button.secondary:hover {
  background-color: #5a6268;
}

.button.primary {
  background-color: #28a745;
}

.button.primary:hover {
  background-color: #218838;
}

/* Dark mode styles */
.dark .settings-demo {
  border-color: #4a5568;
  background-color: #2d3748;
  color: #e2e8f0;
}

.dark .current-settings,
.dark .test-section {
  background-color: #4a5568;
}

.dark .form-input {
  background: #2d3748;
  border-color: #718096;
  color: #e2e8f0;
}

.dark .setting-item {
  border-color: #718096;
}
</style>