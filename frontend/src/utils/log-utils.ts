import { LogLevel, LogEntry } from '../types/log.types';

export const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];

export const LOG_LEVEL_LABELS: Record<LogLevel, string> = {
  error: 'Error',
  warn: 'Warning',
  info: 'Info',
  debug: 'Debug',
  trace: 'Trace',
};

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  error: '#f44336',    // Red
  warn: '#ff9800',     // Orange
  info: '#2196f3',     // Blue
  debug: '#4caf50',    // Green
  trace: '#9e9e9e',    // Grey
};

export const LOG_LEVEL_ICONS: Record<LogLevel, string> = {
  error: 'error',
  warn: 'warning',
  info: 'info',
  debug: 'bug_report',
  trace: 'track_changes',
};

export const getLogLevelLabel = (level: LogLevel): string => {
  return LOG_LEVEL_LABELS[level] || level;
};

export const getLogLevelColor = (level: LogLevel): string => {
  return LOG_LEVEL_COLORS[level] || '#757575';
};

export const getLogLevelIcon = (level: LogLevel): string => {
  return LOG_LEVEL_ICONS[level] || 'help';
};

export const compareLogLevels = (a: LogLevel, b: LogLevel): number => {
  const levels = ['trace', 'debug', 'info', 'warn', 'error'];
  return levels.indexOf(a) - levels.indexOf(b);
};

export const getFilteredLogsByLevel = (
  logs: LogEntry[],
  selectedLevels: LogLevel[]
): LogEntry[] => {
  if (selectedLevels.length === 0 || selectedLevels.length === LOG_LEVELS.length) {
    return logs;
  }
  
  return logs.filter(log => selectedLevels.includes(log.level));
};
