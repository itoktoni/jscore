import axios from 'axios'
import { Capacitor } from '@capacitor/core'

class Http {
  constructor() {
    // Use environment variable if available, otherwise fallback to default
    const apiUrl = import.meta.env.VITE_API_URL || 'https://newcore.nexeratech.co.id';

    this.baseURL = Capacitor.isNativePlatform()
      ? `${apiUrl}/api`
      : (import.meta.env.DEV ? '/api' : `${apiUrl}/api`)

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  setAuthToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization']
  }

  async get(url, config = {}) {
    return this.api.get(url, config)
  }

  async post(url, data = {}, config = {}) {
    return this.api.post(url, data, config)
  }

  async put(url, data = {}, config = {}) {
    return this.api.put(url, data, config)
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config)
  }
}

export const http = new Http()
export default http