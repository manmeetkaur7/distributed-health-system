const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    type: String,
    required: true,
  },
  sleepHours: {
    type: Number,
    required: true,
  },
  stressLevel: {
    type: String,
    required: true,
  },
  activityLevel: {
    type: String,
    required: true,
  },
  riskLevel: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
