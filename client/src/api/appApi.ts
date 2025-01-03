import axios from 'axios'

const appApi = axios.create({
  baseURL: 'http://localhost:3000',
})

appApi.interceptors.request.use(
  config => {
    //append token to every request
    const token = localStorage.getItem('token')
    
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
