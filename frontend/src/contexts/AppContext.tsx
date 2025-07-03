import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeSettings, ThemeMode } from '../hooks/useThemeSettings';
import { useSettings, AppSettings } from '../hooks/useSettings';

type AppContextType = {
  // Theme
  theme: any; // Theme type from MUI
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: (mode: ThemeMode) => void;
  
  // Settings
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K];
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme settings
  const {
    theme,
    mode: themeMode,
    resolvedMode,
    isDarkMode,
    toggleColorMode: toggleTheme,
  } = useThemeSettings();

  // App settings
  const {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    getSetting,
    setSetting,
  } = useSettings();

  return (
    <AppContext.Provider
      value={{
        // Theme
        theme,
        themeMode,
        isDarkMode,
        toggleTheme,
        
        // Settings
        settings,
        isLoading,
        updateSettings,
        resetSettings,
        getSetting,
        setSetting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Re-export types for convenience
export type { AppSettings, ThemeMode };
