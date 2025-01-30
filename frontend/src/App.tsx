import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Theme } from '@radix-ui/themes';
import AppRoutes from './AppRoutes.tsx';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Décommentez cette ligne

// const defaultAppearance = 'light';
// import(`./main.${defaultAppearance}.css`);

function RenderApp() {
  const { appearance } = useTheme();
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
