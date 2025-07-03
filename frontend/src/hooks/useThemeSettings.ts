import { useState, useEffect, useCallback } from 'react';
import { PaletteMode } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';
import { theme as baseTheme } from '../theme';

type ThemeMode = PaletteMode | 'system';

export const useThemeSettings = () => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [resolvedMode, setResolvedMode] = useState<PaletteMode>('light');
  const [theme, setTheme] = useState<Theme>(baseTheme);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    const initialMode = savedMode || 'system';
    setMode(initialMode);
    
    // Apply system preference if mode is 'system'
    if (initialMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedMode(initialMode as PaletteMode);
    }
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    const newTheme = createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode: resolvedMode,
        background: {
          ...baseTheme.palette.background,
          default: resolvedMode === 'dark' ? '#121212' : '#f5f5f5',
          paper: resolvedMode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
        text: {
          ...baseTheme.palette.text,
          primary: resolvedMode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
          secondary: resolvedMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
      },
    });
    setTheme(newTheme);
  }, [resolvedMode]);

  // Toggle between light/dark mode
  const toggleColorMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    if (newMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedMode(newMode as PaletteMode);
    }
  }, []);

  return {
    theme,
    mode,
    resolvedMode,
    toggleColorMode,
    isDarkMode: resolvedMode === 'dark',
  };
};
