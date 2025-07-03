const { validationResult } = require('express-validator');
const LogModel = require('../models/logModel');

class LogController {
  static async createLog(req, res) {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const logData = req.body;
      
      // Add timestamp if not provided
      if (!logData.timestamp) {
        logData.timestamp = new Date().toISOString();
      }

      // Ensure metadata is an object
      if (!logData.metadata || typeof logData.metadata !== 'object') {
        logData.metadata = {};
      }

      // Save the log
      const newLog = await LogModel.addLog(logData);
      
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error in createLog:', error);
      res.status(500).json({ 
        error: 'Failed to create log',
        message: error.message 
      });
    }
  }

  static async getLogs(req, res) {
    try {
      // Extract query parameters
      const filters = {
        level: req.query.level,
        message: req.query.message,
        resourceId: req.query.resourceId,
        timestamp_start: req.query.timestamp_start,
        timestamp_end: req.query.timestamp_end,
        traceId: req.query.traceId,
        spanId: req.query.spanId,
        commit: req.query.commit
      };

      // Get filtered logs
      const logs = await LogModel.searchLogs(filters);
      
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error in getLogs:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve logs',
        message: error.message 
      });
    }
  }
}

module.exports = LogController;
