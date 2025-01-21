import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './main.css';
import BookPage from './pages/Book/Book';
import HomePage from './pages/Home/Home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="book/:id" element={<BookPage />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
