const { body, query, validationResult } = require('express-validator');

// Common validation for log entries
const logEntryValidation = [
  body('level')
    .isString().withMessage('Level must be a string')
    .isIn(['error', 'warn', 'info', 'debug']).withMessage('Invalid log level'),
  
  body('message')
    .isString().withMessage('Message must be a string')
    .notEmpty().withMessage('Message is required'),
    
  body('resourceId')
    .isString().withMessage('Resource ID must be a string')
    .notEmpty().withMessage('Resource ID is required'),
    
  body('timestamp')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Timestamp must be a valid ISO 8601 date string'),
    
  body('traceId')
    .isString().withMessage('Trace ID must be a string')
    .notEmpty().withMessage('Trace ID is required'),
    
  body('spanId')
    .isString().withMessage('Span ID must be a string')
    .notEmpty().withMessage('Span ID is required'),
    
  body('commit')
    .isString().withMessage('Commit hash must be a string')
    .notEmpty().withMessage('Commit hash is required'),
    
  body('metadata')
    .optional()
    .isObject().withMessage('Metadata must be an object')
];

// Query parameter validation for log search
const logSearchValidation = [
  query('level')
    .optional()
    .isIn(['error', 'warn', 'info', 'debug']).withMessage('Invalid log level'),
    
  query('message')
    .optional()
    .isString().withMessage('Search term must be a string'),
    
  query('resourceId')
    .optional()
    .isString().withMessage('Resource ID must be a string'),
    
  query('timestamp_start')
    .optional()
    .isISO8601().withMessage('Start timestamp must be a valid ISO 8601 date string'),
    
  query('timestamp_end')
    .optional()
    .isISO8601().withMessage('End timestamp must be a valid ISO 8601 date string'),
    
  query('traceId')
    .optional()
    .isString().withMessage('Trace ID must be a string'),
    
  query('spanId')
    .optional()
    .isString().withMessage('Span ID must be a string'),
    
  query('commit')
    .optional()
    .isString().withMessage('Commit hash must be a string')
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  logEntryValidation,
  logSearchValidation,
  validate
};
