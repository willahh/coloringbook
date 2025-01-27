import { Routes, Route } from 'react-router-dom';
import BookPage from '@/pages/book/page';
import HomePage from '@/pages/home/Home';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="book/:bookId" element={<BookPage />} />
    <Route path="book/:bookId/pages/:pageId" element={<BookPage />} />
  </Routes>
);

export default AppRoutes;
