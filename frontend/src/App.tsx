import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ThemeProvider, useTheme } from './common/contexts/ThemeContext';
import { appStore } from './common/store';
import AppRoutes from './AppRoutes.tsx';
import RouteTracker from './RouteTracker';
import { ENV_PROD } from './common/utils/EnvUtils.ts';
import { ServiceProvider } from './common/contexts/ServiceContext';
import { services } from './services/services.ts';

const defaultAppearance = localStorage.getItem('theme') || 'dark';
import(`./common/styles/main.${defaultAppearance}.css`);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

function RenderApp() {
  const { appearance } = useTheme();
  return (
    <StrictMode>
      <Provider store={appStore}>
        <Theme appearance={appearance} hasBackground={false}>
          <BrowserRouter>
            {ENV_PROD && <RouteTracker />}
            <Tooltip.Provider delayDuration={0}>
              <AppRoutes />
            </Tooltip.Provider>
          </BrowserRouter>
        </Theme>
      </Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ServiceProvider services={services}>
      <RenderApp />
    </ServiceProvider>
  </ThemeProvider>
);
