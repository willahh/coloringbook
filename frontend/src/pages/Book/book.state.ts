import { Book } from '@/domain/book';
import { BookFormat } from '@/domain/book.enum';

type BookState = {
  book: Book;
  isModified: boolean;
  refreshGraphics: boolean;
  isLoading: boolean;
  error: string | null;
};

export const initialBookState: BookState = {
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
  isLoading: false,
  error: null,
};

export default BookState;
