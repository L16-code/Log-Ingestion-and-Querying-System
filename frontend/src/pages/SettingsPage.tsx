import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, save to localStorage or API
    console.log('Saving settings:', settings);
    
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Display
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme"
            name="theme"
            value={settings.theme}
            label="Theme"
            onChange={handleSelectChange}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System Default</MenuItem>
          </Select>
        </FormControl>
        
        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={handleChange}
                name="notifications"
              />
            }
            label="Enable notifications"
          />
        </FormGroup>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Logs
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoRefresh}
                onChange={handleChange}
                name="autoRefresh"
              />
            }
            label="Auto-refresh logs"
          />
        </FormGroup>
        
        {settings.autoRefresh && (
          <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
            <TextField
              label="Refresh interval (seconds)"
              type="number"
              name="refreshInterval"
              value={settings.refreshInterval}
              onChange={handleChange}
              inputProps={{ min: 5, max: 300 }}
              disabled={!settings.autoRefresh}
            />
          </FormControl>
        )}
        
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
          <InputLabel id="timezone-select-label">Timezone</InputLabel>
          <Select
            labelId="timezone-select-label"
            id="timezone"
            name="timezone"
            value={settings.timezone}
            label="Timezone"
            onChange={handleSelectChange}
          >
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
              Local Timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </MenuItem>
            <MenuItem value="America/New_York">America/New_York</MenuItem>
            <MenuItem value="America/Chicago">America/Chicago</MenuItem>
            <MenuItem value="America/Denver">America/Denver</MenuItem>
            <MenuItem value="America/Los_Angeles">America/Los_Angeles</MenuItem>
            <MenuItem value="Europe/London">Europe/London</MenuItem>
            <MenuItem value="Europe/Paris">Europe/Paris</MenuItem>
            <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
          <InputLabel id="date-format-select-label">Date Format</InputLabel>
          <Select
            labelId="date-format-select-label"
            id="dateFormat"
            name="dateFormat"
            value={settings.dateFormat}
            label="Date Format"
            onChange={handleSelectChange}
          >
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2023-01-15)</MenuItem>
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (01/15/2023)</MenuItem>
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (15/01/2023)</MenuItem>
            <MenuItem value="MMM D, YYYY">MMM D, YYYY (Jan 15, 2023)</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="time-format-select-label">Time Format</InputLabel>
          <Select
            labelId="time-format-select-label"
            id="timeFormat"
            name="timeFormat"
            value={settings.timeFormat}
            label="Time Format"
            onChange={handleSelectChange}
          >
            <MenuItem value="24h">24-hour (14:30)</MenuItem>
            <MenuItem value="12h">12-hour (2:30 PM)</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { SettingsPage };
