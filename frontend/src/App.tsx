import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './main.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import AppRoutes from './AppRoutes';

const renderApp = () => (
  <StrictMode>
    <Theme appearance="dark" hasBackground={false}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Theme>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(renderApp());
