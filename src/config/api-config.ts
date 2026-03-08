import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // hoặc process.env.REACT_APP_API_URL
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20 * 60 * 1000 // 20 phút
})
