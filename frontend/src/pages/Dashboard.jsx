import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import heroImg from '../assets/hero.png'
import { useAuth } from '../context/AuthContext'
import { getHealthRecords } from '../services/healthService'

const riskColors = {
  low: '#137333',
  medium: '#a15c00',
  high: '#b42318',
}

function Dashboard() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getHealthRecords(user.userId)
        setRecords(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user.userId])

  const stats = useMemo(() => {
    const riskCounts = records.reduce(
      (counts, record) => ({
        ...counts,
        [record.riskLevel]: (counts[record.riskLevel] || 0) + 1,
      }),
      { low: 0, medium: 0, high: 0 }
    )

    const distribution = ['low', 'medium', 'high'].map((risk) => ({
      name: risk,
      value: riskCounts[risk],
    }))

    return {
      totalRecords: records.length,
      highRiskCases: riskCounts.high,
      distribution,
    }
  }, [records])

  return (
    <main className="page">
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">Welcome</p>
          <h1>{user.name || 'User'}</h1>
          <p>Submit health readings, review records, and check alerts from your care flow.</p>
        </div>
        <img src={heroImg} alt="Health service illustration" />
      </section>

      <section className="action-grid" aria-label="Dashboard actions">
        <Link to="/submit-health">
          <strong>Submit Health Data</strong>
          <span>Send a new health reading for risk review.</span>
        </Link>
        <Link to="/records">
          <strong>Records</strong>
          <span>Review your submitted health history.</span>
        </Link>
        <Link to="/notifications">
          <strong>Notifications</strong>
          <span>Check risk alerts created for your account.</span>
        </Link>
      </section>

      <section className="stats-grid" aria-label="Health overview">
        <article>
          <span>Total Records</span>
          <strong>{stats.totalRecords}</strong>
        </article>
        <article>
          <span>High-Risk Cases</span>
          <strong>{stats.highRiskCases}</strong>
        </article>
        <article>
          <span>Current Role</span>
          <strong>user</strong>
        </article>
      </section>

      {loading && <p className="status">Loading dashboard data...</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <section className="charts-grid" aria-label="Risk charts">
          <article>
            <h2>Risk Distribution</h2>
            {stats.totalRecords === 0 ? (
              <p className="chart-empty">Submit health data to see your distribution.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={stats.distribution} dataKey="value" nameKey="name" outerRadius={90}>
                    {stats.distribution.map((entry) => (
                      <Cell key={entry.name} fill={riskColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </article>

          <article>
            <h2>Cases by Risk Level</h2>
            {stats.totalRecords === 0 ? (
              <p className="chart-empty">No records available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {stats.distribution.map((entry) => (
                      <Cell key={entry.name} fill={riskColors[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </article>
        </section>
      )}
    </main>
  )
}

export default Dashboard
