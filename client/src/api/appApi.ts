import axios from 'axios'

const appApi = axios.create({
  baseURL: 'http://localhost:3000',
})

const token = localStorage.getItem('token')

axios.interceptors.request.use(
  config => {
    //append token to every request
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default appApi
