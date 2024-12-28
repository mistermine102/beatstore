import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const appApi = axios.create({
  baseURL: 'http://localhost:3000',
})

axios.interceptors.request.use(
  config => {
    //append token to every request
    if (authStore.token) {
      config.headers.Authorization = 'Bearer ' + authStore.token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default appApi
