import axios from 'axios'

const API_URL = 'http://localhost:5002/api/health'

export const submitHealthData = async (healthData) => {
  const response = await axios.post(API_URL, healthData)
  return response.data
}

export const getHealthRecords = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`)
  return response.data
}
