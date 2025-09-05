<template>
  <div class="plugin-section">
    <h2>@capacitor/preferences</h2>
    <div class="plugin-content">
      <p><strong>Preferences Test:</strong></p>
      <div class="form-group">
        <label for="prefKey">Key:</label>
        <input id="prefKey" v-model="prefKey" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label for="prefValue">Value:</label>
        <input id="prefValue" v-model="prefValue" type="text" class="form-control" />
      </div>
      <button class="button primary" @click="setPreference">Set Preference</button>
      <button class="button secondary" @click="getPreference">Get Preference</button>
      <div v-if="prefResult">
        <p><strong>Result:</strong> {{ prefResult }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

// Reactive data
const prefKey = ref('testKey')
const prefValue = ref('testValue')
const prefResult = ref('')

// Preferences Plugin
const setPreference = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: prefKey.value,
        value: prefValue.value
      })
      prefResult.value = `Set preference: ${prefKey.value} = ${prefValue.value}`
      console.log('Preference set')
    } else {
      localStorage.setItem(prefKey.value, prefValue.value)
      prefResult.value = `Set localStorage: ${prefKey.value} = ${prefValue.value}`
    }
  } catch (error) {
    console.error('Error setting preference:', error)
    prefResult.value = `Error: ${error.message}`
  }
}

const getPreference = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: prefKey.value })
      prefResult.value = result.value || 'Not found'
      console.log('Preference retrieved:', result)
    } else {
      const value = localStorage.getItem(prefKey.value)
      prefResult.value = value || 'Not found'
    }
  } catch (error) {
    console.error('Error getting preference:', error)
    prefResult.value = `Error: ${error.message}`
  }
}
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
