import { Routes, Route } from 'react-router-dom';
import BookPage from './module/book/Book';
import HomePage from './module/home/Home';
import { BookProvider } from './module/book/Book.context';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="library" element={<HomePage />} />
    <Route
      path="book/:bookId"
      element={
        <BookProvider>
          <BookPage />
        </BookProvider>
      }
    />
    <Route
      path="book/:bookId/pages/:pageId"
      element={
        <BookProvider>
          <BookPage />
        </BookProvider>
      }
    />
  </Routes>
);

export default AppRoutes;
