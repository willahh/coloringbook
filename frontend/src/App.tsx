import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/main.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import AppRoutes from '@/AppRoutes';
import * as Tooltip from '@radix-ui/react-tooltip';

const renderApp = () => (
  <StrictMode>
    <Theme appearance="dark" hasBackground={false}>
      <BrowserRouter>
        <Tooltip.Provider delayDuration={0}>
          <AppRoutes />
        </Tooltip.Provider>
      </BrowserRouter>
    </Theme>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(renderApp());
