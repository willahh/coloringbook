import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './app.css';
import Book from './pages/book.tsx';
import Home from './pages/home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/coloringbook'>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="book" element={<Book />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
