const Notification = require('../models/Notification');
const { sendHighRiskEmail } = require('../services/emailService');

const createNotification = async (req, res) => {
  try {
    const { userId, message, riskLevel } = req.body;

    if (!userId || !message || !riskLevel) {
      return res.status(400).json({ message: 'userId, message, and riskLevel are required' });
    }

    const notification = await Notification.create({
      userId,
      message,
      riskLevel,
    });

    let email = { skipped: true };

    if (riskLevel === 'high') {
      email = await sendHighRiskEmail({ userId, message, riskLevel });
    }

    return res.status(201).json({
      ...notification.toObject(),
      email,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
};
