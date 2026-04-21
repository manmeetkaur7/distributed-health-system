const axios = require('axios');
const HealthRecord = require('../models/HealthRecord');

const normalizeServiceUrl = (value) => {
  if (!value) {
    return '';
  }

  return /^https?:\/\//i.test(value) ? value : `http://${value}`;
};

const AI_SERVICE_URL = normalizeServiceUrl(process.env.AI_SERVICE_URL || 'http://localhost:8000');
const NOTIFICATION_SERVICE_URL = normalizeServiceUrl(
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5003'
);

const createHealthRecord = async (req, res) => {
  try {
    const {
      userId,
      age,
      heartRate,
      bloodPressure,
      symptoms,
      heightCm,
      weightKg,
      oxygenLevel,
      bodyTemperature,
      bloodSugar,
      cholesterol,
      sleepHours,
      stressLevel,
      activityLevel,
      smokingStatus,
      alcoholUse,
    } = req.body;

    if (
      !userId ||
      age === undefined ||
      heartRate === undefined ||
      !bloodPressure ||
      sleepHours === undefined ||
      !stressLevel ||
      !activityLevel
    ) {
      return res.status(400).json({ message: 'All health data fields are required' });
    }

    const healthData = {
      userId,
      age,
      heartRate,
      bloodPressure,
      symptoms,
      heightCm,
      weightKg,
      oxygenLevel,
      bodyTemperature,
      bloodSugar,
      cholesterol,
      sleepHours,
      stressLevel,
      activityLevel,
      smokingStatus,
      alcoholUse,
    };

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict-risk`, healthData);
    const riskLevel = aiResponse.data.riskLevel;
    const {
      reasons = [],
      suggestions = [],
      aiRecommendations = [],
      possibleConcerns = [],
      recommendedTests = [],
    } = aiResponse.data;

    const healthRecord = await HealthRecord.create({
      ...healthData,
      riskLevel,
      reasons,
      suggestions,
      aiRecommendations,
      possibleConcerns,
      recommendedTests,
    });

    if (riskLevel === 'high') {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId,
        message: 'High health risk detected. Immediate attention recommended.',
        riskLevel,
      });
    }

    return res.status(201).json(healthRecord);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create health record',
      error: error.message,
    });
  }
};

const getHealthRecordsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await HealthRecord.find({ userId }).sort({ createdAt: -1 });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch health records',
      error: error.message,
    });
  }
};

module.exports = {
  createHealthRecord,
  getHealthRecordsByUser,
};
