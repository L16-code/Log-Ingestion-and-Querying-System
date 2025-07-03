import { useState, useEffect, useCallback } from 'react';

interface AppSettings {
  refreshInterval: number;
  timeZone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  itemsPerPage: number;
  autoRefresh: boolean;
  logLevels: string[];
}

const DEFAULT_SETTINGS: AppSettings = {
  refreshInterval: 30, // seconds
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'yyyy-MM-dd',
  timeFormat: '24h',
  itemsPerPage: 25,
  autoRefresh: true,
  logLevels: ['error', 'warn', 'info'],
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with defaults to ensure all settings exist
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Reset to defaults if there's an error
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage when they change
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };
      
      try {
        localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      
      return updatedSettings;
    });
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('appSettings');
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }, []);

  // Get a specific setting
  const getSetting = useCallback(<K extends keyof AppSettings>(
    key: K
  ): AppSettings[K] => {
    return settings[key];
  }, [settings]);

  // Update a specific setting
  const setSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    getSetting,
    setSetting,
  };
};

// Export the default settings for reference
export { DEFAULT_SETTINGS };
// Export the settings type
export type { AppSettings };
