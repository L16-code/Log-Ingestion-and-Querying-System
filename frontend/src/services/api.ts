import axios, { AxiosError } from 'axios';
import { LogEntry, LogFilters } from '../types/log.types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Default to local development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors (e.g., 401 Unauthorized, 500 Server Error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // You can handle specific status codes here
      // if (error.response.status === 401) {
      //   // Handle unauthorized (e.g., redirect to login)
      //   window.location.href = '/login';
      // }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Log API functions
export const logApi = {
  // Get logs with optional filters
  getLogs: async (filters: Partial<LogFilters> = {}): Promise<LogEntry[]> => {
    // Convert date range to timestamp_start and timestamp_end
    const params = { ...filters } as Record<string, any>;
    
    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    
    const response = await api.get<LogEntry[]>('/logs', { params });
    return response.data;
  },
  
  // Ingest a new log entry
  createLog: async (logData: Omit<LogEntry, 'timestamp'>): Promise<LogEntry> => {
    const response = await api.post<LogEntry>('/logs', logData);
    return response.data;
  },
  
  // Check if the API is reachable
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
