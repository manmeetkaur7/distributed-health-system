import axios from 'axios'

const API_URL =
  import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:5003/api/notifications'

export const getNotifications = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`)
  return response.data
}
