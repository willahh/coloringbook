import { IBook, Page } from '@/domain/book';
import BookState from './book.state';
import { BookFormat } from '@/domain/book.enum';

type BookAction =
  | { type: 'SET_BOOK'; payload: IBook }
  | { type: 'SET_PAGES'; payload: Page[] }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'SET_MODIFIED'; payload: boolean }
  | { type: 'REFRESH_GRAPHICS'; payload: boolean };

const bookReducer = (state: BookState, action: BookAction): BookState => {
  console.log('#4 bookReducer', action.type, state, action);

  switch (action.type) {
    case 'SET_BOOK': {
      const book = action.payload;

      return {
        ...state,
        book: { ...book, pages: action.payload.pages },
      };
    }
    case 'SET_PAGES': {
      const pages = action.payload;
      return {
        ...state,
        book: { ...state.book, pages: pages },
      };
    }
    case 'ADD_PAGE': {
      const page = action.payload;
      return {
        ...state,
        book: { ...state.book, pages: [...state.book.pages, page] },
      };
    }
    case 'DELETE_PAGE': {
      const pageId = action.payload;

      return {
        ...state,
        book: {
          ...state.book,
          pages: state.book.pages.filter((page) => page.pageId !== pageId),
        },
        isModified: true,
      };
    }
    case 'SET_MODIFIED':
      return { ...state, isModified: action.payload };
    case 'REFRESH_GRAPHICS':
      return { ...state, refreshGraphics: action.payload };
    default:
      return state;
  }
};

const initialBookState: BookState = {
  book: {
    coverImage: '',
    format: BookFormat.A4_PORTRAIT,
    id: 0,
    name: '',
    pageCount: 0,
    pages: [],
  },
  isModified: false,
  refreshGraphics: false,
};

export { bookReducer, initialBookState };
export type { BookState, BookAction };
