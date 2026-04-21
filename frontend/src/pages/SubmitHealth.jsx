import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { submitHealthData } from '../services/healthService'

function SubmitHealth() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    age: '',
    heartRate: '',
    bloodPressure: '',
    symptoms: '',
    heightCm: '',
    weightKg: '',
    oxygenLevel: '',
    bodyTemperature: '',
    bloodSugar: '',
    cholesterol: '',
    sleepHours: '',
    stressLevel: 'low',
    activityLevel: 'medium',
    smokingStatus: 'never',
    alcoholUse: 'none',
  })
  const [riskLevel, setRiskLevel] = useState('')
  const [riskDetails, setRiskDetails] = useState(null)
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
    setRiskDetails(null)
    setLoading(true)

    try {
      const record = await submitHealthData({
        userId: user.userId,
        age: Number(formData.age),
        heartRate: Number(formData.heartRate),
        bloodPressure: formData.bloodPressure,
        symptoms: formData.symptoms,
        heightCm: Number(formData.heightCm),
        weightKg: Number(formData.weightKg),
        oxygenLevel: Number(formData.oxygenLevel),
        bodyTemperature: Number(formData.bodyTemperature),
        bloodSugar: Number(formData.bloodSugar),
        cholesterol: Number(formData.cholesterol),
        sleepHours: Number(formData.sleepHours),
        stressLevel: formData.stressLevel,
        activityLevel: formData.activityLevel,
        smokingStatus: formData.smokingStatus,
        alcoholUse: formData.alcoholUse,
      })
      setRiskLevel(record.riskLevel)
      setRiskDetails({
        reasons: record.reasons || [],
        aiRecommendations: record.aiRecommendations || record.suggestions || [],
        possibleConcerns: record.possibleConcerns || [],
        recommendedTests: record.recommendedTests || [],
      })
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
          Symptoms
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Headache, cough, dizziness, shortness of breath"
            rows="3"
          />
        </label>
        <label>
          Height (cm)
          <input
            name="heightCm"
            type="number"
            value={formData.heightCm}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Weight (kg)
          <input
            name="weightKg"
            type="number"
            value={formData.weightKg}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Oxygen Level (%)
          <input
            name="oxygenLevel"
            type="number"
            value={formData.oxygenLevel}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Body Temperature (F)
          <input
            name="bodyTemperature"
            type="number"
            step="0.1"
            value={formData.bodyTemperature}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Blood Sugar (mg/dL)
          <input
            name="bloodSugar"
            type="number"
            value={formData.bloodSugar}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cholesterol (mg/dL)
          <input
            name="cholesterol"
            type="number"
            value={formData.cholesterol}
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
        <label>
          Smoking Status
          <select name="smokingStatus" value={formData.smokingStatus} onChange={handleChange}>
            <option value="never">Never</option>
            <option value="former">Former</option>
            <option value="current">Current</option>
          </select>
        </label>
        <label>
          Alcohol Use
          <select name="alcoholUse" value={formData.alcoholUse} onChange={handleChange}>
            <option value="none">None</option>
            <option value="occasional">Occasional</option>
            <option value="frequent">Frequent</option>
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

      {riskDetails && (
        <section className="risk-details">
          <h2>Why This Risk Level?</h2>
          <DetailList title="Reasons" items={riskDetails.reasons} />
          <DetailList title="Possible Health Concerns" items={riskDetails.possibleConcerns} />
          <DetailList title="Suggested Blood Tests" items={riskDetails.recommendedTests} />
          <DetailList title="AI Recommendations" items={riskDetails.aiRecommendations} />
          <p className="medical-note">
            This is not a diagnosis. If a reading looks dangerous or you feel unwell, contact a
            medical professional.
          </p>
        </section>
      )}
    </main>
  )
}

function DetailList({ title, items }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default SubmitHealth
