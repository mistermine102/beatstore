import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const appApi = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://www.wavsmarket.com/api',
})

appApi.interceptors.request.use(
  config => {
    //attach access token to every request
    const authStore = useAuthStore()
    if (authStore.accessToken) config.headers.Authorization = 'Bearer ' + authStore.accessToken

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

appApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Only attempt refresh if we get ACCESS_TOKEN_EXPIRED message
    if (
      error.response?.status === 401 && 
      error.response?.data?.message === 'ACCESS_TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true // Prevent infinite loop of retrying
      
      try {
        const response = await appApi.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true })

        const authStore = useAuthStore()
        authStore.accessToken = response.data.accessToken

        originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`

        return appApi(originalRequest)
      } catch (error) {
        throw new Error('Failed to refresh token')
      }
    }
    return Promise.reject(error)
  }
)

export default appApi
