import { IBook } from '@/domain/book';

type BookState = {
  book: IBook;
  isModified: boolean;
  refreshGraphics: boolean;
};

export default BookState;
