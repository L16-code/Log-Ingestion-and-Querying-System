import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Collapse,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Stack,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LogLevel } from '../types/log.types';
import { logApi } from '../services/api';

interface LogIngestFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

const LogLevels: { value: LogLevel; label: string }[] = [
  { value: 'error', label: 'Error' },
  { value: 'warn', label: 'Warning' },
  { value: 'info', label: 'Info' },
  { value: 'debug', label: 'Debug' },
];

const LogIngestForm: React.FC<LogIngestFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    level: 'info' as LogLevel,
    message: '',
    resourceId: '',
    timestamp: new Date(),
    traceId: `trace-${Math.random().toString(36).substr(2, 9)}`,
    spanId: `span-${Math.random().toString(36).substr(2, 5)}`,
    commit: Math.random().toString(16).substr(2, 7),
    metadata: '{\n  "parentResourceId": ""\n}',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      metadata: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Parse metadata JSON
      let metadata = {};
      try {
        metadata = JSON.parse(formData.metadata);
      } catch (err) {
        throw new Error('Invalid JSON in metadata');
      }

      // Prepare log data
      const logData = {
        level: formData.level,
        message: formData.message,
        resourceId: formData.resourceId,
        timestamp: formData.timestamp.toISOString(),
        traceId: formData.traceId,
        spanId: formData.spanId,
        commit: formData.commit,
        metadata,
      };

      // Submit to API
      await logApi.createLog(logData);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error ingesting log:', err);
      setError(err instanceof Error ? err.message : 'Failed to ingest log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomId = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 5)}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ingest New Log</Typography>
        <IconButton onClick={onCancel} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth required disabled={isSubmitting}>
              <InputLabel id="log-level-label">Log Level</InputLabel>
              <Select
                labelId="log-level-label"
                name="level"
                value={formData.level}
                label="Log Level"
                onChange={handleChange}
              >
                {LogLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Resource ID"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., server-1234"
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              multiline
              rows={3}
              disabled={isSubmitting}
              placeholder="Enter log message..."
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Button
              type="button"
              variant="text"
              size="small"
              onClick={() => setShowAdvanced(!showAdvanced)}
              startIcon={<AddIcon />}
              sx={{ mb: 1 }}
            >
              {showAdvanced ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
            </Button>
            <Collapse in={showAdvanced}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ width: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Timestamp"
                        value={formData.timestamp}
                        onChange={(date) => {
                          if (date) {
                            setFormData(prev => ({
                              ...prev,
                              timestamp: date,
                            }));
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            disabled: isSubmitting,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Trace ID"
                      name="traceId"
                      value={formData.traceId}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          traceId: generateRandomId('trace'),
                        }));
                      }}
                      disabled={isSubmitting}
                    >
                      New
                    </Button>
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Span ID"
                      name="spanId"
                      value={formData.spanId}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          spanId: generateRandomId('span'),
                        }));
                      }}
                      disabled={isSubmitting}
                    >
                      New
                    </Button>
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Commit Hash"
                      name="commit"
                      value={formData.commit}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          commit: Math.random().toString(16).substr(2, 7),
                        }));
                      }}
                      disabled={isSubmitting}
                    >
                      New
                    </Button>
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Metadata (JSON)"
                      name="metadata"
                      value={formData.metadata}
                      onChange={handleMetadataChange}
                      multiline
                      rows={4}
                      disabled={isSubmitting}
                      helperText='Enter valid JSON metadata (e.g., {"key": "value"})'
                    />
                  </Box>
                </Stack>
              </Paper>
            </Collapse>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !formData.message || !formData.resourceId}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit Log'
              )}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default LogIngestForm;
