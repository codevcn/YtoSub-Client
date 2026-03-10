import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || ''
console.log('>>> API URL:', API_URL)

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30 * 60 * 1000 // 30 phút
})
