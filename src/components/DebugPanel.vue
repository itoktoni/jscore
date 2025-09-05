<template>
  <div v-if="showDebug" class="debug-panel">
    <h3>Debug Info</h3>
    <div class="debug-item">
      <strong>Platform:</strong> {{ platformInfo.platform }}
    </div>
    <div class="debug-item">
      <strong>Is Native:</strong> {{ platformInfo.isNative }}
    </div>
    <div class="debug-item">
      <strong>API Base URL:</strong> {{ apiBaseUrl }}
    </div>
    <div class="debug-item">
      <strong>Auth Token:</strong> {{ authStore.token ? 'Present' : 'None' }}
    </div>
    <div class="debug-item">
      <strong>Is Authenticated:</strong> {{ authStore.isAuthenticated }}
    </div>
    <div class="debug-item">
      <strong>User:</strong> {{ authStore.user ? 'Loaded' : 'None' }}
    </div>
    <div class="debug-item">
      <strong>Last Error:</strong> {{ authStore.error || 'None' }}
    </div>

    <div class="debug-actions">
      <button @click="testNetworkConnection" :disabled="testing">
        {{ testing ? 'Testing...' : 'Test Network' }}
      </button>
      <button @click="testApiEndpoint" :disabled="testing">
        {{ testing ? 'Testing...' : 'Test API' }}
      </button>
      <button @click="testLoginEndpoint" :disabled="testing">
        {{ testing ? 'Testing...' : 'Test Login' }}
      </button>
      <button @click="testDetailedConnection" :disabled="testing">
        {{ testing ? 'Testing...' : 'Detailed Test' }}
      </button>
      <button @click="testLoginWithHeaders" :disabled="testing">
        {{ testing ? 'Testing...' : 'Test Headers' }}
      </button>
      <button @click="testSSLBypass" :disabled="testing">
        {{ testing ? 'Testing...' : 'Test SSL' }}
      </button>
      <button @click="traceLoginRequest" :disabled="testing">
        {{ testing ? 'Tracing...' : 'Trace Login' }}
      </button>
      <button @click="testDirectLogin" :disabled="testing">
        {{ testing ? 'Testing...' : 'Direct Login' }}
      </button>
      <button @click="testServerSimulation" :disabled="testing">
        {{ testing ? 'Simulating...' : 'Test Offline' }}
      </button>
      <button @click="testFormDataLogin" :disabled="testing">
        {{ testing ? 'Testing...' : 'FormData' }}
      </button>
      <button @click="testUrlEncodedLogin" :disabled="testing">
        {{ testing ? 'Testing...' : 'URL-Encoded' }}
      </button>
      <button @click="testXHRLogin" :disabled="testing">
        {{ testing ? 'Testing...' : 'Raw XHR' }}
      </button>
      <button @click="testRawSocketDiagnostics" :disabled="testing">
        {{ testing ? 'Testing...' : 'Socket Test' }}
      </button>
      <button @click="testCapacitorHttp" :disabled="testing">
        {{ testing ? 'Testing...' : 'Native HTTP' }}
      </button>
      <button @click="clearStoredData">Clear Data</button>
    </div>

    <div v-if="networkTestResult" class="debug-result">
      <strong>Network Test:</strong> {{ networkTestResult }}
    </div>
  </div>

  <button @click="toggleDebug" class="debug-toggle">
    {{ showDebug ? 'Hide' : 'Show' }} Debug
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { http } from '../stores/http'
import { useAuthStore } from '../stores/auth'
import { useAlert } from '../composables/useAlert'
import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'
import { SplashScreen } from '@capacitor/splash-screen'

const authStore = useAuthStore()
const showDebug = ref(false)
const testing = ref(false)
const networkTestResult = ref('')

const platformInfo = computed(() => ({
  platform: Capacitor.getPlatform(),
  isNative: Capacitor.isNativePlatform()
}))

const getApiBaseUrl = () => {
  return http.baseURL || 'Unknown'
}

