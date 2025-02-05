import { Book } from '@/domain/book';

type BookState = {
  book: Book;
  isModified: boolean;
  refreshGraphics: boolean;
};

export default BookState;
