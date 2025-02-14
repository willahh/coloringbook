import { useContext } from 'react';
import { BookContext } from './Book.context';

const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};
export default useBookContext;
