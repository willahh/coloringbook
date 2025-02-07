import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { appStore } from './store';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Theme } from '@radix-ui/themes';
import AppRoutes from './AppRoutes.tsx';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

console.log('#0 App.tsx')
const defaultAppearance = localStorage.getItem('theme') || 'dark';
import(`./main.${defaultAppearance}.css`);

function RenderApp() {
  console.log('#0 RenderApp')
  const { appearance } = useTheme();
  return (
    // <StrictMode>
      <Provider store={appStore}>
        <Theme appearance={appearance} hasBackground={false}>
          <BrowserRouter>
            <Tooltip.Provider delayDuration={0}>
              <AppRoutes />
            </Tooltip.Provider>
          </BrowserRouter>
        </Theme>
      </Provider>
    // </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RenderApp />
  </ThemeProvider>
);
