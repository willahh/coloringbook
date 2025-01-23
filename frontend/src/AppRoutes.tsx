import { Routes, Route } from 'react-router-dom';
import BookPage from './pages/Book/BookPage';
import HomePage from './pages/Home/Home';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="book/:id" element={<BookPage />} />
  </Routes>
);

export default AppRoutes;
