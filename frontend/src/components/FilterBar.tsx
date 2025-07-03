import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  Paper, 
  Collapse, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LogFilters } from '../types/log.types';

interface FilterBarProps {
  onFilterChange: (filters: Partial<LogFilters>) => void;
  isLoading?: boolean;
  initialFilters?: Partial<LogFilters>;
}

const LogLevels = [
  { value: 'error', label: 'Error' },
  { value: 'warn', label: 'Warning' },
  { value: 'info', label: 'Info' },
  { value: 'debug', label: 'Debug' },
];

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  isLoading = false,
  initialFilters = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<Partial<LogFilters>>({
    level: initialFilters.level || '',
    message: initialFilters.message || '',
    resourceId: initialFilters.resourceId || '',
    traceId: initialFilters.traceId || '',
    spanId: initialFilters.spanId || '',
    commit: initialFilters.commit || '',
    timestamp_start: initialFilters.timestamp_start,
    timestamp_end: initialFilters.timestamp_end,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDateChange = (name: 'timestamp_start' | 'timestamp_end', date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: date ? date.toISOString() : undefined,
    }));
  };

  const applyFilters = useCallback(() => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {} as Partial<LogFilters>);
    onFilterChange(cleanFilters);
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    const resetFilters = {
      level: '',
      message: '',
      resourceId: '',
      traceId: '',
      spanId: '',
      commit: '',
      timestamp_start: undefined,
      timestamp_end: undefined,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  const debouncedApplyFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedApplyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, debouncedApplyFilters]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Search Messages"
            name="message"
            value={filters.message || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <TextField
            select
            fullWidth
            label="Log Level"
            name="level"
            value={filters.level || ''}
            onChange={handleInputChange}
            size="small"
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="">All Levels</MenuItem>
            {LogLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Resource ID"
            name="resourceId"
            value={filters.resourceId || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<FilterListIcon />}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
            fullWidth={isMobile}
          >
            {showAdvanced ? 'Hide Filters' : 'More Filters'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            size="small"
            disabled={isLoading}
            fullWidth={isMobile}
          >
            Clear
          </Button>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Advanced Filters
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={filters.timestamp_start ? new Date(filters.timestamp_start) : null}
                      onChange={(date: Date | null) => handleDateChange('timestamp_start', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={filters.timestamp_end ? new Date(filters.timestamp_end) : null}
                      onChange={(date: Date | null) => handleDateChange('timestamp_end', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Trace ID"
                    name="traceId"
                    value={filters.traceId || ''}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    size="small"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Span ID"
                    name="spanId"
                    value={filters.spanId || ''}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    size="small"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Commit Hash"
                    name="commit"
                    value={filters.commit || ''}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    size="small"
                  />
                </Box>
              </Stack>
            </Box>
          </Collapse>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FilterBar;
