<template>
  <div class="card">
    <div class="card-header">
      <h1>Capacitor Plugins Test</h1>
      <p>Test all installed Capacitor plugins</p>
      <div class="navigation-section">
        <h2>Navigation Options</h2>
        <div class="nav-options">
          <router-link to="/test/plugin-tests" class="button primary">View Individual Plugin Tests</router-link>
          <router-link to="/test/plugins-by-package" class="button primary">View Plugins Organized by Package</router-link>
        </div>
      </div>
    </div>

    <div class="card-body">
      <!-- App Plugin -->
      <AppTest />

      <!-- Camera Plugin -->
      <CameraTest />

      <!-- Network Plugin -->
      <NetworkTest />

      <!-- Preferences Plugin -->
      <PreferencesTest />

      <!-- Splash Screen Plugin -->
      <SplashScreenTest />

      <!-- Status Bar & Safe Area Plugin -->
      <SafeAreaTest />

      <!-- Barcode Scanner Plugin -->
      <BarcodeScannerTest />

      <!-- Geolocation Plugin -->
      <GeolocationTest />

      <!-- Local Notifications Plugin -->
      <LocalNotificationsTest />

      <!-- Filesystem Plugin -->
      <FilesystemTest />

      <!-- Browser Plugin -->
      <BrowserTest />

      <!-- Bluetooth Printer Plugin -->
      <!-- <BluetoothPrinterTest /> -->

      <!-- InAppBrowser Plugin -->
      <InAppBrowserTest />
    </div>
  </div>
</template>

<script setup>
import AppTest from '../../components/plugin-tests/AppTest.vue'
import CameraTest from '../../components/plugin-tests/CameraTest.vue'
import NetworkTest from '../../components/plugin-tests/NetworkTest.vue'
import PreferencesTest from '../../components/plugin-tests/PreferencesTest.vue'
import SplashScreenTest from '../../components/plugin-tests/SplashScreenTest.vue'
import SafeAreaTest from '../../components/plugin-tests/SafeAreaTest.vue'
import BarcodeScannerTest from '../../components/plugin-tests/BarcodeScannerTest.vue'
import GeolocationTest from '../../components/plugin-tests/GeolocationTest.vue'
import LocalNotificationsTest from '../../components/plugin-tests/LocalNotificationsTest.vue'
import FilesystemTest from '../../components/plugin-tests/FilesystemTest.vue'
import BrowserTest from '../../components/plugin-tests/BrowserTest.vue'
// import BluetoothPrinterTest from '../../components/plugin-tests/BluetoothPrinterTest.vue'
import InAppBrowserTest from '../../components/plugin-tests/InAppBrowserTest.vue'
</script>

<style scoped>
.card-body {
  padding: 1rem;
}

.navigation-section {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.navigation-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.nav-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.button.primary {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.button.primary:hover {
  background-color: #0056b3;
}
</style>