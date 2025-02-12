import React from 'react';
import * as fabric from 'fabric';
import { useParams } from 'react-router-dom';

interface BookContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  pageParams: {
    bookId?: string;
    pageId?: string;
  };
}

export const BookContext = React.createContext<BookContextType>({
  canvas: null,
  setCanvas: () => {},
  pageParams: {
    bookId: '',
  },
});

export const BookProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const params = useParams();
  const pageParams = {
    bookId: params.bookId,
    pageId: params.pageId,
  };

  return (
    <BookContext.Provider
      value={{
        canvas,
        setCanvas,
        pageParams,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
