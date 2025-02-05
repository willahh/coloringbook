import { Book, Page } from '@/types/book';
import BookState, { initialBookState } from './book.state';
import { GraphicAsset } from '@/types/graphic-asset.entity';
import { ElementService } from '@/services/element.service';

type BookAction =
  | { type: 'SET_BOOK'; payload: Book }
  | { type: 'SET_PAGES'; payload: Page[] }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'DELETE_PAGE'; payload: number }
  | { type: 'SET_MODIFIED'; payload: boolean }
  | { type: 'REFRESH_GRAPHICS'; payload: boolean }
  | {
      type: 'ADD_GRAPHIC_ASSET';
      payload: { asset: GraphicAsset; pageId: number };
    }
  | { type: 'EDIT_BOOK_NAME'; payload: string }
  | { type: 'FETCH_BOOK_START' }
  | { type: 'FETCH_BOOK_SUCCESS' }
  | { type: 'FETCH_BOOK_ERROR'; payload: string }
  | { type: 'BOOK_UPDATE_ERROR'; payload: string };


/**
 * [TODO]
 *  - action.pending
 *  - action.fulfilled
 *  - action.rejected
 */

const bookReducer = (state: BookState, action: BookAction): BookState => {
  console.log('#4 bookReducer', action.type, state, action);

  switch (action.type) {
    case 'SET_BOOK': {
      const book = action.payload;
      console.log('#4 SET_BOOK reducer')

      return {
        ...state,
        book: { ...book, pages: action.payload.pages },
      };
    }
    case 'EDIT_BOOK_NAME':
      return {
        ...state,
        book: { ...state.book, name: action.payload },
        isModified: true,
      };
    case 'FETCH_BOOK_START':
      return {
        ...state,
        isLoading: true,
        error: null, // Clear any previous errors when starting a fetch
      };

    case 'FETCH_BOOK_SUCCESS':
      return {
        ...state,
        isLoading: false,
      };

    case 'FETCH_BOOK_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'BOOK_UPDATE_ERROR':
      console.error('Book Update Error:', action.payload);
      return {
        ...state,
        error: action.payload, // Optionally, you might want to store this error for UI display
      };

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

    case 'ADD_GRAPHIC_ASSET': {
      const { asset, pageId } = action.payload;
      const element = ElementService.elementFromGraphicAsset(asset);
      if (!element || !state.book) return state;

      const updatedBook = ElementService.add(
        { ...state.book, pages: state.book.pages },
        element,
        pageId
      );
      return {
        ...state,
        book: updatedBook,
        isModified: true,
      };
    }
    case 'REFRESH_GRAPHICS':
      return { ...state, refreshGraphics: action.payload };
    default:
      return state;
  }
};

export { bookReducer, initialBookState };
export type { BookState, BookAction };
