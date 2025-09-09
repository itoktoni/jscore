<template>
  <div class="card">
    <div class="card-header">
      <h1>Capacitor Plugins by Package</h1>
      <p>Organized by npm package name</p>
    </div>

    <div class="card-body">
      <div class="navigation-section">
        <h2>Navigation Options</h2>
        <div class="nav-options">
          <router-link to="/test/capacitor-plugins" class="button primary">View All Plugins on One Page</router-link>
          <router-link to="/test/plugin-tests" class="button primary">View Plugins by Navigation</router-link>
        </div>
      </div>

      <!-- Official Capacitor Plugins -->
      <div class="package-section">
        <h2>@capacitor/* (Official Plugins)</h2>

        <div class="plugin-group">
          <div class="plugin-item">
            <h3>@capacitor/app</h3>
            <p>App information and functionality</p>
            <router-link to="/test/plugins/app" class="button primary">Test App Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/camera</h3>
            <p>Capture photos and access gallery</p>
            <router-link to="/test/plugins/camera" class="button primary">Test Camera Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/network</h3>
            <p>Monitor network status and connectivity</p>
            <router-link to="/test/plugins/network" class="button primary">Test Network Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/preferences</h3>
            <p>Store and retrieve key-value pairs</p>
            <router-link to="/test/plugins/preferences" class="button primary">Test Preferences Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/splash-screen</h3>
            <p>Show and hide splash screen</p>
            <router-link to="/test/plugins/splash-screen" class="button primary">Test Splash Screen Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/geolocation</h3>
            <p>Get current device location</p>
            <router-link to="/test/plugins/geolocation" class="button primary">Test Geolocation Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/local-notifications</h3>
            <p>Schedule and manage local notifications</p>
            <router-link to="/test/plugins/local-notifications" class="button primary">Test Local Notifications Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/filesystem</h3>
            <p>Read, write, and manage files</p>
            <router-link to="/test/plugins/filesystem" class="button primary">Test Filesystem Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/browser</h3>
            <p>Open URLs in system browser</p>
            <router-link to="/test/plugins/browser" class="button primary">Test Browser Plugin</router-link>
          </div>
        </div>
      </div>

      <!-- Community Plugins -->
      <div class="package-section">
        <h2>@capacitor-community/* (Community Plugins)</h2>

        <div class="plugin-group">
          <div class="plugin-item">
            <h3>@capacitor-community/barcode-scanner</h3>
            <p>Scan barcodes and QR codes using camera</p>
            <router-link to="/test/plugins/barcode-scanner" class="button primary">Test Barcode Scanner Plugin</router-link>
          </div>
        </div>
      </div>

      <!-- Third-party Plugins -->
      <div class="package-section">
        <h2>Third-party Plugins</h2>

        <div class="plugin-group">
          <div class="plugin-item">
            <h3>@aashu-dubey/capacitor-statusbar-safe-area</h3>
            <p>Handle safe area insets on mobile devices</p>
            <router-link to="/test/plugins/safe-area" class="button primary">Test Safe Area Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@capacitor/inappbrowser</h3>
            <p>Open URLs in in-app browser</p>
            <router-link to="/test/plugins/inappbrowser" class="button primary">Test InAppBrowser Plugin</router-link>
          </div>

          <div class="plugin-item">
            <h3>@kduma-autoid/capacitor-bluetooth-printer</h3>
            <p>Connect and print to Bluetooth printers using Kduma's plugin</p>
            <router-link to="/test/plugins/kduma-bluetooth-printer" class="button primary">Test Kduma Bluetooth Printer</router-link>
          </div>

          <div class="plugin-item">
            <h3>lidta-capacitor-bl-printer</h3>
            <p>Connect and print to Bluetooth printers using direct printing method</p>
            <router-link to="/test/plugins/bluetooth-direct-printer" class="button primary">Test Bluetooth Direct Printer</router-link>
          </div>

          <!-- Thermal printer section removed -->

          <div class="plugin-item">
            <h3>@capacitor/barcode-scanner</h3>
            <p>Official barcode scanner (alternative version)</p>
            <div class="note">Note: This is an alternative to the community version</div>
            <router-link to="/test/plugins/barcode-scanner" class="button primary">Test Barcode Scanner Plugin</router-link>
          </div>
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

.package-section {
  margin-bottom: 2rem;
}

.package-section h2 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.plugin-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
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
  font-size: 1.1rem;
}

.plugin-item p {
  color: #666;
  margin-bottom: 1rem;
}

.note {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
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
  margin-top: 2rem;
}
</style>