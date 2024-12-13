import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Book from './pages/book/Book.tsx';
// import Home from './pages/home/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Book />
    {/* <Home /> */}
  </StrictMode>
);
