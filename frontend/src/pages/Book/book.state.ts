import { IBook, Page } from '@/domain/book';

type BookState = {
  book: IBook | null;
  pages: Page[];
  isModified: boolean;
  refreshGraphics: boolean;
};

export default BookState;
