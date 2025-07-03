import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const QUERY_KEYS = {
  LOGS: 'logs',
  LOG: 'log',
  HEALTH: 'health',
} as const;
