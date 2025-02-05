import React, { useReducer } from 'react';
import * as fabric from 'fabric';
import { Book } from '@/domain/book';
import { useParams } from 'react-router-dom';
import BookState from './book.state';
import { initialBookState, BookAction, bookReducer } from './book.reducer';

// Custom Thunk
// Create a custom dispatch type that can handle both regular actions and thunks
type ThunkAction = (dispatch: React.Dispatch<BookAction>) => void;
type DispatchType = React.Dispatch<BookAction | ThunkAction>;
// </>

// type BookAction = { type: 'SET_PAGES'; payload: Page[] };

interface BookContextType {
  state: BookState;
  dispatch: DispatchType;
  canvas: fabric.Canvas | null;

  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>; // TODO: Use action/dispatch instead
  book?: Book | null;
  pageParams: {
    bookId?: string;
    pageId?: string;
  };

  // setPages: (action: BookAction) => void; // TODO: Use action/dispatch instead
  // isModified: boolean; // TODO: Use action/dispatch instead
  // refreshGraphics: boolean; // TODO: Use action/dispatch instead
  // setRefreshGraphics: React.Dispatch<React.SetStateAction<boolean>>; // TODO: Use action/dispatch instead
}

export const BookContext = React.createContext<BookContextType>({
  state: initialBookState,
  dispatch: () => {
    console.log('#4 set dispatch from bookcontext');
  },
  canvas: null,

  setCanvas: () => {},
  book: null,
  pageParams: {
    bookId: '',
  },
  // setPages: function (action: BookAction): void {
  //   throw new Error(`Function not implemented. ${action}`);
  // },
  // isModified: false,
  // refreshGraphics: false,
  // setRefreshGraphics: function (): void {
  //   throw new Error('Function not implemented.');
  // },
});

export const BookProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, regularDispatch] = useReducer(bookReducer, initialBookState);

  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [book /*, setBook*/] = React.useState<Book | null>(null);
  // const [isModified /*, setIsModified*/] = React.useState<boolean>(false);
  // const [refreshGraphics, setRefreshGraphics] = React.useState<boolean>(false);
  const params = useParams();
  const pageParams = {
    bookId: params.bookId,
    pageId: params.pageId,
  };

  const dispatch: DispatchType = (action: BookAction | ThunkAction) => {
    console.log('#4 call dispatch', action);
    if (typeof action === 'function') {
      action(regularDispatch);
    } else {
      regularDispatch(action);
    }
  };

  // const setPages = (action: BookAction) => {
  //   dispatch(action);
  // };

  return (
    <BookContext.Provider
      value={{
        state,
        dispatch,

        canvas,
        setCanvas,
        book,
        pageParams,
        // setPages,
        // isModified,
        // refreshGraphics,
        // setRefreshGraphics,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
