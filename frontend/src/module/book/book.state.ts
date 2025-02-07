import { RootState } from '@/store';
import { Book } from '@/types/book';
import { BookFormat } from '@/types/book.enum';
import { GraphicAsset } from '@/types/graphic-asset.entity';

interface BookState {
  book: Book;
  areLocalUpdatesSaved: boolean;
  refreshGraphics: boolean;
  graphicAssets: GraphicAsset[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  book: {
    coverImage: '',
    format: BookFormat.A4_PORTRAIT,
    id: 0,
    name: '',
    pageCount: 0,
    pages: [],
  },
  areLocalUpdatesSaved: true,
  refreshGraphics: false,
  graphicAssets: [],
  isLoading: false,
  error: null,
};

export const selectIsLoading = (state: RootState) => state.book.isLoading;
export const selectBook = (state: RootState) => state.book;

export default initialState;