const apiBaseUrl = computed(() => {
  return getApiBaseUrl()
})

const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const testNetworkConnection = async () => {
  testing.value = true
  networkTestResult.value = ''

  try {
    const response = await fetch('https://newcore.nexeratech.co.id/api/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      networkTestResult.value = `Success: ${response.status}`
    } else {
      networkTestResult.value = `Failed: ${response.status} ${response.statusText}`
    }
  } catch (error) {
    networkTestResult.value = `Error: ${error.message}`
  } finally {
    testing.value = false
  }
}

const clearStoredData = async () => {
  try {
    await Preferences.remove({ key: 'auth_token' })
    await authStore.logout()
    networkTestResult.value = 'Stored data cleared'
  } catch (error) {
    networkTestResult.value = `Clear error: ${error.message}`
  }
}

const testApiEndpoint = async () => {
  testing.value = true
  networkTestResult.value = ''

  try {
    const baseUrl = Capacitor.isNativePlatform()
      ? 'https://newcore.nexeratech.co.id/api'
      : '/api'

    console.log('[Debug] Testing API endpoint:', baseUrl)

    const response = await fetch(`${baseUrl}/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    })

    if (response.ok) {
      const text = await response.text()
      networkTestResult.value = `API Success: ${response.status} - ${text.substring(0, 100)}`
    } else {
      networkTestResult.value = `API Failed: ${response.status} ${response.statusText}`
    }
  } catch (error) {
    console.error('[Debug] API test error:', error)
    networkTestResult.value = `API Error: ${error.message}`
  } finally {
    testing.value = false
  }
}

const testLoginEndpoint = async () => {
  testing.value = true
  networkTestResult.value = ''

  try {
    const baseUrl = Capacitor.isNativePlatform()
      ? 'https://newcore.nexeratech.co.id/api'
      : '/api'

    console.log('[Debug] Testing login endpoint:', `${baseUrl}/login`)

    // Test with admin credentials to check if endpoint is reachable
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      }),
      mode: 'cors'
    })

    const text = await response.text()
    networkTestResult.value = `Login Test: ${response.status} - Endpoint reachable`
    console.log('[Debug] Login endpoint response:', text.substring(0, 200))

  } catch (error) {
    console.error('[Debug] Login test error:', error)
    networkTestResult.value = `Login Error: ${error.message}`
  } finally {
    testing.value = false
  }
}

const testDetailedConnection = async () => {
  testing.value = true
  networkTestResult.value = 'Running detailed diagnostics...'

  try {
    const diagnostics = []

    // Test 1: Basic connectivity
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors'
      })
      diagnostics.push(`✓ Basic Internet: ${response.status}`)
    } catch (error) {
      diagnostics.push(`✗ Basic Internet: ${error.message}`)
    }

    // Test 2: DNS Resolution
    try {
      const response = await fetch('https://newcore.nexeratech.co.id', {
        method: 'HEAD',
        mode: 'no-cors'
      })
      diagnostics.push(`✓ DNS Resolution: OK`)
    } catch (error) {
      diagnostics.push(`✗ DNS Resolution: ${error.message}`)
    }

    // Test 3: HTTPS Certificate
    try {
      const response = await fetch('https://newcore.nexeratech.co.id/api', {
        method: 'HEAD',
        mode: 'cors'
      })
      diagnostics.push(`✓ HTTPS/SSL: ${response.status || 'OK'}`)
    } catch (error) {
      diagnostics.push(`✗ HTTPS/SSL: ${error.message}`)
    }

    // Test 4: API Endpoint
    try {
      const response = await fetch('https://newcore.nexeratech.co.id/api/login', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        mode: 'cors'
      })
      diagnostics.push(`✓ CORS Preflight: ${response.status}`)
    } catch (error) {
      diagnostics.push(`✗ CORS Preflight: ${error.message}`)
    }

        // Test 5: Platform-specific info
        diagnostics.push(`Platform: ${Capacitor.getPlatform()}`)
        diagnostics.push(`Native: ${Capacitor.isNativePlatform()}`)
        diagnostics.push(`User Agent: ${navigator.userAgent.substring(0, 50)}...`)

        networkTestResult.value = diagnostics.join('\n')

      } catch (error) {
        networkTestResult.value = `Diagnostic Error: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testLoginWithHeaders = async () => {
      testing.value = true
      networkTestResult.value = 'Testing login with proper JSON headers...'

      try {
        const baseUrl = Capacitor.isNativePlatform()
          ? 'https://newcore.nexeratech.co.id/api'
          : '/api'

        console.log('[Debug] Testing login with headers:', `${baseUrl}/login`)

        const response = await fetch(`${baseUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'CapacitorApp/1.0.0'
          },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin'
          }),
          mode: 'cors',
          cache: 'no-cache'
        })

        const responseText = await response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          responseData = responseText
        }

        networkTestResult.value = `Headers Test: ${response.status} - ${response.statusText}\nResponse: ${JSON.stringify(responseData).substring(0, 200)}`
        console.log('[Debug] Login headers test response:', responseData)

      } catch (error) {
        console.error('[Debug] Login headers test error:', error)
        networkTestResult.value = `Headers Test Error: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testSSLBypass = async () => {
      testing.value = true
      networkTestResult.value = 'Testing SSL/TLS connections...'

      try {
        const results = []
        const baseUrl = 'https://newcore.nexeratech.co.id'

        // Test 1: Basic HTTPS connection
        try {
          const response = await fetch(baseUrl, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
          })
          results.push('✓ HTTPS Base: Connected')
        } catch (error) {
          results.push(`✗ HTTPS Base: ${error.message}`)
        }

        // Test 2: API endpoint HTTPS
        try {
          const response = await fetch(`${baseUrl}/api`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
          })
          results.push(`✓ API HTTPS: ${response.status}`)
        } catch (error) {
          results.push(`✗ API HTTPS: ${error.message}`)
        }

        // Test 3: Login endpoint SSL
        try {
          const response = await fetch(`${baseUrl}/api/login`, {
            method: 'OPTIONS',
            headers: {
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type, Accept'
            },
            mode: 'cors',
            cache: 'no-cache'
          })
          results.push(`✓ Login SSL: ${response.status}`)
        } catch (error) {
          results.push(`✗ Login SSL: ${error.message}`)
        }

        // Test 4: Try with different TLS settings
        try {
          const xhr = new XMLHttpRequest()
          xhr.open('GET', `${baseUrl}/api`, true)
          xhr.timeout = 10000

          await new Promise((resolve, reject) => {
            xhr.onload = () => resolve(xhr)
            xhr.onerror = () => reject(new Error('XHR SSL failed'))
            xhr.ontimeout = () => reject(new Error('XHR SSL timeout'))
            xhr.send()
          })

          results.push('✓ XHR SSL: Connected')
        } catch (error) {
          results.push(`✗ XHR SSL: ${error.message}`)
        }

        // Add platform-specific info
        results.push(`Platform: ${Capacitor.getPlatform()}`)
        results.push(`Debug Mode: ${import.meta.env.DEV}`)

        networkTestResult.value = results.join('\n')

      } catch (error) {
        networkTestResult.value = `SSL Test Error: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const traceLoginRequest = async () => {
      testing.value = true
      networkTestResult.value = 'Starting comprehensive login trace...'

      const traceLog = []
      const startTime = Date.now()

      try {
        // Step 1: Environment Check
        traceLog.push(`=== ENVIRONMENT CHECK ===`)
        traceLog.push(`Timestamp: ${new Date().toISOString()}`)
        traceLog.push(`Platform: ${Capacitor.getPlatform()}`)
        traceLog.push(`Is Native: ${Capacitor.isNativePlatform()}`)
        traceLog.push(`User Agent: ${navigator.userAgent}`)
        traceLog.push(`Online Status: ${navigator.onLine}`)
        traceLog.push(`Base URL: ${http.baseURL}`)

        // Step 2: Network Connectivity Test
        traceLog.push(`\n=== NETWORK CONNECTIVITY ===`)
        try {
          const pingStart = Date.now()
          const pingResponse = await fetch('https://google.com', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          })
          traceLog.push(`✓ Internet: ${Date.now() - pingStart}ms`)
        } catch (error) {
          traceLog.push(`✗ Internet: ${error.message}`)
        }

        // Step 3: DNS Resolution Test
        traceLog.push(`\n=== DNS RESOLUTION ===`)
        try {
          const dnsStart = Date.now()
          const dnsResponse = await fetch('https://newcore.nexeratech.co.id', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          })
          traceLog.push(`✓ DNS Resolution: ${Date.now() - dnsStart}ms`)
        } catch (error) {
          traceLog.push(`✗ DNS Resolution: ${error.message}`)
        }

        // Step 4: SSL/TLS Handshake Test
        traceLog.push(`\n=== SSL/TLS HANDSHAKE ===`)
        try {
          const sslStart = Date.now()
          const sslResponse = await fetch('https://newcore.nexeratech.co.id/api', {
            method: 'HEAD',
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
          })
          traceLog.push(`✓ SSL Handshake: ${Date.now() - sslStart}ms`)
          traceLog.push(`   Status: ${sslResponse.status}`)
          traceLog.push(`   Headers: ${JSON.stringify(Object.fromEntries(sslResponse.headers))}`)
        } catch (error) {
          traceLog.push(`✗ SSL Handshake: ${error.message}`)
          traceLog.push(`   Error Name: ${error.name}`)
          traceLog.push(`   Error Stack: ${error.stack?.substring(0, 200)}`)
        }

        // Step 5: CORS Preflight Test
        traceLog.push(`\n=== CORS PREFLIGHT ===`)
        try {
          const corsStart = Date.now()
          const corsResponse = await fetch('https://newcore.nexeratech.co.id/api/login', {
            method: 'OPTIONS',
            headers: {
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            cache: 'no-cache'
          })
          traceLog.push(`✓ CORS Preflight: ${Date.now() - corsStart}ms`)
          traceLog.push(`   Status: ${corsResponse.status}`)

          // Log all response headers
          for (const [key, value] of corsResponse.headers.entries()) {
            traceLog.push(`   ${key}: ${value}`)
          }
        } catch (error) {
          traceLog.push(`✗ CORS Preflight: ${error.message}`)
        }

        // Step 6: Actual Login Request
        traceLog.push(`\n=== LOGIN REQUEST (ADMIN CREDENTIALS) ===`)
        const loginData = {
          username: 'admin',
          password: 'admin'
        }

        try {
          const loginStart = Date.now()
          traceLog.push(`Sending POST to: https://newcore.nexeratech.co.id/api/login`)
          traceLog.push(`Request Body: ${JSON.stringify(loginData)}`)

          const loginResponse = await fetch('https://newcore.nexeratech.co.id/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'CapacitorApp/1.0.0',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(loginData),
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit'
          })

          const requestTime = Date.now() - loginStart
          traceLog.push(`✓ Login Request: ${requestTime}ms`)
          traceLog.push(`   Status: ${loginResponse.status} ${loginResponse.statusText}`)

          // Log all response headers
          for (const [key, value] of loginResponse.headers.entries()) {
            traceLog.push(`   ${key}: ${value}`)
          }

          // Try to read response body
          try {
            const responseText = await loginResponse.text()
            traceLog.push(`   Response Length: ${responseText.length} chars`)
            traceLog.push(`   Response Preview: ${responseText.substring(0, 500)}`)

            // Try to parse as JSON
            try {
              const responseJson = JSON.parse(responseText)
              traceLog.push(`   JSON Valid: Yes`)
              traceLog.push(`   JSON Keys: ${Object.keys(responseJson).join(', ')}`)
            } catch (jsonError) {
              traceLog.push(`   JSON Valid: No - ${jsonError.message}`)
            }
          } catch (readError) {
            traceLog.push(`   Response Read Error: ${readError.message}`)
          }

        } catch (error) {
          traceLog.push(`✗ Login Request: ${error.message}`)
          traceLog.push(`   Error Name: ${error.name}`)
          traceLog.push(`   Error Code: ${error.code}`)
          traceLog.push(`   Error Stack: ${error.stack?.substring(300)}`)
        }

        // Step 7: XHR Alternative Test
        traceLog.push(`\n=== XHR ALTERNATIVE ===`)
        try {
          const xhrResult = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            const xhrStart = Date.now()

            xhr.open('POST', 'https://newcore.nexeratech.co.id/api/login', true)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.setRequestHeader('Accept', 'application/json')
            xhr.timeout = 15000

            xhr.onload = function() {
              const xhrTime = Date.now() - xhrStart
              resolve({
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText,
                time: xhrTime,
                headers: xhr.getAllResponseHeaders()
              })
            }

            xhr.onerror = function() {
              reject(new Error(`XHR Error: ${xhr.status} ${xhr.statusText}`))
            }

            xhr.ontimeout = function() {
              reject(new Error('XHR Timeout'))
            }

            xhr.send(JSON.stringify(loginData))
          })

          traceLog.push(`✓ XHR Request: ${xhrResult.time}ms`)
          traceLog.push(`   Status: ${xhrResult.status} ${xhrResult.statusText}`)
          traceLog.push(`   Headers: ${xhrResult.headers}`)
          traceLog.push(`   Response: ${xhrResult.responseText.substring(0, 300)}`)

        } catch (error) {
          traceLog.push(`✗ XHR Request: ${error.message}`)
        }

        // Summary
        const totalTime = Date.now() - startTime
        traceLog.push(`\n=== SUMMARY ===`)
        traceLog.push(`Total Trace Time: ${totalTime}ms`)
        traceLog.push(`Trace Complete: ${new Date().toISOString()}`)

        networkTestResult.value = traceLog.join('\n')

      } catch (error) {
        traceLog.push(`\n=== TRACE ERROR ===`)
        traceLog.push(`Error: ${error.message}`)
        traceLog.push(`Stack: ${error.stack}`)
        networkTestResult.value = traceLog.join('\n')
      } finally {
        testing.value = false
      }
    }

    const testDirectLogin = async () => {
      testing.value = true
      networkTestResult.value = 'Testing direct login with admin credentials...'

      try {
        console.log('[DebugPanel] Starting direct login test with admin credentials')

        // Test with real admin credentials
        const result = await authStore.loginDirect('admin', 'admin')

        if (result.success) {
          networkTestResult.value = 'Direct Login SUCCESS: Admin authentication completed using direct fetch!\nToken received and stored.'
        } else {
          networkTestResult.value = `Direct Login FAILED: ${result.error}`
        }

        console.log('[DebugPanel] Direct login test result:', result)

      } catch (error) {
        console.error('[DebugPanel] Direct login test error:', error)
        networkTestResult.value = `Direct Login ERROR: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testServerSimulation = async () => {
      testing.value = true
      networkTestResult.value = 'Testing server simulation mode...'

      try {
        console.log('[DebugPanel] Starting server simulation test')

        // Simulate server response with mock data
        const mockResponse = {
          status: 'success',
          code: 200,
          data: {
            api_token: 'mock_token_12345',
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            created_at: new Date().toISOString()
          }
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Store mock token
        await Preferences.set({
          key: 'auth_token',
          value: mockResponse.data.api_token
        })

        // Update auth store with mock data
        authStore.token = mockResponse.data.api_token
        authStore.user = mockResponse.data
        authStore.isAuthenticated = true

        networkTestResult.value = `Server Simulation Success:\nMode: Offline\nToken: ${mockResponse.data.api_token}\nUser: ${mockResponse.data.username}\nEmail: ${mockResponse.data.email}`

        console.log('[DebugPanel] Server simulation completed:', mockResponse)

      } catch (error) {
        console.error('[DebugPanel] Server simulation error:', error)
        networkTestResult.value = `Server Simulation Error: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testFormDataLogin = async () => {
      testing.value = true
      networkTestResult.value = 'Testing FormData login with admin credentials...'

      try {
        const result = await authStore.loginFormData('admin', 'admin')
        if (result.success) {
          networkTestResult.value = 'FormData Login SUCCESS: Admin authentication completed using form-data!'
        } else {
          networkTestResult.value = `FormData Login FAILED: ${result.error}`
        }
      } catch (error) {
        networkTestResult.value = `FormData Login ERROR: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testUrlEncodedLogin = async () => {
      testing.value = true
      networkTestResult.value = 'Testing URL-encoded login with admin credentials...'

      try {
        const result = await authStore.loginUrlEncoded('admin', 'admin')
        if (result.success) {
          networkTestResult.value = 'URL-encoded Login SUCCESS: Admin authentication completed using URL-encoded data!'
        } else {
          networkTestResult.value = `URL-encoded Login FAILED: ${result.error}`
        }
      } catch (error) {
        networkTestResult.value = `URL-encoded Login ERROR: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testXHRLogin = async () => {
      testing.value = true
      networkTestResult.value = 'Testing raw XHR login with admin credentials...'

      try {
        const result = await authStore.loginXHR('admin', 'admin')
        if (result.success) {
          networkTestResult.value = 'Raw XHR Login SUCCESS: Admin authentication completed using XMLHttpRequest!'
        } else {
          networkTestResult.value = `Raw XHR Login FAILED: ${result.error}`
        }
      } catch (error) {
        networkTestResult.value = `Raw XHR Login ERROR: ${error.message}`
      } finally {
        testing.value = false
      }
    }

    const testRawSocketDiagnostics = async () => {
      testing.value = true
      networkTestResult.value = 'Running raw socket diagnostics...'

      const diagnostics = []
      const startTime = Date.now()

      try {
        // Test 1: Basic HTTP/1.1 connection test
        diagnostics.push('=== RAW SOCKET DIAGNOSTICS ===')
        diagnostics.push(`Platform: ${Capacitor.getPlatform()}`)
        diagnostics.push(`User Agent: ${navigator.userAgent.substring(0, 80)}...`)
        diagnostics.push(`Online: ${navigator.onLine}`)
        diagnostics.push(`Connection: ${navigator.connection?.effectiveType || 'unknown'}`)

        // Test 2: WebSocket connection test (alternative protocol)
        diagnostics.push('\n=== WEBSOCKET TEST ===')
        try {
          const wsUrl = 'wss://echo.websocket.org'
          const ws = new WebSocket(wsUrl)

          const wsResult = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              ws.close()
              reject(new Error('WebSocket timeout'))
            }, 5000)

            ws.onopen = () => {
              clearTimeout(timeout)
              ws.close()
              resolve('✓ WebSocket: Connected')
            }

            ws.onerror = (error) => {
              clearTimeout(timeout)
              reject(new Error('WebSocket error'))
            }
          })

          diagnostics.push(wsResult)
        } catch (wsError) {
          diagnostics.push(`✗ WebSocket: ${wsError.message}`)
        }

        // Test 3: Alternative HTTP methods
        diagnostics.push('\n=== HTTP METHOD TESTS ===')
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']

        for (const method of methods) {
          try {
            const response = await fetch('https://httpbin.org/status/200', {
              method: method,
              mode: 'cors',
              cache: 'no-cache'
            })
            diagnostics.push(`✓ ${method}: ${response.status}`)
          } catch (error) {
            diagnostics.push(`✗ ${method}: ${error.message}`)
          }
        }

        // Test 4: Different Content-Type headers
        diagnostics.push('\n=== CONTENT-TYPE TESTS ===')
        const contentTypes = [
          'application/json',
          'application/x-www-form-urlencoded',
          'multipart/form-data',
          'text/plain',
          'application/xml'
        ]

        for (const contentType of contentTypes) {
          try {
            const response = await fetch('https://httpbin.org/post', {
              method: 'POST',
              headers: {
                'Content-Type': contentType
              },
              body: contentType === 'application/json' ? '{}' : 'test=data',
              mode: 'cors',
              cache: 'no-cache'
            })
            diagnostics.push(`✓ ${contentType}: ${response.status}`)
          } catch (error) {
            diagnostics.push(`✗ ${contentType}: ${error.message}`)
          }
        }

        // Test 5: Network timing analysis
        diagnostics.push('\n=== TIMING ANALYSIS ===')
        const timingTests = [
          { url: 'https://google.com', name: 'Google' },
          { url: 'https://newcore.nexeratech.co.id', name: 'Target Server' },
          { url: 'https://httpbin.org/delay/1', name: 'Slow Response' }
        ]

        for (const test of timingTests) {
          try {
            const testStart = Date.now()
            const response = await fetch(test.url, {
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-cache'
            })
            const duration = Date.now() - testStart
            diagnostics.push(`✓ ${test.name}: ${duration}ms`)
          } catch (error) {
            diagnostics.push(`✗ ${test.name}: ${error.message}`)
          }
        }

        // Test 6: TLS/SSL version tests
        diagnostics.push('\n=== TLS/SSL TESTS ===')
        const sslTests = [
          { url: 'https://tls-v1-2.badssl.com:1012', name: 'TLS 1.2' },
          { url: 'https://newcore.nexeratech.co.id', name: 'Target SSL' }
        ]

        for (const test of sslTests) {
          try {
            const response = await fetch(test.url, {
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-cache'
            })
            diagnostics.push(`✓ ${test.name}: Connected`)
          } catch (error) {
            diagnostics.push(`✗ ${test.name}: ${error.message}`)
          }
        }

        // Test 7: Platform-specific network stack info
        diagnostics.push('\n=== PLATFORM STACK ===')
        diagnostics.push(`Fetch Support: ${typeof fetch !== 'undefined'}`)
        diagnostics.push(`XHR Support: ${typeof XMLHttpRequest !== 'undefined'}`)
        diagnostics.push(`WebSocket Support: ${typeof WebSocket !== 'undefined'}`)
        diagnostics.push(`EventSource Support: ${typeof EventSource !== 'undefined'}`)

        if (Capacitor.isNativePlatform()) {
          diagnostics.push('Native Platform: Capacitor HTTP plugin available')
        } else {
          diagnostics.push('Web Platform: Browser network stack')
        }

        const totalTime = Date.now() - startTime
        diagnostics.push(`\nTotal Diagnostic Time: ${totalTime}ms`)

        networkTestResult.value = diagnostics.join('\n')

      } catch (error) {
        diagnostics.push(`\n=== DIAGNOSTIC ERROR ===${error.message}`)
        networkTestResult.value = diagnostics.join('\n')
      } finally {
        testing.value = false
      }
    }

    const testCapacitorHttp = async () => {
      testing.value = true
      networkTestResult.value = 'Testing Capacitor native HTTP with admin credentials...'

      try {
        const result = await authStore.loginCapacitorHttp('admin', 'admin')
        if (result.success) {
          networkTestResult.value = 'Capacitor HTTP Login SUCCESS: Admin authentication completed using native Capacitor HTTP!\nThis bypasses all web browser network restrictions.'
        } else {
          networkTestResult.value = `Capacitor HTTP Login FAILED: ${result.error}`
        }
      } catch (error) {
        networkTestResult.value = `Capacitor HTTP Login ERROR: ${error.message}`
      } finally {
        testing.value = false
      }
    }


</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
}

.debug-item {
  margin-bottom: 5px;
  word-break: break-all;
}

.debug-actions {
  margin-top: 10px;
}

.debug-actions button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
}

.debug-actions button:disabled {
  background: #6c757d;
}

.debug-result {
  margin-top: 10px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50px;
  cursor: pointer;
  z-index: 9998;
  font-size: 12px;
}
</style>