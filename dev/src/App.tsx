import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './app.css';
import Book from './pages/book/Book.tsx';
import Home from './pages/home/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="book" element={<Book />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
