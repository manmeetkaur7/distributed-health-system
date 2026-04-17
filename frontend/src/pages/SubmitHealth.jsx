import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { submitHealthData } from '../services/healthService'

function SubmitHealth() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    age: '',
    heartRate: '',
    bloodPressure: '',
    sleepHours: '',
    stressLevel: 'low',
    activityLevel: 'medium',
  })
  const [riskLevel, setRiskLevel] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setRiskLevel('')
    setLoading(true)

    try {
      const record = await submitHealthData({
        userId: user.userId,
        age: Number(formData.age),
        heartRate: Number(formData.heartRate),
        bloodPressure: formData.bloodPressure,
        sleepHours: Number(formData.sleepHours),
        stressLevel: formData.stressLevel,
        activityLevel: formData.activityLevel,
      })
      setRiskLevel(record.riskLevel)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit health data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page narrow">
      <h1>Submit Health Data</h1>
      <p>Enter your latest reading to receive a risk result.</p>

      <form className="data-form" onSubmit={handleSubmit}>
        <label>
          Age
          <input name="age" type="number" value={formData.age} onChange={handleChange} required />
        </label>
        <label>
          Heart Rate
          <input
            name="heartRate"
            type="number"
            value={formData.heartRate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Blood Pressure
          <input
            name="bloodPressure"
            placeholder="120/80"
            value={formData.bloodPressure}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Sleep Hours
          <input
            name="sleepHours"
            type="number"
            step="0.1"
            value={formData.sleepHours}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Stress Level
          <select name="stressLevel" value={formData.stressLevel} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Activity Level
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {riskLevel && (
        <section className={`result result-${riskLevel}`}>
          <p>Risk level</p>
          <strong className={`risk risk-${riskLevel}`}>{riskLevel}</strong>
        </section>
      )}
    </main>
  )
}

export default SubmitHealth
