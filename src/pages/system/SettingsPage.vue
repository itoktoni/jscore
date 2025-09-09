<template>
  <div class="card">
    <FormContainer title="Website Settings" :initial-data="initialFormData" :submit-handler="saveSettings" @success="handleSuccess" @error="handleError">
      <FormInput name="websiteName" label="Website Name" placeholder="Enter website name"
        hint="If not provided, the system will use the value from .env file" col="12" />

      <FormInput name="websiteUrl" label="Website URL" type="url" placeholder="https://example.com"
        hint="API requests will be sent to this URL. If not provided, the system will use the value from .env file"
        col="12" />

      <FormToggle name="darkMode" label="Dark Mode" on-text="Enabled" off-text="Disabled" show-text col="12" />

      <FormSelect
        name="defaultPrinter"
        label="Default Printer"
        :options="printerOptions"
        option-label="name"
        option-value="address"
        placeholder="Select a default printer"
        hint="Select a default printer for receipt printing"
        col="12"
        :loading="loadingPrinters"
      />

      <template #footer="{ isSubmitting }">
        <div class="form-actions">
          <Button type="button" variant="secondary" @click="resetToDefaults" text="Reset" />
          <Button type="button" variant="secondary" @click="refreshPrinters" text="List Printer" :disabled="loadingPrinters" />
          <Button type="submit" variant="success" :text="isSubmitting ? 'Saving...' : 'Save'"
            :disabled="isSubmitting" />
        </div>
      </template>
    </FormContainer>
  </div>

  <div class="card">

    <div class="page-header">
      <h2>Current Configuration</h2>
    </div>

    <div class="form-container">
      <FormLabel name="websiteName" label="Website Name" :value="currentWebsiteName" col="12" />
      <FormLabel name="websiteUrl" label="Website URL" :value="currentWebsiteUrl" col="12" />
      <FormLabel name="darkMode" label="Dark Mode" :value="settingsStore.isDarkMode ? 'Enabled' : 'Disabled'" col="12" />
      <FormLabel name="defaultPrinter"native="true" label="Default Printer" :value="currentDefaultPrinterName || 'Not set'" col="12" />
      <FormLabel name="environment" label="Environment" :value="environment" col="12" />
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useAlert } from '../../composables/useAlert'
import { http } from '../../stores/http'
import { Capacitor } from '@capacitor/core'
import FormContainer from '../../components/FormContainer.vue'
import FormInput from '../../components/FormInput.vue'
import FormToggle from '../../components/FormToggle.vue'
import FormSelect from '../../components/FormSelect.vue'
import Button from '../../components/Button.vue'
import FormLabel from '../../components/FormLabel.vue'

// Dynamically import printer plugins
let LidtaCapacitorBlPrinter

const settingsStore = useSettingsStore()
const { alertSuccess, alertError } = useAlert()

const initialFormData = ref({
  websiteName: '',
  websiteUrl: '',
  darkMode: false,
  defaultPrinter: ''
})

const printerOptions = ref([])
const loadingPrinters = ref(false)

// Environment info
const environment = import.meta.env.VITE_APP_ENV || 'production'

// Computed properties for current values
const currentWebsiteName = computed(() => {
  return settingsStore.getWebsiteName
})

const currentWebsiteUrl = computed(() => {
  return settingsStore.getWebsiteUrl
})

const currentDefaultPrinterName = computed(() => {
  if (!settingsStore.getDefaultPrinter) return null

  const printer = printerOptions.value.find(p => p.address === settingsStore.getDefaultPrinter)
  return printer ? printer.name : settingsStore.getDefaultPrinter
})

// Watch for changes in settings store and update form data
watch(
  () => settingsStore.websiteName,
  (newVal) => {
    initialFormData.value.websiteName = newVal || ''
  }
)

watch(
  () => settingsStore.websiteUrl,
  (newVal) => {
    initialFormData.value.websiteUrl = newVal || ''
  }
)

