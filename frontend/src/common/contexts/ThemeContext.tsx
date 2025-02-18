import React, { createContext, useContext, useState } from 'react';
import DynamicCSSLoader from '@components/DynamicCSSLoader';

export type Appearance = 'dark' | 'light';
type ThemeContextType = {
  appearance: Appearance;
  switchAppearance: (appearance: Appearance) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const switchTheme = (newAppearance: Appearance) => {
    setAppearance(newAppearance);
    localStorage.setItem('theme', newAppearance);
  };
  

  return (
    <ThemeContext.Provider
      value={{ appearance, switchAppearance: switchTheme }}
    >
      <DynamicCSSLoader theme={appearance} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
