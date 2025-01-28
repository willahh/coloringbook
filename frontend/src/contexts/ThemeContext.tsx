import React, { createContext, useContext, useEffect, useState } from 'react';

type Appearance = 'dark' | 'light';
type ThemeContextType = {
  appearance: Appearance;
  switchAppearance: (appearance: Appearance) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    console.log('#5 useState');
    const savedTheme = localStorage.getItem('theme');
    console.log('#5 savedTheme from localStorage: ', savedTheme);
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const switchTheme = (newAppearance: Appearance) => {
    console.log('#5 switchTheme', newAppearance);
    setAppearance(newAppearance);
    localStorage.setItem('theme', newAppearance);
  };

  useEffect(() => {
    console.log('#5 useEffect')
    // Vous pouvez ajouter ici le chargement dynamique du CSS si nécessaire
    console.log('#5 import css : ', `@/main.${appearance}.css`);
    import(`@/main.${appearance}.css`);
  }, [appearance]);

  return (
    <ThemeContext.Provider
      value={{ appearance, switchAppearance: switchTheme }}
    >
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
