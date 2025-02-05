import { Routes, Route } from 'react-router-dom';
import BookPage from './pages/Book/page';
import HomePage from './pages/Home/Home';
import { BookProvider } from './pages/Book/book.context';

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
