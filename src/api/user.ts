import http from './http'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email?: string
}

export interface User {
  id: string | number
  username: string
  email?: string
  avatar?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export function login(params: LoginParams) {
  return http.post<AuthResponse>('/user/login', params)
}

export const register = async (params: RegisterParams) => {
  const response = await http.post<AuthResponse>('/user/register', params)
  return response.data
}

export default {
  register,
}
