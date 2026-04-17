import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getNotifications } from '../services/notificationService'

function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications(user.userId)
        setNotifications(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load notifications')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [user.userId])

  return (
    <main className="page">
      <h1>Notifications</h1>
      <p>Risk alerts created from your health submissions.</p>

      {loading && <p className="status">Loading notifications...</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && notifications.length === 0 && <p className="status">No notifications yet.</p>}

      <section className="list">
        {notifications.map((notification) => (
          <article className="list-item notification" key={notification._id}>
            <strong className={`risk risk-${notification.riskLevel}`}>
              {notification.riskLevel}
            </strong>
            <p>{notification.message}</p>
            <time>{new Date(notification.createdAt).toLocaleString()}</time>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Notifications
