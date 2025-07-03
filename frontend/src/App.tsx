import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { theme } from './theme';
import { queryClient } from './lib/react-query';

// Configure notistack default options
const NOTISTACK_PROPS = {
  maxSnack: 5,
  autoHideDuration: 5000,
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'right' as const,
  },
  preventDuplicate: true,
};

// Extend the theme type to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    // Add any custom theme options here
  }
}

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <SnackbarProvider {...NOTISTACK_PROPS}>
                <Router>
                  <Layout>
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Box>
                  </Layout>
                </Router>
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}

export default App;
