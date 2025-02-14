import React from 'react';
import * as fabric from 'fabric';
// import { useParams } from 'react-router-dom';

interface BookContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
}

export const BookContext = React.createContext<BookContextType>({
  canvas: null,
  setCanvas: () => {},
});

export const BookProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);

  return (
    <BookContext.Provider
      value={{
        canvas,
        setCanvas,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
