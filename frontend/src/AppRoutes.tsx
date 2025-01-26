import { Routes, Route } from 'react-router-dom';
import Page from './pages/book/page';
import HomePage from './pages/home/Home';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="book/:bookId" element={<Page />} />
    <Route path="book/:bookId/pages/:pageId" element={<Page />} />
  </Routes>
);

export default AppRoutes;