watch(
  () => settingsStore.darkMode,
  (newVal) => {
    initialFormData.value.darkMode = newVal
  }
)

watch(
  () => settingsStore.defaultPrinter,
  (newVal) => {
    initialFormData.value.defaultPrinter = newVal || ''
  }
)

// Load settings on component mount
onMounted(async () => {
  // Ensure settings are loaded from storage
  await settingsStore.loadSettings()

  // Update form data with current settings
  initialFormData.value.websiteName = settingsStore.websiteName || ''
  initialFormData.value.websiteUrl = settingsStore.websiteUrl || ''
  initialFormData.value.darkMode = settingsStore.darkMode
  initialFormData.value.defaultPrinter = settingsStore.defaultPrinter || ''

  // Load available printers
  await loadAvailablePrinters()
})

// Load available printers from both plugins
const loadAvailablePrinters = async () => {
  if (!Capacitor.isNativePlatform()) return

  loadingPrinters.value = true
  printerOptions.value = []

  try {
    // Load printer plugins dynamically
    await loadPrinterPlugins()

    // Get printers from LidtaCapacitorBlPrinter if available
    if (LidtaCapacitorBlPrinter) {
      try {
        const result = await LidtaCapacitorBlPrinter.getPairedDevices()
        const devices = result.devices || []
        printerOptions.value = [...printerOptions.value, ...devices.map(device => ({
          name: `${device.name}`,
          address: device.address
        }))]
      } catch (error) {
        console.warn('Error loading Lidta printers:', error)
      }
    }

    // Kduma BluetoothPrinter removed since we're not using that package anymore
  } catch (error) {
    console.error('Error loading printers:', error)
  } finally {
    loadingPrinters.value = false
  }
}

// Load printer plugins dynamically
const loadPrinterPlugins = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Try to load LidtaCapacitorBlPrinter
      try {
        const lidtaModule = await import('lidta-capacitor-bl-printer')
        LidtaCapacitorBlPrinter = lidtaModule.LidtaCapacitorBlPrinter
      } catch (error) {
        console.warn('LidtaCapacitorBlPrinter plugin not available:', error)
      }

      // Kduma BluetoothPrinter removed since we're not using that package anymore
    }
  } catch (error) {
    console.warn('Error loading printer plugins:', error)
  }
}

// Refresh printers
const refreshPrinters = async () => {
  await loadAvailablePrinters()
  alertSuccess('Printers refreshed successfully')
}

// Save settings
const saveSettings = async (formData) => {
  console.log('saveSettings called with:', formData)

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

    // Update default printer setting
    if (formData.defaultPrinter) {
      await settingsStore.setDefaultPrinter(formData.defaultPrinter)
    } else {
      await settingsStore.setDefaultPrinter(null)
    }

    // Update HTTP service baseURL
    http.updateBaseURL()

    console.log('Settings saved. Current HTTP baseURL:', http.baseURL)

    // Show success message
    alertSuccess('Settings saved successfully')

    // Return success response that FormContainer expects
    return {
      success: true,
      data: formData,
      message: 'Settings saved successfully'
    }
  } catch (error) {
    console.error('Error saving settings:', error)

    // Show error message
    alertError('Error', 'Failed to save settings: ' + (error.message || 'Unknown error'))

    // Return error response that FormContainer expects
    return {
      success: false,
      error: error.message || 'Failed to save settings',
      data: formData
    }
  }
}

// Handle successful form submission
function handleSuccess(response) {
  // This might be called if FormContainer handles the response from saveSettings
  console.log('handleSuccess called with:', response)
}

// Handle form submission error
function handleError(error) {
  // This might be called if saveSettings throws an error
  console.log('handleError called with:', error)
}

// Reset to defaults
const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await settingsStore.resetToDefaults()
      initialFormData.value.websiteName = ''
      initialFormData.value.websiteUrl = ''
      initialFormData.value.darkMode = false
      initialFormData.value.defaultPrinter = ''

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