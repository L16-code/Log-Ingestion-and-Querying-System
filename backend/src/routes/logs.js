const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logController');
const { 
  logEntryValidation, 
  logSearchValidation, 
  validate 
} = require('../middleware/validation');

/**
 * @route   POST /api/logs
 * @desc    Create a new log entry
 * @access  Public
 */
router.post('/', logEntryValidation, validate, LogController.createLog);

/**
 * @route   GET /api/logs
 * @desc    Get logs with optional filtering
 * @access  Public
 */
router.get('/', logSearchValidation, validate, LogController.getLogs);

module.exports = router;
