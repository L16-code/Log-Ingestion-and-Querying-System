const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;

// Import routes
const logRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure logs directory exists
const LOGS_DIR = path.join(__dirname, '../../logs');
const LOGS_FILE = path.join(LOGS_DIR, 'logs.json');

async function initializeLogsFile() {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    try {
      await fs.access(LOGS_FILE);
    } catch (err) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(LOGS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error initializing logs file:', err);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Initialize logs file and start server
async function startServer() {
  await initializeLogsFile();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Logs file: ${LOGS_FILE}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app; // For testing
