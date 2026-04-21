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
  symptoms: {
    type: String,
  },
  heightCm: {
    type: Number,
  },
  weightKg: {
    type: Number,
  },
  oxygenLevel: {
    type: Number,
  },
  bodyTemperature: {
    type: Number,
  },
  bloodSugar: {
    type: Number,
  },
  cholesterol: {
    type: Number,
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
  smokingStatus: {
    type: String,
  },
  alcoholUse: {
    type: String,
  },
  riskLevel: {
    type: String,
    required: true,
  },
  reasons: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  aiRecommendations: {
    type: [String],
    default: [],
  },
  possibleConcerns: {
    type: [String],
    default: [],
  },
  recommendedTests: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
