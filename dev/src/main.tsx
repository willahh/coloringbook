import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Edit from './pages/edit/Edit.tsx';
// import Home from './pages/home/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Edit />
    {/* <Home /> */}
  </StrictMode>
);
