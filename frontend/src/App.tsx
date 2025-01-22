import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import BookPage from './pages/Book/Book';
import HomePage from './pages/Home/Home';
import './main.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" hasBackground={false}>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="book/:id" element={<BookPage />}></Route>
        </Routes>
      </BrowserRouter>
    </Theme>
  </StrictMode>
);
