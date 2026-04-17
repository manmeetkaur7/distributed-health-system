const axios = require('axios');
const HealthRecord = require('../models/HealthRecord');

const createHealthRecord = async (req, res) => {
  try {
    const {
      userId,
      age,
      heartRate,
      bloodPressure,
      sleepHours,
      stressLevel,
      activityLevel,
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
      sleepHours,
      stressLevel,
      activityLevel,
    };

    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict-risk`, healthData);
    const riskLevel = aiResponse.data.riskLevel;

    const healthRecord = await HealthRecord.create({
      ...healthData,
      riskLevel,
    });

    if (riskLevel === 'high') {
      await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`, {
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
