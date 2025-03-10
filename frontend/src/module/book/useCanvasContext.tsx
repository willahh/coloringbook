import { useContext } from 'react';
import { CanvasContext } from './CanvasContext';

const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};
export default useCanvasContext;
