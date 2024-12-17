import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './app.css'; // FIXME: import './app.css' generate a warning : Cannot find module './app.css' or its corresponding type declarations.ts(2307)
import BookPage from './pages/book';
import HomePage from './pages/home';

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
