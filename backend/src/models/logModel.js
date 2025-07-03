const fs = require('fs').promises;
const path = require('path');

const LOGS_FILE = path.join(__dirname, '../../logs/logs.json');

class LogModel {
  static async getAllLogs() {
    try {
      const data = await fs.readFile(LOGS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading logs file:', error);
      throw new Error('Failed to retrieve logs');
    }
  }

  static async addLog(newLog) {
    try {
      const logs = await this.getAllLogs();
      logs.push(newLog);
      await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
      return newLog;
    } catch (error) {
      console.error('Error adding log:', error);
      throw new Error('Failed to add log');
    }
  }

  static async searchLogs(filters = {}) {
    try {
      let logs = await this.getAllLogs();
      
      // Apply filters
      if (filters.level) {
        logs = logs.filter(log => 
          log.level.toLowerCase() === filters.level.toLowerCase()
        );
      }
      
      if (filters.message) {
        const searchTerm = filters.message.toLowerCase();
        logs = logs.filter(log => 
          log.message.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.resourceId) {
        logs = logs.filter(log => 
          log.resourceId.toLowerCase().includes(filters.resourceId.toLowerCase())
        );
      }
      
      if (filters.timestamp_start || filters.timestamp_end) {
        const startDate = filters.timestamp_start ? new Date(filters.timestamp_start) : new Date(0);
        const endDate = filters.timestamp_end ? new Date(filters.timestamp_end) : new Date();
        
        logs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= endDate;
        });
      }
      
      if (filters.traceId) {
        logs = logs.filter(log => 
          log.traceId.toLowerCase().includes(filters.traceId.toLowerCase())
        );
      }
      
      if (filters.spanId) {
        logs = logs.filter(log => 
          log.spanId.toLowerCase().includes(filters.spanId.toLowerCase())
        );
      }
      
      if (filters.commit) {
        logs = logs.filter(log => 
          log.commit.toLowerCase().includes(filters.commit.toLowerCase())
        );
      }
      
      // Sort by timestamp in descending order (newest first)
      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return logs;
    } catch (error) {
      console.error('Error searching logs:', error);
      throw new Error('Failed to search logs');
    }
  }
}

module.exports = LogModel;
