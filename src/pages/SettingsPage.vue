<template>
  <div class="settings-page">
    <FormContainer
      title="Website Settings"
      :initial-data="initialFormData"
      :submit-handler="saveSettings"
      @success="handleSuccess"
      @error="handleError"
    >
      <FormInput 
        name="websiteName" 
        label="Website Name"
        placeholder="Enter website name"
        hint="If not provided, the system will use the value from .env file"
        col="12"
      />
      
      <FormInput 
        name="websiteUrl" 
        label="Website URL"
        type="url"
        placeholder="https://example.com"
        hint="API requests will be sent to this URL. If not provided, the system will use the value from .env file"
        col="12"
      />
      
      <FormToggle 
        name="darkMode" 
        label="Dark Mode"
        on-text="Enabled"
        off-text="Disabled"
        show-text
        col="12"
      />

      <template #footer="{ isSubmitting }">
        <div class="footer-actions">
          <FormButton 
            type="button" 
            variant="secondary" 
            @click="resetToDefaults" 
            text="Reset to Defaults" 
          />
          <FormButton 
            type="submit" 
            variant="success" 
            :text="isSubmitting ? 'Saving...' : 'Save Settings'" 
            :disabled="isSubmitting" 
          />
        </div>
      </template>
    </FormContainer>

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
import FormContainer from '../components/FormContainer.vue'
import FormInput from '../components/FormInput.vue'
import FormToggle from '../components/FormToggle.vue'
import FormButton from '../components/FormButton.vue'

const settingsStore = useSettingsStore()
const { alertSuccess, alertError } = useAlert()

const initialFormData = ref({
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
  initialFormData.value.websiteName = settingsStore.websiteName || ''
  initialFormData.value.websiteUrl = settingsStore.websiteUrl || ''
  initialFormData.value.darkMode = settingsStore.darkMode
})

// Save settings
const saveSettings = async (formData) => {
  try {
    // Update settings in store
    if (formData.websiteName) {
      await settingsStore.setWebsiteName(formData.websiteName)
    } else {
      await settingsStore.setWebsiteName(null)
    }

    if (formData.websiteUrl) {
      await settingsStore.setWebsiteUrl(formData.websiteUrl)
    } else {
      await settingsStore.setWebsiteUrl(null)
    }

    await settingsStore.setDarkMode(formData.darkMode)

    // Update HTTP service baseURL
    http.updateBaseURL()

    console.log('Settings saved. Current HTTP baseURL:', http.baseURL)

    return { success: true, data: formData }
  } catch (error) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message || 'Failed to save settings' }
  }
}

function handleSuccess(response) {
  alertSuccess('Settings saved successfully')
}

function handleError(error) {
  alertError('Error', 'Failed to save settings: ' + (error.error || 'Unknown error'))
}

// Reset to defaults
const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await settingsStore.resetToDefaults()
      initialFormData.value.websiteName = ''
      initialFormData.value.websiteUrl = ''
      initialFormData.value.darkMode = false

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

.footer-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 30px;
}
</style>