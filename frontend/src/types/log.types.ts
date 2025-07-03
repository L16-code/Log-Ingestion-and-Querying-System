export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogMetadata {
  [key: string]: any;
  parentResourceId?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: LogMetadata;
}

export interface LogFilters {
  level?: string;
  message?: string;
  resourceId?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
}

export interface LogQueryParams extends Omit<LogFilters, 'timestamp_start' | 'timestamp_end'> {
  timestamp_range?: [Date | null, Date | null];
}

export interface LogApiResponse {
  data: LogEntry[];
  total: number;
  page: number;
  limit: number;
}
