import axios from 'axios'

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }

        const message = error.response?.data?.error || error.message || 'An error occurred'
        throw new Error(message)
      }
    )
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.client.defaults.headers.common['Authorization']
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.client.post('/auth/login', credentials)
  }

  async register(userData) {
    return this.client.post('/auth/register', userData)
  }

  async updatePassword(passwordData) {
    return this.client.put('/auth/password', passwordData)
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.client.get('/admin/dashboard')
  }

  async createUser(userData) {
    return this.client.post('/admin/users', userData)
  }

  async createStore(storeData) {
    return this.client.post('/admin/stores', storeData)
  }

  async getUsers(filters = {}) {
    return this.client.get('/admin/users', { params: filters })
  }

  async getStores(filters = {}) {
    return this.client.get('/admin/stores', { params: filters })
  }

  // User endpoints
  async getUserStores(filters = {}) {
    return this.client.get('/user/stores', { params: filters })
  }

  async submitRating(ratingData) {
    return this.client.post('/user/ratings', ratingData)
  }

  // Store Owner endpoints
  async getStoreOwnerDashboard() {
    return this.client.get('/store-owner/dashboard')
  }
}

export const apiService = new ApiService()