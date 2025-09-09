// Plugin test routes export
export const pluginTestRoutes = [
  {
    path: '/test/plugins/app',
    name: 'AppPluginTest',
    component: () => import('../../../components/plugin-tests/AppTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/camera',
    name: 'CameraPluginTest',
    component: () => import('../../../components/plugin-tests/CameraTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/network',
    name: 'NetworkPluginTest',
    component: () => import('../../../components/plugin-tests/NetworkTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/preferences',
    name: 'PreferencesPluginTest',
    component: () => import('../../../components/plugin-tests/PreferencesTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/splash-screen',
    name: 'SplashScreenPluginTest',
    component: () => import('../../../components/plugin-tests/SplashScreenTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/safe-area',
    name: 'SafeAreaPluginTest',
    component: () => import('../../../components/plugin-tests/SafeAreaTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/barcode-scanner',
    name: 'BarcodeScannerPluginTest',
    component: () => import('../../../components/plugin-tests/BarcodeScannerTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/geolocation',
    name: 'GeolocationPluginTest',
    component: () => import('../../../components/plugin-tests/GeolocationTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/local-notifications',
    name: 'LocalNotificationsPluginTest',
    component: () => import('../../../components/plugin-tests/LocalNotificationsTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/filesystem',
    name: 'FilesystemPluginTest',
    component: () => import('../../../components/plugin-tests/FilesystemTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/browser',
    name: 'BrowserPluginTest',
    component: () => import('../../../components/plugin-tests/BrowserTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // {
  //   path: '/test/plugins/bluetooth-printer',
  //   name: 'BluetoothPrinterPluginTest',
  //   component: () => import('../../../components/plugin-tests/BluetoothPrinterTest.vue'),
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/test/plugins/inappbrowser',
    name: 'InAppBrowserPluginTest',
    component: () => import('../../../components/plugin-tests/InAppBrowserTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/bluetooth-direct-printer',
    name: 'BluetoothDirectPrinterPluginTest',
    component: () => import('../../../components/plugin-tests/BluetoothDirectPrinterTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test/plugins/kduma-bluetooth-printer',
    name: 'KdumaBluetoothPrinterPluginTest',
    component: () => import('../../../components/plugin-tests/KdumaBluetoothPrinterTest.vue'),
    meta: {
      requiresAuth: true
    }
  }
  // Thermal printer route removed
]