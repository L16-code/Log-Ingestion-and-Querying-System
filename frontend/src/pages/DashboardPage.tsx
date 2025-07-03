import React, { useState, useCallback } from 'react';
import { Box, Container, Typography, Button, Paper, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import FilterBar from '../components/FilterBar';
import LogList from '../components/LogList';
import LogIngestForm from '../components/LogIngestForm';
import useLogs from '../hooks/useLogs';
import { LogEntry } from '../types/log.types';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const [showIngestForm, setShowIngestForm] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const {
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
  } = useLogs({
    pageSize: 10,
  });

  const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  const handleIngestNewLog = useCallback(async (newLog: Omit<LogEntry, 'timestamp'>) => {
    try {
      // Refresh the logs after successful ingestion
      await refreshLogs();
      setShowIngestForm(false);
      showNotification('Log ingested successfully!', 'success');
    } catch (err) {
      console.error('Error ingesting log:', err);
      showNotification('Failed to ingest log', 'error');
    }
  }, [refreshLogs, showNotification]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Log Viewer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshLogs}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowIngestForm(!showIngestForm)}
          >
            {showIngestForm ? 'Cancel' : 'Add Log'}
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        initialFilters={filters}
      />

      {/* Log List */}
      <Box sx={{ mt: 3 }}>
        <LogList
          logs={logs}
          isLoading={isLoading}
          error={error}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      {/* Ingest Form */}
      {showIngestForm && (
        <LogIngestForm
          onSuccess={() => handleIngestNewLog({} as Omit<LogEntry, 'timestamp'>)}
          onCancel={() => setShowIngestForm(false)}
        />
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export { DashboardPage };
