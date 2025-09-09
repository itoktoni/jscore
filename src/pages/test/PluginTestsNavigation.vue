<template>
  <div class="card">
    <div class="card-header">
      <h1>Capacitor Plugin Tests Navigation</h1>
      <p>Navigate to individual plugin tests</p>
    </div>

    <div class="card-body">
      <div class="navigation-section">
        <h2>Navigation Options</h2>
        <div class="nav-options">
          <router-link to="/test/capacitor-plugins" class="button primary">View All Plugins on One Page</router-link>
          <router-link to="/test/plugins-by-package" class="button primary">View Plugins Organized by Package</router-link>
        </div>
      </div>

      <div class="plugin-list">
        <div class="plugin-item">
          <h3>App Plugin</h3>
          <p>Test basic app information and functionality</p>
          <router-link to="/test/plugins/app" class="button primary">Test App Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Camera Plugin</h3>
          <p>Capture photos and access gallery</p>
          <router-link to="/test/plugins/camera" class="button primary">Test Camera Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Network Plugin</h3>
          <p>Monitor network status and connectivity</p>
          <router-link to="/test/plugins/network" class="button primary">Test Network Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Preferences Plugin</h3>
          <p>Store and retrieve key-value pairs</p>
          <router-link to="/test/plugins/preferences" class="button primary">Test Preferences Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Splash Screen Plugin</h3>
          <p>Show and hide splash screen</p>
          <router-link to="/test/plugins/splash-screen" class="button primary">Test Splash Screen Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Safe Area Plugin</h3>
          <p>Handle safe area insets on mobile devices</p>
          <router-link to="/test/plugins/safe-area" class="button primary">Test Safe Area Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Barcode Scanner Plugin</h3>
          <p>Scan barcodes and QR codes using camera</p>
          <router-link to="/test/plugins/barcode-scanner" class="button primary">Test Barcode Scanner Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Geolocation Plugin</h3>
          <p>Get current device location</p>
          <router-link to="/test/plugins/geolocation" class="button primary">Test Geolocation Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Local Notifications Plugin</h3>
          <p>Schedule and manage local notifications</p>
          <router-link to="/test/plugins/local-notifications" class="button primary">Test Local Notifications Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Filesystem Plugin</h3>
          <p>Read, write, and manage files</p>
          <router-link to="/test/plugins/filesystem" class="button primary">Test Filesystem Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Browser Plugin</h3>
          <p>Open URLs in system browser</p>
          <router-link to="/test/plugins/browser" class="button primary">Test Browser Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Bluetooth Printer Plugin</h3>
          <p>Connect and print to Bluetooth printers</p>
          <router-link to="/test/plugins/bluetooth-printer" class="button primary">Test Bluetooth Printer Plugin</router-link>
        </div>

        <div class="plugin-item">
          <h3>Bluetooth Direct Printer</h3>
          <p>Connect and print to Bluetooth printers using direct printing method</p>
          <router-link to="/test/plugins/bluetooth-direct-printer" class="button primary">Test Bluetooth Direct Printer</router-link>
        </div>

        <div class="plugin-item">
          <h3>Kduma Bluetooth Printer</h3>
          <p>Connect and print to Bluetooth printers using Kduma's plugin</p>
          <router-link to="/test/plugins/kduma-bluetooth-printer" class="button primary">Test Kduma Bluetooth Printer</router-link>
        </div>

        <!-- Thermal Printer section removed -->

        <div class="plugin-item">
          <h3>InAppBrowser Plugin</h3>
          <p>Open URLs in in-app browser</p>
          <router-link to="/test/plugins/inappbrowser" class="button primary">Test InAppBrowser Plugin</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this navigation page
</script>

<style scoped>
.card-body {
  padding: 1rem;
}

.navigation-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e1e1;
}

.navigation-section h2 {
  margin-top: 0;
}

.nav-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.plugin-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.plugin-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
}

.plugin-item h3 {
  margin-top: 0;
  color: #333;
}

.plugin-item p {
  color: #666;
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.primary:hover {
  background-color: #0056b3;
}

.back-link {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e1e1e1;
}
</style>