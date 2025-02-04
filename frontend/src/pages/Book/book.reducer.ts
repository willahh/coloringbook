import { IBook, Page } from '@/domain/book';
import BookState from './book.state';

type BookAction =
  | { type: 'SET_BOOK'; payload: IBook }
  | { type: 'SET_PAGES'; payload: Page[] }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'SET_MODIFIED'; payload: boolean }
  | { type: 'REFRESH_GRAPHICS'; payload: boolean };

const bookReducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'SET_BOOK':
      return { ...state, book: action.payload, pages: action.payload.pages };
    case 'SET_PAGES':
      return { ...state, pages: action.payload, isModified: true };
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, action.payload],
        isModified: true,
      };
    case 'DELETE_PAGE':
      return {
        ...state,
        pages: state.pages.filter((page) => page.pageId !== action.payload),
        isModified: true,
      };
    case 'SET_MODIFIED':
      return { ...state, isModified: action.payload };
    case 'REFRESH_GRAPHICS':
      return { ...state, refreshGraphics: action.payload };
    default:
      return state;
  }
};

const initialBookState: BookState = {
  book: null,
  pages: [],
  isModified: false,
  refreshGraphics: false,
};

export { bookReducer, initialBookState };
export type { BookState, BookAction };
