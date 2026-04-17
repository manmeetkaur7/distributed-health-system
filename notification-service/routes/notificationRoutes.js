const express = require('express');
const {
  createNotification,
  getNotificationsByUser,
} = require('../controllers/notificationController');

const router = express.Router();

router.post('/', createNotification);
router.get('/:userId', getNotificationsByUser);

module.exports = router;
