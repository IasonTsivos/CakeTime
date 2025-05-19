import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your themes
const THEMES = {
  pink: {
    name: 'pink',
    primary: '#ff8eec',
    shadow: '#ff6bb0',
    animation: require('../assets/animations/bg-animation.json'),
  },
  green: {
    name: 'green',
    primary: '#51ff63',
    shadow: '#32cc4c',
    animation: require('../assets/animations/newbg.json'),
  },
    blue: {
        name: 'blue',
        primary: '#51daff',
        shadow: '#007aff',
        animation: require('../assets/animations/newbg.json'),
    },
};

type ThemeKey = keyof typeof THEMES;

interface Theme {
  name: string;
  primary: string;
  shadow: string;
  animation: any;
}

interface ThemeContextType {
  theme: Theme;
  setThemeByKey: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(THEMES.pink); // default

  useEffect(() => {
    (async () => {
      const stored = (await AsyncStorage.getItem('themeKey')) as ThemeKey;
      if (stored && THEMES[stored]) {
        setTheme(THEMES[stored]);
      }
    })();
  }, []);

  const setThemeByKey = (key: ThemeKey) => {
    const selectedTheme = THEMES[key];
    setTheme(selectedTheme);
    AsyncStorage.setItem('themeKey', key);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeByKey }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for usage
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
