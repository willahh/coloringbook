import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './main.css';
import BookPage from './pages/Book';
import HomePage from './pages/Home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/coloringbook">
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="book" element={<BookPage />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
