import { Routes, Route } from 'react-router-dom';
import BookPage from './module/book/Book';
import HomePage from './module/home/Home';
import { CanvasProvider } from './module/book/Canvas.context';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="library" element={<HomePage />} />
    <Route
      path="book/:bookId"
      element={
        <CanvasProvider>
          <BookPage />
        </CanvasProvider>
      }
    />
    <Route
      path="book/:bookId/pages/:pageId"
      element={
        <CanvasProvider>
          <BookPage />
        </CanvasProvider>
      }
    />
  </Routes>
);

export default AppRoutes;
