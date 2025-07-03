import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LogEntry, LogLevel } from '../types/log.types';
import LogLevelBadge from './LogLevelBadge';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface LogListProps {
  logs: LogEntry[];
  isLoading?: boolean;
  error: Error | null;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const LogList: React.FC<LogListProps> = ({
  logs,
  isLoading,
  error,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  if (isLoading && logs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading logs: {error.message}
      </Alert>
    );
  }

  if (logs.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="body1" color="textSecondary">
          No logs found. Try adjusting your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Resource ID</TableCell>
              <TableCell>Trace ID</TableCell>
              <TableCell>Span ID</TableCell>
              <TableCell>Commit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow
                key={`${log.traceId}-${log.spanId}-${index}`}
                hover
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'action.hover',
                  },
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell>
                  <LogLevelBadge level={log.level} />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true })}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {log.message}
                  </Typography>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <Box mt={1}>
                      <Typography variant="caption" color="textSecondary">
                        {JSON.stringify(log.metadata, null, 2)}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.resourceId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.traceId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.spanId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.commit.substring(0, 7)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => handleChangePage(e, newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default LogList;
