import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => {
    // 直接返回后端data，组件不用每次取res.data
    return res.data
  },
  (err) => {
    // 错误统一处理
    const msg = err.response?.data?.msg || '请求失败'
    console.error('接口错误：', msg)
    return Promise.reject(err)
  },
)

export const request = <T>(config: AxiosRequestConfig) => http.request<T>(config)

export default http
