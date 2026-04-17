import axios from 'axios'

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:5001/api/auth'

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  return response.data
}

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
