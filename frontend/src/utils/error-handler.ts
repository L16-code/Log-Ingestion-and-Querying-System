import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred'): void => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ErrorResponse | undefined;
    const message = response?.message || error.message || defaultMessage;
    
    // Show error message
    enqueueSnackbar(message, { variant: 'error' });
    
    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    }
    
    // Handle validation errors
    if (response?.errors) {
      Object.entries(response.errors).forEach(([field, messages]) => {
        messages.forEach((msg) => {
          enqueueSnackbar(`${field}: ${msg}`, { variant: 'error' });
        });
      });
    }
  } else if (error instanceof Error) {
    enqueueSnackbar(error.message || defaultMessage, { variant: 'error' });
  } else {
    enqueueSnackbar(defaultMessage, { variant: 'error' });
  }
};

export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ErrorResponse | undefined;
    return response?.message || error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  return defaultMessage;
};
