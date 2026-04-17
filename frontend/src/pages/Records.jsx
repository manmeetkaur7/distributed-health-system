import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getHealthRecords } from '../services/healthService'

function Records() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await getHealthRecords(user.userId)
        setRecords(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load health records')
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [user.userId])

  return (
    <main className="page">
      <h1>Health Records</h1>
      <p>Your submitted readings and risk levels.</p>

      {loading && <p className="status">Loading records...</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && records.length === 0 && <p className="status">No records yet.</p>}

      <section className="list">
        {records.map((record) => (
          <article className="list-item" key={record._id}>
            <div>
              <strong className={`risk risk-${record.riskLevel}`}>{record.riskLevel}</strong>
              <p>{new Date(record.createdAt).toLocaleString()}</p>
            </div>
            <dl>
              <div>
                <dt>Age</dt>
                <dd>{record.age}</dd>
              </div>
              <div>
                <dt>Heart Rate</dt>
                <dd>{record.heartRate}</dd>
              </div>
              <div>
                <dt>Blood Pressure</dt>
                <dd>{record.bloodPressure}</dd>
              </div>
              <div>
                <dt>Sleep</dt>
                <dd>{record.sleepHours} hours</dd>
              </div>
              <div>
                <dt>Stress</dt>
                <dd>{record.stressLevel}</dd>
              </div>
              <div>
                <dt>Activity</dt>
                <dd>{record.activityLevel}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Records
