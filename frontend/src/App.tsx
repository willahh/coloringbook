import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Theme } from '@radix-ui/themes';
import AppRoutes from '@/AppRoutes';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Décommentez cette ligne


const defaultAppearance = 'dark';
import(`@/main.${defaultAppearance}.css`);
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function RenderApp() {
  console.log('#5 RenderApp')
  const { appearance, switchAppearance } = useTheme();
  // const { appearance, switchAppearance } = useTheme();
  console.log('#5 appearance', appearance)

  // // // Utiliser useEffect pour gérer les effets secondaires comme le changement de thème
  // React.useEffect(() => {
  //   switchAppearance('dark');
  // }, [switchAppearance]);

  return (
    <StrictMode>
      <Theme appearance={appearance} hasBackground={false}>
        <BrowserRouter>
          <Tooltip.Provider delayDuration={0}>
            <AppRoutes />
          </Tooltip.Provider>
        </BrowserRouter>
      </Theme>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RenderApp />
  </ThemeProvider>
);
