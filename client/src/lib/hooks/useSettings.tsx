import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  soundEnabled: boolean;
  caretStyle: string;
  showKeyboard: boolean;
  showLiveWpm: boolean;
  smoothCaret: boolean;
  theme: string;
  fontFamily: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Default settings
const defaultSettings: Settings = {
  soundEnabled: true,
  caretStyle: 'line',
  showKeyboard: false,
  showLiveWpm: true,
  smoothCaret: true,
  theme: 'default',
  fontFamily: 'Roboto Mono',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('typeMasterSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('typeMasterSettings', JSON.stringify(settings));
    
    // Apply font family to the document
    document.documentElement.style.setProperty('--font-mono', settings.fontFamily);
    
    // Apply other settings that affect CSS
    if (settings.caretStyle) {
      document.documentElement.dataset.caretStyle = settings.caretStyle;
    }
    
    if (settings.smoothCaret) {
      document.body.classList.add('smooth-caret');
    } else {
      document.body.classList.remove('smooth-caret');
    }
    
    // Apply theme setting
    document.documentElement.dataset.theme = settings.theme;
    
  }, [settings]);
  
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
}