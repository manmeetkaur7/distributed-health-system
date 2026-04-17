const express = require('express');
const {
  createHealthRecord,
  getHealthRecordsByUser,
} = require('../controllers/healthController');

const router = express.Router();

router.post('/', createHealthRecord);
router.get('/:userId', getHealthRecordsByUser);

module.exports = router;
