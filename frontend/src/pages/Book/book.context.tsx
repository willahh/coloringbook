import React from 'react';
import * as fabric from 'fabric';
import { IBook, Page } from '@/domain/book';
import { useParams } from 'react-router-dom';

type BookAction = { type: 'SET_PAGES'; payload: Page[] };

interface BookContextType {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  book?: IBook | null;
  pageParams: {
    bookId?: string;
    pageId?: string;
  };
  setPages: (action: BookAction) => void;
  isModified: boolean;
  refreshGraphics: boolean;
  setRefreshGraphics: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BookContext = React.createContext<BookContextType>({
  canvas: null,
  setCanvas: () => {},
  book: null,
  pageParams: {
    bookId: '',
  },
  setPages: function (action: BookAction): void {
    throw new Error(`Function not implemented. ${action}`);
  },
  isModified: false,
  refreshGraphics: false,
  setRefreshGraphics: function (): void {
    throw new Error('Function not implemented.');
  },
});

export const BookProvider: React.FC<{
  children: React.ReactNode;
  dispatch: React.Dispatch<BookAction>;
}> = ({ children, dispatch }) => {
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [book /*, setBook*/] = React.useState<IBook | null>(null);
  const [isModified /*, setIsModified*/] = React.useState<boolean>(false);
  const [refreshGraphics, setRefreshGraphics] = React.useState<boolean>(false);
  const params = useParams();
  const pageParams = {
    bookId: params.bookId,
    pageId: params.pageId,
  };

  const setPages = (action: BookAction) => {
    dispatch(action);
  };

  return (
    <BookContext.Provider
      value={{
        canvas,
        setCanvas,
        book,
        pageParams,
        setPages,
        isModified,
        refreshGraphics,
        setRefreshGraphics,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
