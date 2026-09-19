import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

export interface ApiErrorBody {
  code?: string
  message?: string
  msg?: string
  details?: unknown
}

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
    console.error('接口错误：', getErrorMessage(err))
    return Promise.reject(err)
  },
)

export function getErrorMessage(error: unknown, fallback = '请求失败') {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || error.response?.data?.msg || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}

export const request = <T>(config: AxiosRequestConfig) => http.request<T>(config)

export default http
