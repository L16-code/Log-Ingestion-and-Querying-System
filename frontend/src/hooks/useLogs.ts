import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logApi } from '../services/api';
import { LogEntry, LogFilters } from '../types/log.types';
import { QUERY_KEYS } from '../lib/react-query';

interface UseLogsOptions {
  initialFilters?: Partial<LogFilters>;
  pageSize?: number;
}

const useLogs = ({ initialFilters = {}, pageSize = 10 }: UseLogsOptions = {}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<Partial<LogFilters>>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Partial<LogFilters>>(filters);

  // Debounce filter changes to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      // Reset to first page when filters change
      setPage(0);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  // Define query keys
  const logsQueryKey = [
    QUERY_KEYS.LOGS, 
    { ...debouncedFilters, page, rowsPerPage }
  ] as const;
  
  const logsCountQueryKey = [
    QUERY_KEYS.LOGS, 
    'count', 
    debouncedFilters
  ] as const;

  // Fetch logs using React Query with proper typing
  const {
    data: paginatedLogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: logsQueryKey,
    queryFn: async ({ queryKey }) => {
      // Extract filters from query key
      const [, { page: currentPage, rowsPerPage: currentRowsPerPage, ...filters }] = queryKey as [
        string, 
        { page: number; rowsPerPage: number } & Partial<LogFilters>
      ];
      
      // In a real app, the API would support pagination
      // For now, we'll handle pagination client-side
      const allLogs = await logApi.getLogs(filters);
      
      // Client-side pagination
      const start = currentPage * currentRowsPerPage;
      const end = start + currentRowsPerPage;
      return allLogs.slice(start, end) as LogEntry[];
    },
    // Use placeholderData instead of keepPreviousData in React Query v5
    placeholderData: (previousData) => previousData ?? [],
    refetchOnWindowFocus: false,
  });

  // Get total count for pagination
  const { data: allLogs = [] } = useQuery({
    queryKey: logsCountQueryKey,
    queryFn: () => logApi.getLogs(debouncedFilters) as Promise<LogEntry[]>,
    refetchOnWindowFocus: false,
  });

  const logs = paginatedLogs as LogEntry[];
  const totalCount = (allLogs as LogEntry[]).length;

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Refresh logs
  const refreshLogs = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    logs,
    isLoading,
    error,
    page,
    rowsPerPage,
    totalCount,
    filters,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterChange,
    refreshLogs,
  };
};

export default useLogs;
